import React from 'react';
import {FormControl, FormErrorMessage, FormLabel} from "@chakra-ui/form-control";
import {Button} from "@chakra-ui/button";
import {Input} from "@chakra-ui/input";
import {Field, Form, Formik} from "formik";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import {useRegistrationMutation} from "../generated/graphql";
import ToErrorMap from "../utils/toErrorMap";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createURQLClient";
import NavBar from "../components/NavBar";
import {Box, Heading} from "@chakra-ui/layout";

function checkLogin(loginString){
    const pattern = /^[\w\d_.+-]+@[\w\d-]+.[\w]+$/;
    return pattern.test(loginString);
}

function checkPass(loginString){
    const pattern = /^[^<>%$\[\]\\\/\&\!\@\?\$]*$/;
    return pattern.test(loginString);
}

const Register = () => {
    const [,register] = useRegistrationMutation();
    const router = useRouter();
        return (
            <>
                <Wrapper variant={"regular"}>
                    <Box>
                        <Heading textAlign={"center"} as="h2">
                            Регистрация
                        </Heading>
                    </Box>
                    <Formik
                        initialValues={{ name: '',email:'',password: '' }}
                        onSubmit={async (values, actions) => {
                            if(checkLogin(values.name)&&checkPass(values.password)&&checkLogin(values.password)){
                                const res = await register({username:values.name,email:values.email,password:values.password});
                                if(res.data?.registration.error){
                                    actions.setErrors(
                                        ToErrorMap(res.data.registration.error)
                                    )
                                }else if(res.data?.registration.user){
                                    router.push("/");
                                }
                                setTimeout(() => {
                                    actions.setSubmitting(false)
                                }, 1000)
                            }else if(!checkLogin(values.name)){
                                actions.setErrors({"name":"Bad Input"});
                            }else if(!checkPass(values.password)){
                                actions.setErrors({"password":"Bad Input"});
                            }else if(!checkLogin(values.email)){
                                actions.setErrors({"email":"Bad Input"});
                            }
                        }}
                    >
                        {(props) => (
                            <Form >
                                <InputField
                                    placeholder={"Имя"}
                                    label={"Имя"}
                                    name={"name"}
                                    type={"name"}
                                />
                                <InputField
                                    placeholder={"Email"}
                                    label={"Email"}
                                    name={"email"}
                                    type={"email"}
                                />
                                <InputField
                                    placeholder={"Пароль"}
                                    label={"Пароль"}
                                    name={"password"}
                                    type={"password"}
                                />
                                <Button
                                    mt={4}
                                    width={"100%"}
                                    colorScheme='facebook'
                                    isLoading={props.isSubmitting}
                                    type='submit'
                                >
                                    Зарегестрироваться
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Wrapper>
            </>
        )
};

export default withUrqlClient(createUrqlClient,{ssr:true})(Register);