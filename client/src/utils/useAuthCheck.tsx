import {useCheckAuthQuery} from "../generated/graphql";
import {isServer} from "./isServer";
import React, {useEffect} from "react";
import Router from "next/router";

export const UseAuthCheck =()=>{
    console.log(Router);
    const [{data,fetching}] = useCheckAuthQuery({
        pause:isServer
    });
    useEffect(() => {
        if(data?.checkAuth?.error||!data?.checkAuth){
            Router.replace("/login?next="+Router.pathname);
        }
    },[fetching,data,Router])
}