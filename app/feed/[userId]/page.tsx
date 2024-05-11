"use client";

import OptionModal from '@/components/OptionsModal';
import { Button } from '@/components/ui/button';
import { PencilLine } from 'lucide-react';
import  { useState } from 'react';

const FeedPage = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className='text-white'>
            <Button className='fixed bottom-0 left-0 mb-4 ml-3 bg-black text-white hover:bg-white hover:text-black' onClick={() => setModalOpen(true)}>
                <PencilLine />
            </Button>
            {modalOpen && <OptionModal onClose={() => setModalOpen(false)} />}
        </div>
    );
}

export default FeedPage;
