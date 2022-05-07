import {Field, ObjectType} from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ObjectID,
    ObjectIdColumn,
    OneToMany,
    UpdateDateColumn
} from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity{
    @Field(()=>String)
    @ObjectIdColumn()
    _id!:string;

    @Field(()=>String)
    @Column({type:"text",unique:true})
    username!: string;

    @Field(()=>String,{nullable:true})
    @Column({type:"text",unique:true})
    email!: string;

    @Field(()=>String)
    @Column({type:"text"})
    password!: string;

    @Field(()=>String)
    @Column()
    posts!: string[];

    @Field(()=>String)
    @CreateDateColumn()
    createdAt!:Date;

    @Field(()=>String)
    @UpdateDateColumn()
    updatedAt!:Date;
}