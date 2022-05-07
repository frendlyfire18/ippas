import React from 'react';
import {Box} from "@chakra-ui/layout";
import NavBar from "./NavBar";
import Footer from "./Footer";

interface WrapperInterface {
    variant?:"small" | "regular";
}

const Wrapper:React.FC<WrapperInterface> = ({children,variant= "regular"}) => {
    return (
        <div>
            <NavBar/>
            <Box
                mt={10}
                maxW={
                    variant==="regular"
                        ?
                        "800px"
                        :
                        "400px"
                }
                width={"100%"}
                mx={"auto"}>
                {children}
            </Box>
            <Footer/>
        </div>
    );
};

export default Wrapper;