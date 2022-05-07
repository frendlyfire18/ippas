import {useGetAllCategoriesQuery} from "../generated/graphql";
import {useRouter} from "next/router";
import {Box, Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {HamburgerIcon} from "@chakra-ui/icons";
import React from "react";

const Categories=()=>{
    const [{data}] = useGetAllCategoriesQuery();
    const router = useRouter();
    return(
        <Box>
            <Menu>
                <MenuButton colorScheme='brand' as={Button} leftIcon={<HamburgerIcon />}>
                    Категории
                </MenuButton>
                <MenuList>
                    {
                        data?.getCategories.map(category=>(
                                <MenuItem
                                    onClick={()=>{
                                        router.push("/findbycategory/"+category._id)
                                    }}
                                >{category.category}</MenuItem>
                            )
                        )
                    }
                </MenuList>
            </Menu>
        </Box>
    )
}
export default Categories