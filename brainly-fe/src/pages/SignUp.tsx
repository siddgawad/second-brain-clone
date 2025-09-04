import React, { useRef, useState } from "react";
import axios from "axios";
import InputComponent from "../component/inputComponent";
import { Button } from "../component/Button";
import { BACKEND_URL } from "../config";

export default function SignUp() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function signup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(BACKEND_URL + "/api/v1/signup", { username, password });
      if (res.status === 200) {
        window.location.href = "/signin";
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl min-w-48 p-8">
        <InputComponent ref={usernameRef} placeholder="username" />
        <InputComponent ref={passwordRef} placeholder="password" />
        <div className="flex justify-center pt-4">
          <Button onClick={signup} loading={loading} variant="primary" text="SignUp" startIcon={null} fullWidth />
        </div>
      </div>
    </div>
  );
}
