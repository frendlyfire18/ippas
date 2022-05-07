import React, {InputHTMLAttributes, useState} from 'react';
import {FormControl, FormErrorMessage, FormLabel} from "@chakra-ui/form-control";
import {Input} from "@chakra-ui/input";
import {useField} from "formik";
import {Select} from "@chakra-ui/select";
import {useGetAllCategoriesQuery} from "../generated/graphql";

type InputSelectFieldInterface = InputHTMLAttributes<HTMLInputElement> & {
    type:string;
    label:string;
    placeholder:string;
    name:string;
};

/*
 <Select placeholder='Выберете категорию' my={5}>
                    {
                        data.getCategories.map((category,value)=>(
                            <option value={'option1'+value}>{category.category}</option>
                        ))
                    }
                </Select>
* */

const InputSelectField:React.FC<InputSelectFieldInterface> = (props) => {
    const [field,{error}] = useField(props);
    const [catValue,setCatValue] = useState("")
    const [{data,fetching}] = useGetAllCategoriesQuery();
    return (
        <>
            <FormControl pt={5} isInvalid={!!error}>
                <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
                <Select
                    {...field}
                    id={field.name}
                    type={props.type}
                    placeholder={props.placeholder}
                    my={5}>
                    {
                        data.getCategories.map((category,value)=>(
                            <option value={category._id}>{category.category}</option>
                        ))
                    }
                </Select>
                <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
        </>
    );
};

export default InputSelectField;