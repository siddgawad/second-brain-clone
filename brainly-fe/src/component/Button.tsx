import React from "react";
import type { ReactElement } from "react";

export interface ButtonProps{
    variant:"primary"|"secondary";
    text:string;
    startIcon:ReactElement;
}

const variantClassName={
    "primary":"bg-purple-600 text-white",
    "secondary":"bg-purple-100 text-purple-500"
}

const defaultStyles = "px-4 py-2 rounded-md font-light flex items-center";

export const Button = ({variant,text,startIcon}:ButtonProps)=>{
    return(
        <button className={variantClassName[variant] + " " + defaultStyles}>
            <div className="pr-2">
            {startIcon}
            </div>
           {text}
        </button>
    )
}