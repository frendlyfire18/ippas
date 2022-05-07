import {Field, ObjectType} from "type-graphql";
import {
    Column,
    Entity,
    ObjectIdColumn,
    CreateDateColumn,
    BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export class Votes extends BaseEntity{
    @Field(()=>String)
    @ObjectIdColumn()
    _id!:string;

    @Field(()=>String)
    @Column()
    userId!:String

    @Field(()=>String)
    @Column()
    postId!:String

    @Field(()=>Number)
    @Column()
    value!:Number

    @Field(()=>String)
    @CreateDateColumn()
    createdAt!:Date;
}