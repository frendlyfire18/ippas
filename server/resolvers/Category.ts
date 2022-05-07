import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Category} from "../entities/Category";
import {MyContext} from "../utils/types";
import {ObjectID} from "mongodb"
import {FindOneOptions} from "typeorm";

@Resolver()
export class CategoriesResolver {

    @Mutation(()=>Category,{nullable:true})
    async addCategory(
        @Arg("name")name:String,
        @Ctx(){req}:MyContext
    ):Promise<Category|null>{
        if(req.session.userId){
            const record = Category.create({category:name});
            await record.save();
            return record;
        }
        return null;
    }

    @Mutation(()=>Boolean)
    async deleteCategory(
        @Arg("_id",()=>String)_id:string,
    ):Promise<boolean>{
        try {
            await Category.delete({ "_id": new ObjectID(_id)});
            return true;
        }catch(e){
            console.log(e)
            return false;
        }
    }

    @Query(()=>[Category])
    async getCategories():Promise<Category[]>{
        return await Category.find({});
    }

    @Query(()=>Category,{nullable:true})
    async getOneCategory(
        @Arg("categoryId",()=>String)categoryId:string
    ):Promise<Category>{
        const _id = ObjectID(categoryId)
        return await Category.findOne({_id:_id})
    }
}