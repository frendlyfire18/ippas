import {useVoteMutation} from "../generated/graphql";
import {useRouter} from "next/router";
import {Button} from "@chakra-ui/react";
import {TriangleUpIcon} from "@chakra-ui/icons";
import React from "react";

export default function VoteButton({id,voted}){
    const [{fetching},vote] = useVoteMutation();
    const router = useRouter();
    return (
        <>
            <Button _hover={{
                color:"black",
                background:"white"
            }} onClick={async ()=>{
                const res = await vote({postId:id});
                if(res?.error?.message.includes("Not authorized"))
                    router.push("/login");
            }} isLoading={fetching} width={10} bg={voted?"blackAlpha.400":"transparent"}>
                <TriangleUpIcon/>
            </Button>
        </>
    );
}