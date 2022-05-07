import React, {useState} from 'react';
import {NextPage} from "next";
import NavBar from "../../components/NavBar";
import Wrapper from "../../components/Wrapper";
import {Form, Formik} from "formik";
import ToErrorMap from "../../utils/toErrorMap";
import InputField from "../../components/InputField";
import {Button} from "@chakra-ui/button";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../../utils/createURQLClient";
import {useChangePasswordMutation} from "../../generated/graphql";
import {useRouter} from "next/router";
import NextLink from "next/link";
import {Box, Link} from "@chakra-ui/layout";

const ChangePass:NextPage<{token:string}> = ({token}) => {
    const [,changePass] = useChangePasswordMutation();
    const [error,setError] = useState(false);
    const router = useRouter();
    let body;
    if(error){
        body = (
            <>
                <NextLink href={"/forgot-password"}>
                    <Link color={"black"}>Забыли пароль опять?</Link>
                </NextLink>
            </>
        )
    }
    return (
        <div>
            <Wrapper variant={"regular"}>
                <Formik
                    initialValues={{ password:'' }}
                    onSubmit={async (values, actions) => {
                        const res = await changePass({token:token,password:values.password});
                        if(res.data?.changePassword.error){
                            actions.setErrors(ToErrorMap(res.data?.changePassword.error));
                            setError(true);
                        }else if(res.data?.changePassword.user){
                            alert("Пароль для пользователя "+res.data.changePassword.user.username+" изменен.");
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
                                placeholder={"Новый пароль"}
                                label={"Новый пароль"}
                                name={"password"}
                                type={"password"}
                            />
                            <Box
                                mt={5}
                            >
                                {body}
                            </Box>
                            <Button
                                mt={4}
                                width={"100%"}
                                colorScheme='facebook'
                                isLoading={props.isSubmitting}
                                type='submit'
                            >
                                Поменять паоль
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </div>
    );
};

ChangePass.getInitialProps=({query})=>{
    return {
        token:query.token as string
    }
}

export default withUrqlClient(createUrqlClient,{ssr:true})(ChangePass);