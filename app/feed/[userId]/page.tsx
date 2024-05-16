"use client";

import OptionModal from '@/components/OptionsModal';
import { SheetLeft } from '@/components/SheetLeft';
import { SheetRight } from '@/components/SheetRight';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { Dot } from 'lucide-react';
import { useEffect, useState } from 'react';

const FeedPage = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className='text-white'>
            <Button className='fixed bottom-0 left-0 mb-4 ml-3 bg-black text-white hover:text-slate-500 hover:bg-black ' onClick={() => setModalOpen(true)}>
                <Dot size={30}/> 
            </Button>
            {modalOpen && <OptionModal onClose={() => setModalOpen(false)} />}
            <div className="h-screen flex flex-col items-center justify-center">
                <div className="text-center mb-10">
                    <h1 className="text-xl font-serif">What type of feed this time?</h1>
                </div>
                <div className="flex items-center justify-center gap-5">
                    <SheetLeft />   
                    or  
                    <SheetRight />                                              
                </div>
            </div>
        </div>
    );
}

export default FeedPage;
