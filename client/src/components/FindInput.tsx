import React, {useState} from "react";
import {useRouter} from "next/router";
import {Button, Input, InputGroup, InputLeftAddon} from "@chakra-ui/react";
import {Search2Icon} from "@chakra-ui/icons";

const FindInput=()=>{
    const [text,setText] = useState("")
    const router = useRouter();
    return(
        <InputGroup size='md'>
            <InputLeftAddon bg={"#44337A"} color={"white"} children='Искать:' />
            <Input
                pr='4.5rem'
                type={'text'}
                placeholder='Введите название блога...'
                value={text}
                onChange={event=>{
                    setText(event.target.value)
                }}
            />
            <Button
                onClick={()=>{
                    router.push("/findbyname/"+text)
                }}
                leftIcon={<Search2Icon/>} colorScheme='brand'>
                Поиск
            </Button>
        </InputGroup>
    )
}
export default FindInput