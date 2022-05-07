import React, {useEffect, useState} from "react"
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../../utils/createURQLClient";
import Wrapper from "../../components/Wrapper";
import {useRouter} from "next/router";
import {useGetMyIdQuery, useGetOneCategoryQuery, useSortByCategoryQuery} from "../../generated/graphql";
import {
    Box,
    Button,
    Container,
    Flex,
    GridItem,
    Image,
    Link,
    SimpleGrid,
    Spacer,
    Spinner,
    Stack,
    Text
} from "@chakra-ui/react"
import {Center, Heading} from "@chakra-ui/layout";
import NextLink from "next/link";
import Feature from "../../components/Feater";
import {DownloadIcon} from "@chakra-ui/icons";
import NavBar from "../../components/NavBar";
import FindInput from "../../components/FindInput";
import Categories from "../../components/Categories";
import Footer from "../../components/Footer";
import CategoryHeading from "../../components/CategoryHeading";
import Head from "next/head"

const FindByCategory=()=>{
    const router = useRouter();
    const [variables,setV] = useState({categoryId:router.query.id as string})
    const [{data:myId}] = useGetMyIdQuery()
    const [{data,fetching}] = useSortByCategoryQuery({
        variables
    })
    useEffect(() => {
        setV({categoryId:router.query.id as string})
    },[router.query.id])

    if(fetching){
        return(
            <Wrapper>
                <Center><Spinner size='xl' /></Center>
            </Wrapper>
        )
    }
    if(!data){
        return(
            <Wrapper>
                <Center><Spinner size='xl' /></Center>
            </Wrapper>
        )
    }

    return(
        <>
            <NavBar/>
            <Box
                mt={10}
                maxW={"950px"}
                width={"100%"}
                mx={"auto"}>
                <FindInput/>
                <Flex mt={10}>
                    <CategoryHeading/>
                    <Spacer />
                    <Categories/>
                </Flex>
                <Container as={Stack} maxW={'6xl'} py={10}>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 1 }} spacing={"25px"}>
                        {!data?(<div><Center><Spinner size='xl' /></Center></div>):data!.sort.posts.map(p=>
                            !p?null:(
                                <Feature
                                    myId={myId}
                                    id={p._id}
                                    authorId={p.userId}
                                    title={p.title}
                                    desc={p.text}
                                    author={p.user.username}
                                    date={p.createdAt}
                                    points={p.points}
                                    voteStatus={p.voteStatus}
                                    imageURL={p.imageURL}
                                />
                            )
                        )}
                    </SimpleGrid>
                </Container>
                {
                    data?.sort.hasMore
                    &&
                    <Box ml={15}>
                        <Button onClick={()=>{

                        }} isLoading={fetching} leftIcon={<DownloadIcon/>}  colorScheme={"orange"}>
                            Загрузить больше
                        </Button>
                    </Box>
                }
            </Box>
            <Footer/>
        </>
    )
}
export default withUrqlClient(createUrqlClient,{ssr:true})(FindByCategory);