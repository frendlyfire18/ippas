import {useUnVoteMutation} from "../generated/graphql";
import {useRouter} from "next/router";
import {Button} from "@chakra-ui/react";
import {TriangleDownIcon} from "@chakra-ui/icons";
import React from "react";

export default function UnVoteButton({id,unvoted}) {
    const [{fetching},unvote] = useUnVoteMutation();
    const router = useRouter();
    return (
        <>
            <Button _hover={{
                color:"black",
                background:"white"
            }} onClick={async ()=>{
                const res = await unvote({postId:id});
                if(res?.error?.message.includes("Not authorized"))
                    router.push("/login");
            }} isLoading={fetching} width={10} bg={unvoted?"blackAlpha.400":"transparent"}>
                <TriangleDownIcon/>
            </Button>
        </>
    );
}