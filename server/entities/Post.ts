import {Field, ObjectType} from "type-graphql";
import {
    Column,
    Entity,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from "typeorm";
import {User} from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity{
    @Field(()=>String)
    @ObjectIdColumn()
    _id!:string;

    @Field(()=>String)
    @Column()
    title!: string;

    @Field(()=>String)
    @Column()
    text!: string;

    @Field(()=>String)
    @Column()
    imageURL!: string;

    @Field(()=>String)
    @Column()
    userId!:string;

    @Field(()=>User)
    @Column()
    user!:User;

    @Field(()=>String,{nullable:true})
    @Column()
    categoryId!:string;

    @Field(()=>Number,{nullable:true})
    voteStatus!:number ;

    @Field(()=>Number)
    @Column({default:0})
    points!: number;

    @Field(()=>String)
    @CreateDateColumn()
    createdAt!:Date;

    @Field(()=>String)
    @UpdateDateColumn()
    updatedAt!:Date;
}