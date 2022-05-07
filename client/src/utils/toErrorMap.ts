import React from 'react';
import {Error} from "../generated/graphql";

const ToErrorMap = (errors:Error[]) => {
    const errMap:Record<string, string> = {};
    errors.forEach(({field,message})=>{
        errMap[field] = message;
    })
    return errMap;
};

export default ToErrorMap;