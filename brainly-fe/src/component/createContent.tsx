import React from "react";
import { useRef } from "react";
import CrossIcon from "../icons/CrossIcon";
import { Button } from "./Button";
import InputComponent from "./inputComponent";
import { api } from "../lib/api";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateContentModel({ open, onClose }: Props) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        const title = titleRef.current?.value?.trim();
        const link = linkRef.current?.value?.trim();
        if (!title || !link) return alert("Title and Link are required");

        
  (async () => {
    try {
      const res = await api.post("/api/v1/content", { title, link, type: "article", tags: [] });
      console.log("Created content", res.data);
    } catch (error) {
      console.error("Create content failed", error);
      alert("Failed to create content");
    } finally {
      onClose();
    }
  })();
};

    return(
        <div>
            {open && (
                <div className="w-full h-screen bg-black bg-opacity-50 fixed top-0 left-0 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded max-w-md w-full mx-4">
                        <div className="flex justify-end">
                            <div onClick={onClose} className="cursor-pointer">
                                <CrossIcon />
                            </div>
                        </div>
                        <div>
                            <InputComponent ref={titleRef} placeholder="Title" />
                            <InputComponent ref={linkRef} placeholder="Link" />
                        </div>
                        <div className="flex justify-center">
                            <Button 
                                startIcon={null} 
                                variant="primary" 
                                text="Submit" 
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}