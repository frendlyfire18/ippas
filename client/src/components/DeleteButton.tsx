import {DeletePostMutationVariables, useDeletePostMutation} from "../generated/graphql";
import {useRouter} from "next/router";
import {Button} from "@chakra-ui/react";
import {DeleteIcon} from "@chakra-ui/icons";
import React from "react";

export default function DeleteButton({id,authorId}) {
    const [,deletePost] = useDeletePostMutation()
    const router = useRouter();
    return(
        <>
            <Button _hover={{
                color:"black",
                background:"white"
            }} onClick={async ()=>{
                const res = await deletePost({_id:id} as DeletePostMutationVariables)
                if(res.error){
                    alert("Not Authorized")
                    router.push("/login");
                }
            }} ml="5" bg={"blackAlpha.400"} >
                <DeleteIcon/>
            </Button>
        </>
    )
}