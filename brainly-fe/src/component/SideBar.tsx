import React from "react"
import SideBarItem from "./SideBarItem"
import TwitterIcon from "../icons/TwitterIcon"
import YoutubeIcon from "../icons/YoutubeIcon"
import DocumentIcon from "../icons/DocumentIcon"
import LinkIcon from "../icons/LinkIcon"
import TagIcon from "../icons/TagIcon"
import BrainIcon from "../icons/BrainIcon"

export default function SideBar(){
    return(
        <div className="h-screen bg-white w-72 fixed left-0 top-0 border-r border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                   <BrainIcon color= "#5448d6" />
                    <h1 className="text-2xl font-semibold text-gray-800">Second Brain</h1>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="pt-6 px-4">
                <SideBarItem text="Tweets" icon={<TwitterIcon/>} />
                <SideBarItem text="Videos" icon={<YoutubeIcon/>} />
                <SideBarItem text="Documents" icon={<DocumentIcon/>} />
                <SideBarItem text="Links" icon={<LinkIcon/>} />
                <SideBarItem text="Tags" icon={<TagIcon/>} />
            </div>
        </div>
    )
}