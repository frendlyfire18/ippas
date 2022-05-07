import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {
    QueryGetOnePostArgs,
    useGetAllCategoriesQuery, useGetOneCategoryQuery,
    useGetOnePostQuery,
    useUnVoteMutation,
    useVoteMutation
} from "../../generated/graphql";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../../utils/createURQLClient";
import Wrapper from "../../components/Wrapper";
import {Heading,Text,Center,Flex,Divider,Box} from "@chakra-ui/layout";
import {Button, Image, Spinner} from "@chakra-ui/react";
import {
    Link,
    HStack,
    Tag,
    Wrap,
    WrapItem,
    SpaceProps,
    useColorModeValue,
    Container,
    VStack,
} from '@chakra-ui/react';
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import {TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import exports from "webpack";
import NextLink from "next/link";
import Head from "next/head"

interface IBlogTags {
    categoryId: string;
}

const BlogTags: React.FC<IBlogTags> = (props) => {
    const router = useRouter()
    const [variables, setVar] = useState({
        categoryId:props.categoryId
    })
    const [{data,fetching}] = useGetOneCategoryQuery({
        variables,
    });
    useEffect(() => {
        setVar({categoryId:props.categoryId})
    },[router.query.id])
    return (
        <HStack spacing={2}>
            <Tag size={'md'} variant="solid" colorScheme="purple" key={data?.getOneCategory.category}>
                {data?.getOneCategory.category}
            </Tag>
        </HStack>
    );
};

interface BlogAuthorProps {
    date: string;
    name: string;
}

export const BlogAuthor: React.FC<BlogAuthorProps> = (props) => {
    return (
        <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
            <Image
                borderRadius="full"
                boxSize="40px"
                src="https://100k-faces.glitch.me/random-image"
                alt={`Avatar of ${props.name}`}
            />
            <Text fontWeight="medium">{props.name}</Text>
            <Text>—</Text>
            <Text>{props.date?.toString()}</Text>
        </HStack>
    );
};

function VoteButton({id,voted}){
    const [{fetching},vote] = useVoteMutation();
    const router = useRouter();
    console.log(voted)
    return (
        <>
            <Button color={voted?"white":"black"} onClick={async ()=>{
                const res = await vote({postId:id});
                if(res?.error?.message.includes("Not authorized"))
                    router.push("/login");
            }} isLoading={fetching} width={10} bg={voted?"purple.900":"transparent"}>
                <TriangleUpIcon/>
            </Button>
        </>
    );
}

function UnVoteButton({id,unvoted}) {
    const [{fetching},unvote] = useUnVoteMutation();
    const router = useRouter();
    return (
        <>
            <Button color={unvoted?"white":"black"} onClick={async ()=>{
                const res = await unvote({postId:id});
                if(res?.error?.message.includes("Not authorized"))
                    router.push("/login");
            }} isLoading={fetching} width={10} bg={unvoted?"purple.900":"transparent"}>
                <TriangleDownIcon/>
            </Button>
        </>
    );
}

const LastestPost=({postId})=>{
    const [variables,setVariables] = useState({"_id":postId})
    const [{data,error,fetching}] = useGetOnePostQuery({
        variables,
    })
    if(fetching){
        return(
            <Center><Spinner size='xl' /></Center>
        )
    }
    if(error){
        return(
            <Text>Something went wrong</Text>
        )
    }
    return(
      <>
          <Heading as="h2" marginTop="5">
              Послендние статьи
          </Heading>
          <Divider marginTop="5" />
          <Wrap spacing="30px" marginTop="5">
              <WrapItem width={{ base: '100%', sm: '45%', md: '45%', lg: '30%' }}>
                  <Box w="100%">
                      <Box borderRadius="lg" overflow="hidden">
                          <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                              <Image
                                  transform="scale(1.0)"
                                  src={
                                      data?.getOnePost?.imageURL
                                  }
                                  alt="some text"
                                  objectFit="contain"
                                  width="100%"
                                  transition="0.3s ease-in-out"
                                  _hover={{
                                      transform: 'scale(1.05)',
                                  }}
                              />
                          </Link>
                      </Box>
                      <Heading fontSize="xl" marginTop="2">
                          <NextLink href={"/posts/[id]"} as={"/posts/"+data?.getOnePost?._id}>
                              <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                  {data?.getOnePost?.title}
                              </Link>
                          </NextLink>
                      </Heading>
                      <Text as="p" fontSize="md" marginTop="2">
                          {data?.getOnePost?.text.slice(0,data?.getOnePost?.text.indexOf(".",5)+1)}
                      </Text>
                      <BlogAuthor
                          name={data?.getOnePost?.user?.username}
                          date={data?.getOnePost?.createdAt}
                      />
                  </Box>
              </WrapItem>
          </Wrap>
      </>
    );
}

function Post(props) {
    const router = useRouter();
    const [variables,setVariables] = useState({"_id":router.query.id})
    const [{data,error,fetching}] = useGetOnePostQuery({
        variables,
    })
    useEffect(() => {
        setVariables({"_id":router.query.id})
    },[router.query.id])
    if(fetching){
        return(
            <Wrapper variant={"regular"}>
                <Center><Spinner size='xl' /></Center>
            </Wrapper>
        )
    }
    if(error){
        return(
            <Wrapper variant={"regular"}>
                Something went wrong
            </Wrapper>
        )
    }
    return(
        <>
            <Head>
                <title>{data?.getOnePost?.title}</title>
            </Head>
        <NavBar/>
        <Container maxW={'5xl'} p="12">
            <Flex>
                <Heading as="h1">{data?.getOnePost?.title}</Heading>
                <Divider/>
                <Flex>
                    <VoteButton id={data?.getOnePost?._id} voted={(data?.getOnePost?.voteStatus === 1)}/>
                    <Heading mx={5} as="h3">{data?.getOnePost?.points}</Heading>
                    <UnVoteButton id={data?.getOnePost?._id} unvoted={(data?.getOnePost?.voteStatus === -1)}/>
                </Flex>
            </Flex>
            <Box
                marginTop={{ base: '1', sm: '5' }}
                display="flex"
                flexDirection={{ base: 'column', sm: 'row' }}
                justifyContent="space-between">
                <Box
                    display="flex"
                    flex="1"
                    marginRight="3"
                    position="relative"
                    alignItems="center">
                    <Box
                        width={{ base: '100%', sm: '85%' }}
                        zIndex="2"
                        marginLeft={{ base: '0', sm: '5%' }}
                        marginTop="5%">
                        <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                            <Image
                                borderRadius="lg"
                                src={
                                    data?.getOnePost?.imageURL
                                }
                                alt="some good alt text"
                                objectFit="contain"
                            />
                        </Link>
                    </Box>
                    <Box zIndex="1" width="100%" position="absolute" height="100%">
                        <Box
                            bgGradient={useColorModeValue(
                                'radial(purple.600 1px, transparent 1px)',
                                'radial(purple.300 1px, transparent 1px)'
                            )}
                            backgroundSize="20px 20px"
                            opacity="0.4"
                            height="100%"
                        />
                    </Box>
                </Box>
                <Box
                    display="flex"
                    flex="1"
                    flexDirection="column"
                    justifyContent="center"
                    marginTop={{ base: '3', sm: '0' }}>
                    <BlogTags categoryId={data?.getOnePost?.categoryId}/>
                    <Heading marginTop="1">
                        <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                            {data?.getOnePost?.title}
                        </Link>
                    </Heading>
                    <Text
                        as="p"
                        marginTop="2"
                        color={useColorModeValue('gray.700', 'gray.200')}
                        fontSize="lg">
                        <div dangerouslySetInnerHTML={{ __html:data?.getOnePost?.text.slice(0,data?.getOnePost?.text.indexOf(".",100)+1) }} />
                    </Text>
                    <BlogAuthor name={data?.getOnePost?.user?.username} date={data?.getOnePost?.createdAt.toString()} />
                </Box>
            </Box>
            <LastestPost postId={data?.getOnePost?.user?.posts}/>
            <VStack paddingTop="40px" spacing="2" alignItems="flex-start">
                <Heading as="h2">{data?.getOnePost?.title}</Heading>
                <Text as="p" fontSize="lg">
                    <div dangerouslySetInnerHTML={{ __html:data?.getOnePost?.text.slice(0,data?.getOnePost?.text.indexOf(".",100)+1) }} />
                </Text>
                <Text as="p" fontSize="lg">
                    <div dangerouslySetInnerHTML={{__html:data?.getOnePost?.text.slice(data?.getOnePost?.text.indexOf(".",100)+1,data?.getOnePost?.text.indexOf(".",200)+1)}} />
                </Text>
                <Text as="p" fontSize="lg">
                    <div dangerouslySetInnerHTML={{__html:data?.getOnePost?.text.slice(data?.getOnePost?.text.indexOf(".",200)+1,data?.getOnePost?.text.length)}} />
                </Text>
            </VStack>
        </Container>
        <Footer/>
        </>
    );
}
export default withUrqlClient(createUrqlClient,{ssr:true})(Post);