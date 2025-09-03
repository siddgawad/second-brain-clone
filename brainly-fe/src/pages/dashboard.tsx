import React, { useState } from 'react';
import { Button } from '../component/Button';
import ShareIcon from '../icons/ShareIcon';
import { PlusIcon } from '../icons/PlusIcon';
import Card from '../component/Card';
import CreateContentModel from '../component/createContent';
import SideBar from '../component/SideBar';

export default function Dashboard(){
    const [modalOpen, setModalOpen] = useState(false); // Changed to false by default
    
    return(
        <div>
            <div className="">
                <SideBar />
            </div>
            <div className="p-4 ml-72 min-h-screen bg-gray-100">
                <CreateContentModel 
                    open={modalOpen} 
                    onClose={() => {
                        setModalOpen(false);
                    }}  
                />
                <div className='flex justify-end gap-4'>
                    <Button 
                        variant="secondary" 
                        startIcon={<ShareIcon />} 
                        text="Share Brain"
                    />
                    <Button 
                        onClick={() => setModalOpen(true)} 
                        variant="primary" 
                        startIcon={<PlusIcon />} 
                        text="Add Content"
                    />
                </div>
                <div className='flex gap-4'>
                    <Card 
                        type="twitter" 
                        link="https://x.com/TheGlobal_Index/status/1962143466353545664/photo/1"
                        title="first tweet"
                    />
                    <Card 
                        type="youtube" 
                        link="https://www.youtube.com/watch?v=O9QD9an-0jU"
                        title="first yt video" 
                    />
                </div>
            </div>
        </div>
    )
}