"use client";
require("@tensorflow/tfjs");

import React, { useState, useEffect, useRef } from 'react';
import * as use from "@tensorflow-models/universal-sentence-encoder";
import { Input } from '@/components/ui/input'; 
import Image from 'next/image';
import { SkeletonDemo } from '@/components/SkeletonCart'; 
import { findSimilarPeople } from '@/lib/actions/generate.similar.people';
import { FaEye } from "react-icons/fa";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import Link from 'next/link';


const StartPage = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [model, setModel] = useState<use.UniversalSentenceEncoder | null>(null);
    const [peoples, setPeoples] = useState<User_with_interests_location_reason[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const lastExecutionTimeRef = useRef<Date>(new Date());

    useEffect(() => {
        const loadModel = async () => {
            setIsLoading(true);
            const loadedModel = await use.load();
            setModel(loadedModel);
            setIsLoading(false);
            console.log("Model loaded successfully!");
        };
        loadModel();
    }, []);

    useEffect(() => {
        const generateEmbeddings = async () => {
            if (model && inputValue) {
                setIsLoading(true);
                const currentTime = new Date();
                if (currentTime.getTime() - lastExecutionTimeRef.current.getTime() > 1000) {
                    lastExecutionTimeRef.current = currentTime;
                    const embeddings = await model.embed([inputValue]);
                    const embeddingsArray = await embeddings.array();
                    const peoples = await findSimilarPeople(embeddingsArray[0]);
                    setPeoples(peoples);
                    setIsLoading(false);
                    console.log(peoples, peoples.length);
                }
            }
        };

        generateEmbeddings();
    }, [inputValue, model]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <div className='text-white mt-[100px] lg:mt-[150px]'>
            <h1 className="text-3xl text-center mt-10 font-serif">Find People Like You</h1>
            <div className="flex justify-center mt-4">
                <Input
                    className='border-gray-700 bg-black w-[400px] font-serif'
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type here to generate embeddings..."
                />
            </div>
            <div className="flex justify-center mt-4 flex-wrap gap-7">
                {isLoading ? (
                    Array.from({ length: peoples.length }, (_, i) => <SkeletonDemo key={i} />)
                ) : (
                    peoples.map((person) => (
                        <TooltipProvider key={person.clerkId}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div key={person.clerkId} className='flex flex-col items-center justify-center m-2 gap-1'>
                                        <Image src={person.photo} alt='Profile image' width={60} height={60} className="rounded-full" />
                                        <p className="font-serif text-xs">{person.username}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className='bg-black text-white border border-slate-800 shadow-[0_0_15px_rgba(255,255,255,0.2)]'>
                                    <p>last online</p>
                                    <Link href={`/myprofile`}><FaEye size={20}></FaEye></Link>
                                </TooltipContent>   
                            </Tooltip>
                        </TooltipProvider>
                    ))
                )}
            </div>
        </div>
    );
};

export default StartPage;
