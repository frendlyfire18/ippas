import {Field, ObjectType} from "type-graphql";
import {
    Column,
    Entity,
    ObjectIdColumn,
    BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export class Category extends BaseEntity{
    @Field(()=>String)
    @ObjectIdColumn()
    _id!:string;

    @Field(()=>String)
    @Column()
    category!:String
}