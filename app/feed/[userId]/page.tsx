"use client";

import OptionModal from '@/components/OptionsModal';
import { TextScrollBar } from '@/components/Scroll-bar-Text';
import { VideosScrollBar } from '@/components/Scroll-bar-Videos';
import { Button } from '@/components/ui/button';
import {  getAllTheFollowingsTextPosts, getAllTheFollowingsVideoPosts } from '@/lib/actions/user.action';
import { useUser } from '@clerk/nextjs';
import { Dot, PencilLine } from 'lucide-react';
import  { useEffect, useState } from 'react';



const FeedPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const user = useUser();
    const [textPosts, setTextPosts] = useState<TextPostProps[]>([]);
    const [videoPosts, setVideoPosts] = useState<VideoPostProps[]>([]);

    //AICI E PROBLEMA !!!!!!!!!!!!!!!!!!!!!!!!!!!! VEZ REZOLVA HUINEAUA!
    useEffect(() => {
        const fetchPosts = async () => {
            const text_posts = await getAllTheFollowingsTextPosts(user?.user?.id);
            const video_posts = await getAllTheFollowingsVideoPosts(user?.user?.id);
            setTextPosts(text_posts);
            setVideoPosts(video_posts);
            console.log(text_posts, video_posts);
        }
        fetchPosts();
    },[]); //NU MERGE DACA NU TE DUCI MAI INTAI PE PAGINA DE PROFILE SI DUPA DIN NOU AICI!!!!!!!!

    return (
        <div className='text-white'>
            <Button className='fixed bottom-0 left-0 mb-4 ml-3 bg-black text-white hover:text-slate-500 hover:bg-black ' onClick={() => setModalOpen(true)}>
                <Dot size={30}/> 
            </Button>
            {modalOpen && <OptionModal onClose={() => setModalOpen(false)} />}
            <div className="flex justify-center">
                    <VideosScrollBar videos={videoPosts} user={user}/>
                    <TextScrollBar text={textPosts} user={user}/>
            </div>
        </div>
    );
}

export default FeedPage;
