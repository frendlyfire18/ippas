
import {
    AuthorisationMutation,
    CheckAuthDocument,
    CheckAuthQuery,
    CreatePostDocument,
    CreatePostMutation,
    DeletePostMutationVariables,
    GetAllPostsQueryDocument,
    GetAllPostsQueryQuery,
    LogoutMutation,
    RegistrationMutation,
    UnVoteMutationVariables,
    VoteMutationVariables
} from "../generated/graphql";
import {dedupExchange, fetchExchange} from "urql";
import {cacheExchange, Resolver,Cache} from "@urql/exchange-graphcache";
import {betterUpdateQuery} from "./betterUpdateQuery";
import { gql } from '@urql/core';
import {Post} from "../../../server/src/entities/Post";
import {isServer} from "./isServer";

const idPagination = ():Resolver=> {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        const allFields = cache.inspectFields(entityKey);
        const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        info.partial = true;
        const result:string[] = [];
        let hasMore = true;
        fieldInfos.forEach(fi=>{
            const key = cache.resolveFieldByKey(entityKey,fi.fieldKey) as string;
            const res = cache.resolve(key,"posts") as string[];
            const _hasMore = cache.resolve(key,"hasMore");
            if(!_hasMore)
                hasMore = _hasMore as boolean;
            result.push(...res);
        })

        const obj = {
            __typename:"PostResponse",
            posts:result,
            hasMore
        }
        return obj;
}};

//this is func which return urql client need for communicate with graphql server
//make convince work with graphql
export const createUrqlClient = (ssrExchange:any,ctx:any)=>{
    let cookie = '';
    if(isServer){
        cookie = ctx.req.headers.cookie;
    }
    return {
        url: 'http://localhost:4000/graphql',//url of graphql server
    fetchOptions:{
        credentials:"include" as const,//mode need for sending and working cookie
        headers:cookie?{
            cookie
        }:undefined
    },
    exchanges: [dedupExchange, cacheExchange({//exchanges whose can make urql with cache, need for updating cache, because page didn't update without this
        keys:{
           PaginatedPost:()=>null,
        },
        resolvers: {
            Query: {
                getPosts: idPagination(),
            },
        },
        updates: {
            Mutation: {
                deletePost:(_result,args,cache,info)=>{
                    cache.invalidate({__typename:"Post",id:(args as DeletePostMutationVariables)._id})
                },
                vote:(_result,args,cache,info)=>{
                    const {postId} = args as VoteMutationVariables;
                    const data = cache.readFragment(
                        gql`
                            fragment _ on Post {
                                _id
                                points
                            }
                        `,
                        { _id: postId } as any
                    );
                    if(data){
                        const newPoints = (data.points as number) + 1;
                        cache.writeFragment(
                            gql`
                                fragment _ on Post {
                                    points
                                }
                            `,
                            { _id: postId, points: newPoints} as any
                        );
                    }
                },
                unvote:(_result,args,cache,info)=>{
                    const {postId} = args as UnVoteMutationVariables;
                    const data = cache.readFragment(
                        gql`
                            fragment _ on Post {
                                _id
                                points
                            }
                        `,
                        { _id: postId } as any
                    );
                    if(data){
                        const newPoints = (data.points as number) - 1;
                        cache.writeFragment(
                            gql`
                                fragment _ on Post {
                                    points
                                }
                            `,
                            { _id: postId, points: newPoints} as any
                        );
                    }
                },
                createPost:(_result,args,cache,info)=>{
                    const allFields = cache.inspectFields("Query");
                    const fieldsInfo = allFields.filter(
                        (info)=>info.fieldName==="getPosts"
                    );
                    fieldsInfo.forEach(
                        (fi)=>{
                            cache.invalidate("Query","getPosts",fi.arguments||{})
                        }
                    )
                },
                logout:(_result,args,cache,info)=>{//logout
                    betterUpdateQuery<LogoutMutation,CheckAuthQuery>(//func which create correct query and with this typed query update cache
                        cache,
                        {query:CheckAuthDocument},
                        _result,
                        ()=>({checkAuth:null})
                    );
                },
                authorisation:(_result,args,cache,info)=>{
                    betterUpdateQuery<AuthorisationMutation,CheckAuthQuery>(
                        cache,
                        {query:CheckAuthDocument},
                        _result,
                        (result,query)=>{
                            if(result.authorisation.error){
                                return query;
                            }else{
                                return {
                                    checkAuth:result.authorisation
                                }
                            }
                        }
                    );
                },
                registration:(_result,args,cache,info)=>{
                    betterUpdateQuery<RegistrationMutation,CheckAuthQuery>(
                        cache,
                        {query:CheckAuthDocument},
                        _result,
                        (result,query)=>{
                            if(result.registration.error){
                                return query;
                            }else{
                                return {
                                    checkAuth:result.registration
                                }
                            }
                        }
                    );
                }
            }
        },
    }),ssrExchange, fetchExchange],
}
}