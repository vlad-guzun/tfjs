"use client";

import OptionModal from '@/components/OptionsModal';
import { SheetLeft } from '@/components/SheetLeft';
import { SheetRight } from '@/components/SheetRight';
import { Button } from '@/components/ui/button';
import { getAllTheFollowingsVideoPosts } from '@/lib/actions/user.action';
import { useUser } from '@clerk/nextjs';
import { Dot, PencilLine } from 'lucide-react';
import  { useEffect, useState } from 'react';



const FeedPage = () => {
    const [modalOpen, setModalOpen] = useState(false);


    return (
        <div className='text-white'>
            <Button className='fixed bottom-0 left-0 mb-4 ml-3 bg-black text-white hover:text-slate-500 hover:bg-black ' onClick={() => setModalOpen(true)}>
                <Dot size={30}/> 
            </Button>
            {modalOpen && <OptionModal onClose={() => setModalOpen(false)} />}
            <div className="h-screen flex items-center justify-center gap-5">
                <SheetLeft />     
                <SheetRight />                                              
            </div>
        </div>
    );
}

export default FeedPage;
