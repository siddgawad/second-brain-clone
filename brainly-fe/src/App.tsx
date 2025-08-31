import React from 'react';
import { Button } from './component/Button';
import ShareIcon from './icons/ShareIcon';
import { PlusIcon } from './icons/PlusIcon';
import Card from './component/Card';

export default function App(){
  return(

    <div className='p-4'>
      <div className='flex justify-end gap-4'>
      <Button variant="primary" startIcon={<PlusIcon />} text="Add Content"></Button>
      <Button variant="secondary" startIcon={<ShareIcon />} text="Share Brain"></Button>
      </div>
        <div className='flex gap-4'>
      <Card type="twitter" link="https://x.com/TheGlobal_Index/status/1962143466353545664/photo/1"
      title="first tweet"/>
      <Card type="youtube" link="https://www.youtube.com/watch?v=O9QD9an-0jU"
       title="first yt video" />
      </div>
    
    </div>
   
  )
}