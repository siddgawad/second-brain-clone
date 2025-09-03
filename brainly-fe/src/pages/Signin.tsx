
import React from "react";
import { useRef, useState } from "react";
import InputComponent from "../component/inputComponent";
import { Button } from "../component/Button";
import { BACKEND_URL } from "../config";

export default function SignIn(){
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    async function signin(){
        const username = usernameRef.current?.value;   
        const password = passwordRef.current?.value;
        
        if (!username || !password) {
            alert("Please enter both username and password");
            return;
        }
        
        try {
            setLoading(true);
            const response = await fetch(BACKEND_URL + "/api/v1/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log("Signin successful:", data);
                
                // Store the token if provided
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                
                // Redirect to dashboard
                window.location.href = "/dashboard";
            } else {
                const errorData = await response.json();
                console.error("Signin failed:", errorData);
                alert("Signin failed: " + (errorData.message || "Invalid credentials"));
            }
        } catch (error) {
            console.error("Signin failed:", error);
            alert("Signin failed: Network error");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
            <div className="bg-white rounded-xl min-w-48 p-8">
                <InputComponent ref={usernameRef} placeholder="username"/>
                <InputComponent ref={passwordRef} placeholder="password" />
                <div className="flex justify-center pt-4">
                    <Button 
                        loading={loading} 
                        variant="primary" 
                        text="SignIn" 
                        startIcon={null} 
                        onClick={signin} 
                        fullWidth={true} 
                    />
                </div>
            </div>
        </div>
    )
}