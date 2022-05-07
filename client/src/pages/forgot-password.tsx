import React, {useState} from 'react';
import NavBar from "../components/NavBar";
import Wrapper from "../components/Wrapper";
import {Form, Formik} from "formik";
import InputField from "../components/InputField";
import {Button} from "@chakra-ui/button";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createURQLClient";
import {useForgotPasswordMutation} from "../generated/graphql";
import ToErrorMap from "../utils/toErrorMap";
import {useRouter} from "next/router";
import {Box} from "@chakra-ui/layout";

const ForgotPassword = () => {
    const [,forgot] = useForgotPasswordMutation();
    const router = useRouter();
    return (
        <div>
            <Wrapper variant={"regular"}>
                <Formik
                    initialValues={{ email: '' }}
                    onSubmit={async (values, actions) => {
                        const res = await forgot({email:values.email});
                        if(res.data?.forgotPassword.error){
                            actions.setErrors(ToErrorMap(res.data?.forgotPassword.error));
                        }else if(res.data?.forgotPassword){
                            alert("Письмо отправлено на адрес "+values.email)
                            router.push("/");
                        }
                        setTimeout(() => {
                            actions.setSubmitting(false)
                        }, 1000)
                    }}
                >
                    {(props) => (
                        <Form >
                            <InputField
                                placeholder={"Email"}
                                label={"Email"}
                                name={"email"}
                                type={"email"}
                            />
                            <Button
                                mt={4}
                                width={"100%"}
                                colorScheme='facebook'
                                isLoading={props.isSubmitting}
                                type='submit'
                            >
                                Отправить письмо
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </div>
    );
};

export default withUrqlClient(createUrqlClient,{ssr:true})(ForgotPassword);