import React from 'react';
import {Form, Formik} from "formik";
import InputField from "../components/InputField";
import {Button} from "@chakra-ui/button";
import Wrapper from "../components/Wrapper";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createURQLClient";
import {useCreatePostMutation, useGetAllCategoriesQuery} from "../generated/graphql";
import {useRouter} from "next/router";
import {UseAuthCheck} from "../utils/useAuthCheck";
import {Box, Heading} from "@chakra-ui/layout";
import {Select} from "@chakra-ui/select";
import InputSelectField from "../components/InputSelectField";
import InputTextAreaField from "../components/InputTextAreaField";

const CreatePost = () => {
    UseAuthCheck();
    const [,setPost] = useCreatePostMutation();
    const router = useRouter();
    return (
        <div>
            <Wrapper variant={"regular"}>
                <Box>
                    <Heading textAlign={"center"} as="h2">
                        Создать пост
                    </Heading>
                </Box>
                <Formik
                    initialValues={{ title: '',text: '',category: '',imageUrl:'' }}
                    onSubmit={async (values, actions) => {
                        console.log(values)
                        if(values.title === '' && values.text === '' && values.category === '' && values.imageUrl === ''){
                            actions.setErrors(
                                {title:"Empty title field",
                                    text:"Empty text field",
                                    category:"Empty category field",
                                    imageUrl:"Empty image field"
                                });
                        }else if(values.category === '' && values.imageUrl === ''){
                            actions.setErrors(
                                {
                                    category:"Empty category field",
                                    imageUrl:"Empty image field"
                                });
                        }else if(values.title === '' && values.text === ''){
                            actions.setErrors({title:"Empty title field",text:"Empty text field"});
                        }else if(values.title === ''){
                            actions.setErrors({title:"Empty title field"});
                        }else if(values.text === ''){
                            actions.setErrors({text:"Empty text field"});
                        }else{
                            const res = await setPost({title:values.title,text:values.text,categoryId:values.category,imageUrl:values.imageUrl});
                            console.log(res);
                            if(res.error){
                                actions.setErrors({title:(res.error.message.includes("Not authorized"))?"Not authorized":res.error.message});
                                router.push("/");
                            }
                            router.push("/");
                        }
                    }}
                >
                    {(props) => (
                        <Form
                        >
                            <InputField
                                placeholder={"Название поста"}
                                label={"Название поста"}
                                name={"title"}
                                type={"text"}
                            />
                            <InputTextAreaField
                                placeholder={"Текст..."}
                                label={"Текст поста"}
                                name={"text"}
                                type={"text"}
                            />
                            <InputSelectField
                                placeholder={"Категория..."}
                                label={"Выберете категорию"}
                                name={"category"}
                                type={"category"}
                            />
                            <InputField
                                placeholder={"Изображение..."}
                                label={"Ссылка на изображение"}
                                name={"imageUrl"}
                                type={"imageUrl"}
                            />
                            <Button
                                mt={4}
                                mb={10}
                                width={"100%"}
                                colorScheme='facebook'
                                isLoading={props.isSubmitting}
                                type='submit'
                            >
                                Добавить пост
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </div>
    );
};

export default withUrqlClient(createUrqlClient,{ssr:true})(CreatePost);