import React, {useEffect, useState} from 'react';
import NavBar from "../components/NavBar";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createURQLClient";
import {
    DeletePostMutationVariables,
    useDeletePostMutation,
    useGetAllCategoriesQuery,
    useGetAllPostsQueryQuery, useGetMyIdQuery, useSortByCategoryQuery, useSortQuery,
    useUnVoteMutation,
    useVoteMutation
} from "../generated/graphql";
import {
    Box,
    Button, Center, Container, Divider,
    Flex,
    Grid,
    GridItem, Input,
    InputGroup, InputLeftAddon, InputLeftElement, Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList, SimpleGrid,
    Spacer, Spinner, Stack, Tag, useColorModeValue
} from '@chakra-ui/react'
import {Heading, Text} from "@chakra-ui/layout";
import {
    ChevronDownIcon,
    DownloadIcon,
    HamburgerIcon,
    Search2Icon,
    SunIcon,
    TriangleDownIcon,
    TriangleUpIcon,
    DeleteIcon, EditIcon, RepeatIcon
} from "@chakra-ui/icons";
import { Image } from '@chakra-ui/react'
import NextLink from "next/link";
import Footer from "../components/Footer";
import Feature from "../components/Feater";
import {useRouter} from "next/router";
import FindInput from "../components/FindInput";
import Categories from "../components/Categories";
import Head from "next/head"

const Index = () => {
    const router = useRouter();
    const [variables, setLimitAndId] = useState({
        _id:null as null|string,
        limit:15
    })
    const [{data,error,fetching}] = useGetAllPostsQueryQuery({
        variables,
    });
    const [{data:myId}] = useGetMyIdQuery()
    return(
        <>
            <Head>
                <title> Добро пожаловать на сайт "Inter Planet Post about Sport"</title>
            </Head>
        <NavBar/>
        <Box
            mt={10}
            maxW={"850px"}
            width={"100%"}
            mx={"auto"}>
            <FindInput/>
            <Button onClick={()=>{
                router.push("/posts/"+data.getPosts.posts[(Math.floor(Math.random() * data.getPosts.posts.length))]._id)
            }} leftIcon={<RepeatIcon/>} colorScheme='brand' my={5}>
                Рандомная статья
            </Button>
            <Flex display={{base:"block", md:"flex"}} mt={10}>
                <Box>
                    <Heading as='h2'>
                        Последние блоги
                    </Heading>
                </Box>
                <Spacer />
                <Categories/>
            </Flex>
            <Container as={Stack} maxW={'6xl'} py={10}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 1 }} spacing={"25px"}>
                    {!data?(<div><Center><Spinner size='xl' /></Center></div>):data!.getPosts.posts.map(p=>
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
                data?.getPosts.hasMore
                &&
                <Box ml={15}>
                    <Button onClick={()=>{
                        setLimitAndId({
                            _id: (data.getPosts.posts[data.getPosts.posts.length - 1]._id===undefined)?null:data.getPosts.posts[data.getPosts.posts.length - 1]?._id,
                            limit: variables.limit
                        })
                    }} isLoading={fetching} leftIcon={<DownloadIcon/>}  colorScheme={"facebook"}>
                        Загрузить больше
                    </Button>
                </Box>
            }
        </Box>
        <Footer/>
        </>
    );
}

export default withUrqlClient(createUrqlClient,{ssr:true})(Index);//used for ssr of this page
