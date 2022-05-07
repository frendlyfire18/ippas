import {Button} from "@chakra-ui/react";
import {EditIcon} from "@chakra-ui/icons";
import React from "react";
import {useRouter} from "next/router";

export default function EditButton({id}) {
    const router = useRouter()
    return(
        <>
            <Button onClick={()=>{
                router.push("/update-post/"+id)
            }} _hover={{
                color:"black",
                background:"white"
            }} ml="5" bg={"blackAlpha.400"} >
                <EditIcon/>
            </Button>
        </>
    )
}