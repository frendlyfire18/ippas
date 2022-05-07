import React from 'react';
import {Form, Formik} from "formik";
import ToErrorMap from "../utils/toErrorMap";
import InputField from "../components/InputField";
import {Button} from "@chakra-ui/button";
import Wrapper from "../components/Wrapper";
import {useAuthorisationMutation} from "../generated/graphql";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createURQLClient";
import NavBar from "../components/NavBar";
import {Box, Heading, Link} from "@chakra-ui/layout";
import NextLink from "next/link";

function checkLogin(loginString){
    const pattern = /^[\w\d_.+-]+@[\w\d-]+.[\w]+$/;
    return pattern.test(loginString);
}

function checkPass(loginString){
    const pattern = /^[^<>%$\[\]\\\/\&\!\@\?\$]*$/;
    return pattern.test(loginString);
}

const Login = () => {
    const [,login] = useAuthorisationMutation();
    const router = useRouter();
    return (
        <div>
            <Wrapper variant={"regular"}>
                <Box>
                    <Heading textAlign={"center"} as="h2">
                        Авторизация
                    </Heading>
                </Box>
                <Formik
                    initialValues={{ name: '',password: '' }}
                    onSubmit={async (values, actions) => {
                        if(checkLogin(values.name)&&checkPass(values.password)){
                            const res = await login({usernameORemail:values.name,password:values.password});
                            if(res.data?.authorisation.error){
                                actions.setErrors(ToErrorMap(res.data?.authorisation.error));
                            }else if(res.data?.authorisation.user){
                                if(router.query.next){
                                    router.push(router.query.next);
                                }
                                else{
                                    router.push("/");
                                }
                            }
                        }else if(!checkLogin(values.name)){
                            actions.setErrors({"name":"Bad Input"});
                        }else if(!checkPass(values.password)){
                            actions.setErrors({"password":"Bad Input"});
                        }
                        setTimeout(() => {
                            actions.setSubmitting(false)
                        }, 1000)
                    }}
                >
                    {(props) => (
                        <Form >
                            <InputField
                                placeholder={"Имя или email"}
                                label={"Имя или email"}
                                name={"name"}
                                type={"name"}
                            />
                            <InputField
                                placeholder={"Пароль"}
                                label={"Пароль"}
                                name={"password"}
                                type={"password"}
                            />
                            <Box
                                mt={5}
                                mb={5}
                            >
                                <NextLink href={"/forgot-password"}>
                                    <Link color={"black"}>Забыли пароль ?</Link>
                                </NextLink>
                            </Box>
                            <Button
                                mt={4}
                                width={"100%"}
                                colorScheme='facebook'
                                isLoading={props.isSubmitting}
                                type='submit'
                            >
                                Войти
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </div>
    );
};

export default withUrqlClient(createUrqlClient,{ssr:true})(Login);