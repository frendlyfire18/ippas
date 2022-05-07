import {Arg, Ctx, Field, FieldResolver, InputType, Mutation, ObjectType, Query, Resolver, Root} from "type-graphql";
import {MyContext} from "../utils/types";
import {User} from "../entities/User";
import argon2 from "argon2";
import {sendMail} from "../utils/sendMail";
import {v4} from "uuid";
import {ObjectID} from "mongodb"

@InputType()
class UserInput{
    @Field()
    username?: string;

    @Field()
    email?: string ;

    @Field()
    password?: string ;
}

@InputType()
class UserAuthInput{
    @Field()
    usernameORemail?: string;

    @Field()
    password?: string ;
}

@ObjectType()
class Error{
    @Field()
    field?: string ;

    @Field()
    message?: string ;
}

@ObjectType()
class Response{
    @Field(()=>[Error],{nullable:true})
    error?:Error[];

    @Field(()=>User,{nullable:true})
    user?:User;
}

function checkLogin(loginString:string){
    const pattern = /^[\w\d_.+-]+@[\w\d-]+.[\w]+$/;
    return pattern.test(loginString);
}

function checkPass(loginString:string){
    const pattern = /^[^<>%$\[\]\\\/\&\!\@\?\$]*$/;
    return pattern.test(loginString);
}

@Resolver(User)
export class UserResolver {
    @FieldResolver(()=>String)
    email(@Root()user:User,@Ctx(){req}:MyContext){
        if(req.session.userId === user._id)
            return user.email;
        return null;
    }

    @Query(()=>Response,{nullable:true})
    async checkAuth(
        @Ctx(){req}:MyContext
    ):Promise<Response>{
        if(req.session.userId){
            const user = await User.findOne({_id:new ObjectID(req.session.userId)})
            return {
                user:user
            }
        }else{
            return {
                error:[
                    {
                        field:"User",
                        message:"User don't authorized"
                    }
                ],
            }
        }
    }

    @Mutation(()=>Response)
    async changePassword(
        @Arg('token')token:String,
        @Arg('password')password:String,
        @Ctx(){redis,req}:MyContext
    ):Promise<Response | null>{
        if(!checkPass(password)){
            return{
                error:[
                    {
                        field:"password",
                        message:"Bad input"
                    }
                ]
            }
        }
        if(password.length <=3){
            return {
                error:[
                    {
                        field:"password",
                        message:"Length of password can't be less than 3 symbols"
                    }
                ]
            };
        }
        const key = "forgot-pass"+token;
        const userId = await redis.get(key);
        console.log(userId);
        if(!userId){
            return {
                error:[
                    {
                        field:"password",
                        message:"token doesn't exist"
                    }
                ]
            };
        }
        const user = await User.findOne({_id:new ObjectID(userId.toString()).toString()});
        if(!user){
            return {
                error:[
                    {
                        field:"user",
                        message:"user doesn't exist"
                    }
                ]
            };
        }
        user.password = await argon2.hash(password.toString());
        await User.update({_id:new ObjectID(userId)},user);

        await redis.del(key);

        req.session.userId = user._id;

        return {user};
    }

    @Mutation(()=>Response)
    async forgotPassword(
        @Arg('email')email:String,
        @Ctx(){redis}:MyContext
    ):Promise<Response | null>{
        if(!checkLogin(email)){
            return {
                error:[
                    {
                        field:"email",
                        message:"Bad input"
                    }
                ]
            };
        }
        if(!email.includes("@")){
            return {
                error:[
                    {
                        field:"email",
                        message:"This is not an email"
                    }
                ]
            };
        }
        const res = await User.findOne({where:{email:email.toString()}});
        if(!res){
            return {
                error:[
                    {
                        field:"email",
                        message:"User with this email doesn't exist"
                    }
                ]
            };
        }


        const token = v4();

        redis.set("forgot-pass"+token,res._id,"ex",1000*60*60*24*3);

        await sendMail({to:email.toString(),text:`<a href = \"http://localhost:3000/change-pass/${token}\">Reset password<a>`});
        return {
            user:{
                email:email.toString()
            }
        };
    }

