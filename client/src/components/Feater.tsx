import {Box, Flex, GridItem, Image, Link, Spacer} from "@chakra-ui/react";
import NextLink from "next/link";
import {Heading, Text} from "@chakra-ui/layout";
import React from "react";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import VoteButton from "./VoteButton";
import UnVoteButton from "./UnVoteButton";

export default function Feature({myId,id,authorId,title, desc, author,date,points,voteStatus,imageURL, ...rest }) {
    return (
        <GridItem borderRadius="lg" color={"white"} bg="purple.900" p={5} shadow='md' borderWidth='1px' {...rest}>
            <Flex>
                <Box fontSize={10} pb={15}>
                    Автор : <NextLink href={"/authors/[id]"} as={`/authors/${authorId}`}>
                    <Link fontSize={10}>{author}</Link>
                </NextLink>
                </Box>
                <Spacer/>
                <Box>
                    <Text fontSize={10}>{date}</Text>
                </Box>
            </Flex>
            <Flex>
                <Box>
                    <Image
                        width={350}
                        borderRadius="lg"
                        transform="scale(1.0)"
                        src={
                            imageURL
                        }
                        alt="some text"
                        objectFit="contain"
                        transition="0.3s ease-in-out"
                        _hover={{
                            transform: 'scale(1.05)',
                        }}
                    />
                </Box>
                <Flex
                    ml={25}
                    pl={5}
                    borderLeft={"solid"}
                    borderLeftWidth={5}
                    borderLeftColor={"white"}
                >
                    <Flex display={{md:"block"}}>
                        <Heading mt={4} mb={4} fontSize='xl'>{title}</Heading>
                        {
                            ( myId?.checkAuth?.user?._id === authorId ) &&
                            <Box>
                                <DeleteButton id={id} authorId={authorId}/>
                                <EditButton id={id}/>
                            </Box>
                        }
                        <Flex display={{md:"block"}}>
                            <Text textAlign={"left"} mt={4}>{desc.slice(0,100)}</Text>
                            <Flex>
                                <NextLink href={"/posts/[id]"} as={`/posts/${id}`}>
                                    <Link color={"gray.500"} fontSize={14}><Text mt={4} mb={4}><Text _hover={{color:"white"}}>Читать далее</Text></Text></Link>
                                </NextLink>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Box pl={5}>
                        <VoteButton id={id} voted={(voteStatus === 1)}/>
                        <Box
                            py={2}
                            width={10}
                            color={"white"}
                        >
                            <Text textAlign={"center"} alignSelf={"center"}>{points}</Text>
                        </Box>
                        <UnVoteButton id={id} unvoted={(voteStatus === -1)}/>
                    </Box>
                </Flex>
            </Flex>
        </GridItem>
    )
}