import React from "react";

export interface Props{
    text: string;
    icon: React.ReactElement;
}

export default function SideBarItem({text, icon}: Props){
   return(
    <div className="flex items-center gap-3 px-2 py-4 rounded-lg bg-white cursor-pointer mb-1">
        <div className="text-gray-600">
            {icon}
        </div>
        <span className="text-gray-700 font-medium text-xl">{text}</span>
    </div>
   )
}