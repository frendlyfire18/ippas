import {Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware} from "type-graphql";
import {Post} from "../entities/Post";
import {MyContext} from "../utils/types";
import {ObjectID} from "mongodb"
import {User} from "../entities/User";
import {isAuth} from "../middlewares/isAuth";
import {Votes} from "../entities/Votes";
import {Category} from "../entities/Category";
import {limit_with_cursor} from "../utils/Limit_with_cursor";
import {FindOneOptions} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

@ObjectType()
class PostResponse{
    @Field(()=>[Post])
    posts:Post[]

    @Field()
    hasMore: boolean;

}

const hasMore = (array:Post[],_id:String,limit:number)=>{
    let res = _id === null;
    let _id_number = 0;
    array.forEach((post,number)=>{
        if (ObjectID(_id) === post._id.toString()){
            _id_number = number;
        }
    })
    return res||(_id_number+limit)<array.length;
}

@Resolver()
export class PostResolver{

    @Mutation(()=>Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg("postId")postId:String,
        @Ctx(){req}:MyContext
    ){
        const candidate = await Votes.findOne({where:{postId:postId,userId:req.session.userId}});
        if(candidate&&candidate.value === 1){
            await Votes.delete({postId:postId,userId:req.session.userId});
            const res = await Post.findOne({_id:ObjectID(postId)} as FindOneOptions<Post>);
            res.points -= 1;
            await Post.update({_id:ObjectID(postId)},res as QueryDeepPartialEntity<Post>);
            return true;
        }else if(candidate&&candidate.value === -1){
            await Votes.delete({postId:postId,userId:req.session.userId});
            const vote = Votes.create({
                userId:req.session.userId,
                postId:postId,
                value:1
            });
            await vote.save();
            const res = await Post.findOne({_id:ObjectID(postId)} as FindOneOptions<Post>);
            res.points += 2;
            await Post.update({_id:ObjectID(postId)},res as QueryDeepPartialEntity<Post>);
            return true;
        }
        const res = await Post.findOne({_id:ObjectID(postId)} as FindOneOptions<Post>);
        res.points+= 1;
        const vote = Votes.create({
            userId:req.session.userId,
            postId:postId,
            value:1
        });
        await Post.update({_id:ObjectID(postId)},res as QueryDeepPartialEntity<Post>);
        await vote.save();
        return true;
    }

    @Mutation(()=>Boolean)
    @UseMiddleware(isAuth)
    async unvote(
        @Arg("postId")postId:String,
        @Ctx(){req}:MyContext
    ){
        const candidate = await Votes.findOne({where:{postId:postId,userId:req.session.userId}});
        if(candidate&&candidate.value === 1){
            await Votes.delete({postId:postId,userId:req.session.userId});
            const vote = Votes.create({
                userId:req.session.userId,
                postId:postId,
                value:-1
            });
            await vote.save();
            const res = await Post.findOne({_id:ObjectID(postId)} as FindOneOptions<Post>);
            res.points -= 2;
            await Post.update({_id:new ObjectID(postId)},res as QueryDeepPartialEntity<Post>);
            return true;
        }else if(candidate&&candidate.value === -1){
            await Votes.delete({postId:postId,userId:req.session.userId});
            const res = await Post.findOne({_id:ObjectID(postId)} as FindOneOptions<Post>);
            res.points += 1;
            await Post.update({_id:ObjectID(postId)},res as QueryDeepPartialEntity<Post>);
            return true;
        }
        const res = await Post.findOne({_id:ObjectID(postId)} as FindOneOptions<Post>);
        res.points -= 1;
        const vote = Votes.create({
            userId:req.session.userId,
            postId:postId,
            value:-1
        });
        await vote.save();
        await Post.update({_id:ObjectID(postId)},res as QueryDeepPartialEntity<Post>) ;
        return true;
    }


    @Query(() => PostResponse)
    async getPosts(
        @Arg('_id',()=>String,{nullable:true})_id:string,
        @Arg('limit',()=>Int)limit:number,
        @Arg('categoryId',()=>String,{nullable:true})categoryId:string,
        @Ctx(){req}:MyContext
    ):Promise<PostResponse|null>{
        let posts_res = await Post.find({});
        const rs = await Votes.find({where:{userId:req.session.userId}})
        posts_res.map(post=>{
            post.createdAt = new Date(post.createdAt).toISOString()
            rs.map(vote=>{
                if(vote?.postId === post._id.toString()){
                    if(vote?.value === 1){
                        post.voteStatus = 1
                    }else{
                        post.voteStatus = -1
                    }
                }
            })
        })
        return {
            posts:limit_with_cursor(_id,limit,posts_res,req.session.userId),
            hasMore:hasMore(posts_res,_id,limit)
        }
    }

