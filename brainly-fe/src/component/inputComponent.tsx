import React, { forwardRef } from "react";

export interface Props{
    placeholder: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const InputComponent = forwardRef<HTMLInputElement, Props>(
    ({ placeholder, onChange, type = "text" }, ref) => {
        return(
            <div>
                <input 
                    ref={ref} 
                    placeholder={placeholder} 
                    type={type}
                    className="px-4 py-2 border rounded m-2" 
                    onChange={onChange}
                />
            </div>
        )
    }
);

InputComponent.displayName = "InputComponent";
export default InputComponent;