    @Mutation(()=>Response,{nullable:true})
    async authorisation(
        @Arg('options')options:UserAuthInput,
        @Ctx(){req}:MyContext
    ):Promise<Response | null>{
        if(!checkLogin(options.usernameORemail)||!checkPass(options.password)){
            return {
                error:[
                    {
                        field:"name",
                        message:"Bad input"
                    },
                    {
                        field:"password",
                        message:"Bad input"
                    }
                ]
            };
        }
        if(options.password.length <=3 && options.usernameORemail.length <=2){
            return {
                error:[
                    {
                        field:"name",
                        message:"Length of username can't be less than 2 symbols"
                    },
                    {
                        field:"password",
                        message:"Length of password can't be less than 3 symbols"
                    }
                ]
            };
        }
        if(options.usernameORemail.length <=2){
            return {
                error:[
                    {
                        field:"name",
                        message:"Length of username can't be less than 2 symbols"
                    }
                ]
            };
        }
        if(options.password.length <=3){
            return {
                error:[
                    {
                        field:"password",
                        message:"Length of password can't be less than 3 symbols"
                    }
                ]
            };
        }

        const candidate = await User.findOne((
            options.usernameORemail.includes("@"))
            ?
            {where:{email:options.usernameORemail}}
            :
            {where:{username:options.usernameORemail}}
        );

        if(candidate){
            if(await argon2.verify(candidate.password, options!.password!)){
                req.session.userId = candidate._id;
                return {
                    user:candidate
                }
            }else{
                return {
                    error:[
                        {
                            field:"password",
                            message:"Incorrect Password"
                        }
                    ],
                }
            }
        }else{
            return {
                error:[
                    {
                        field:"name",
                        message:"User didn't find"
                    }
                ],
            }
        }
    }

    @Mutation(()=>Boolean)
    logout(
        @Ctx(){req,res}:MyContext
    ){
        return new Promise((resolve)=>
            req.session.destroy((err: any)=>{
                res.clearCookie("qid");
                if(err){
                    console.log(err);
                    resolve(false);
                    return;
                }else{
                    resolve(true);
                }
            })
        )
    }

    @Mutation(()=>Response)
    async registration(
        @Arg('options')options:UserInput,
        @Ctx(){req}:MyContext
    ):Promise<Response>{
        if(!checkLogin(String(options.username))||!checkPass(String(options.password))||!checkLogin(String(options.email))){
            return {
                error:[
                    {
                        field:"name",
                        message:"Bad input"
                    },
                    {
                        field:"password",
                        message:"Bad input"
                    }
                    ,
                    {
                        field:"email",
                        message:"Bad input"
                    }
                ]
            };
        }
        if(options!.password!.length <=3 && options!.username!.length <=2){
            return {
                error:[
                    {
                        field:"name",
                        message:"Length of username can't be less than 2 symbols"
                    },
                    {
                        field:"password",
                        message:"Length of password can't be less than 3 symbols"
                    }
                ]
            };
        }
        if(options!.username!.length <=2){
            return {
                error:[
                    {
                        field:"name",
                        message:"Length of username can't be less than 2 symbols"
                    }
                ]
            };
        }
        if(options!.password!.length <=3){
            return {
                error:[
                    {
                        field:"password",
                        message:"Length of password can't be less than 3 symbols"
                    }
                ]
            };
        }

        const user = await User.findOne({where:{username:options.username}})
        if(!user){
            try {
                const hash = await argon2.hash(options.password);
                options.password = hash;
                const user = User.create({username:options.username,password:options.password,email:options.email});
                await user.save();
                req.session.userId = user._id;
                return {
                    user:user
                };
            } catch (err) {
                return {
                    error:[
                        {
                            field:"DB error",
                            message:"Something wrong with db"
                        }
                    ]
                };
            }
        }else{
            return {
                error:[
                    {
                        field:"name",
                        message:"User already exist"
                    }
                ]
            }
        }
    }
}