    @Query(()=>[Category])
    async getAnswer():Promise<Category[]>{
        return await Category.find({});
    }

    @Query(() => PostResponse)
    async getPostsByName(
        @Arg('_id',()=>String,{nullable:true})_id:string,
        @Arg('limit',()=>Int)limit:number,
        @Arg('name',()=>String,{nullable:true})name:string,
        @Ctx(){req}:MyContext
    ):Promise<PostResponse>{
        let posts_res = await Post.find({});

        if(name !== undefined){
            posts_res = posts_res.filter(p=>p.title.toLowerCase().includes(name.toLowerCase()));
        }

        posts_res.map(post=>{
            post.createdAt = new Date(post.createdAt).toISOString()
        })

        for (const p of posts_res) {
            p.user = await User.findOne({_id:new ObjectID(p.userId)});
            await Post.update({_id:p._id},p);
            const vote = await Votes.findOne({where:{userId:req.session.userId,postId: p._id.toString() }})
            if(vote){
                p.voteStatus = vote.value;
            }
        }
        return {
            posts:limit_with_cursor(_id,limit,posts_res,req.session.userId),
            hasMore:hasMore(posts_res,_id,limit)
        }
    }

    @Query(() => PostResponse)
    async sort(
        @Arg('categoryId',()=>String,{nullable:true})categoryId:string,
        @Ctx(){req}:MyContext
    ):Promise<PostResponse>{
        const posts_res = await Post.find({});
        const real_result = posts_res.filter(p=>p.categoryId.includes(categoryId.toString()));

        for (const p of real_result) {
            p.user = await User.findOne({_id:new ObjectID(p.userId)});
            await Post.update({_id:p._id},p);
            const vote = await Votes.findOne({where:{userId:req.session.userId,postId: p._id.toString() }})
            if(vote){
                p.voteStatus = vote.value;
            }
        }

        real_result.map(post=>{
            post.createdAt = new Date(post.createdAt).toISOString()
        })

        return {
            posts:real_result,
            hasMore:false
        }
    }

    @Query(() => Post,{nullable:true})
    async getOnePost(
        @Arg('_id',()=>String)_id:string,
    ):Promise<Post>{
        const res = await Post.findOne({ _id:new ObjectID(_id) });
        const realDate = new Date(res.createdAt).toDateString();
        res.createdAt = realDate;
        if(res?.user.posts){
            res?.user.posts = res?.user.posts[res?.user?.posts?.length-1]
        }
        return res;
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('title',()=>String)title:string,
        @Arg('text',()=>String)text:string,
        @Arg('categoryId',()=>String,{nullable:true})categoryId:string,
        @Arg('imageUrl',()=>String,{nullable:true})imageUrl:string,
        @Ctx(){req}:MyContext
    ):Promise<Post>{
        const user = await User.findOne({_id:new ObjectID(req.session.userId)});
        const post = Post.create({ title:title,text:text,userId:new ObjectID(req.session.userId),points:0,user:user,categoryId:categoryId,imageURL:imageUrl});
        await post.save();
        await User.update({_id:new ObjectID(req.session.userId)},(user?.posts)?{posts:[...user.posts,post._id]}:{posts:[post._id]})
        return post;
    }

    @Mutation(() => Post,{nullable:true})
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg('_id',()=>String)_id:string,
        @Arg('title',()=>String,{nullable:true})title:string,
        @Arg('text',()=>String,{nullable:true})text:string,
        @Arg('categoryId',()=>String,{nullable:true})categoryId:string,
        @Arg('imageURL',()=>String,{nullable:true})imageURL:string
    ):Promise<Post | null>{
        const post = await Post.findOne({ _id:ObjectID(_id) } as FindOneOptions<Post>);
        if(!post)
            return null;

        if(typeof post.title !== "undefined"){
            post.title = title;
            post.text = text;
            post.imageURL = imageURL;
            post.categoryId = categoryId;
            await Post.update({_id:new ObjectID(_id)},post);
        }

        return post;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg('_id',()=>String)_id:string,
        @Ctx(){req}:MyContext
    ):Promise<boolean>{
        const res = await Post.findOne({ "_id": ObjectID(_id) })
        if(!res){
            return false
        }
        if(!res.userId.toString().includes(req.session.userId)){
            throw new Error("Not authorized")
        }
        try{
            await Post.delete({ "_id": ObjectID(_id) });
            return true;
        }catch (e){
            console.log(e);
            return false;
        }
    }

    @Query(()=>String,{nullable:true})
    getMyId(
        @Ctx(){req}:MyContext
    ){
        return req.session.userId
    }
}