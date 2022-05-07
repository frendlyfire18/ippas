import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useGetOneCategoryQuery} from "../generated/graphql";
import {Box} from "@chakra-ui/react";
import {Heading} from "@chakra-ui/layout";
import Head from "next/head";

const CategoryHeading=()=>{
    const router = useRouter();
    const [variables,setV] = useState({categoryId:router.query.id as string})
    const [{data,fetching}] = useGetOneCategoryQuery({
        variables
    })
    useEffect(() => {
        setV({categoryId:router.query.id as string})
    },[router.query.id])
    return(
        <Box>
            <Head>
                <title>{data?.getOneCategory.category}</title>
            </Head>
            <Heading as='h2'>
                Блоги по категории "{data?.getOneCategory.category}"
            </Heading>
        </Box>
    );
}
export default CategoryHeading;