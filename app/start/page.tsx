"use client";
require("@tensorflow/tfjs");

import React, { useState, useEffect, useRef } from 'react';
import * as use from "@tensorflow-models/universal-sentence-encoder";
import { SkeletonDemo } from '@/components/SkeletonCart'; 
import { findSimilarPeople } from '@/lib/actions/generate.similar.people';
import { StartPopover } from '@/components/StartPopover';
import { Textarea } from '@/components/ui/textarea';

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

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const textItems = [
        "post",
        "discover",
        "like profiles",
        "learn",
        "relax",
        "watch reels",
        "send messages",
        "follow people"
    ];

    return (
        <div className='relative text-white h-screen mt-[100px] lg:mt-[150px]'>
            <style>
                {`
                .text-item {
                    opacity: 0.5;
                    transition: color 0.3s, opacity 0.3s, text-shadow 0.3s;
                }
                .text-item:hover {
                    color: white;
                    opacity: 1;
                    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 
                                 0 0 16px rgba(255, 255, 255, 0.6), 
                                 0 0 24px rgba(255, 255, 255, 0.4);
                }
                `}
            </style>
            <div className="relative flex justify-center items-center mt-10 z-10" style={{ height: '300px' }}>
                <div className="relative z-20">
                    <Textarea
                        className='border-gray-700 bg-black w-[400px] font-serif relative z-20'
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type to find someone..."
                    />
                </div>
                <div className="absolute inset-0 flex justify-center items-center overflow-hidden z-0">
                    {textItems.map((text, index) => {
                        const angle = (index / textItems.length) * 360;
                        const xRadius = 300; 
                        const yRadius = 100; 
                        const x = Math.cos((angle * Math.PI) / 180) * xRadius;
                        const y = Math.sin((angle * Math.PI) / 180) * yRadius;
                        return (
                            <div
                                key={index}
                                className="absolute text-2xl text-pink-600 text-item font-serif"
                                style={{
                                    transform: `translate(${x}px, ${y}px) rotate(${angle + 60}deg)`,
                                    transformOrigin: 'center',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {text}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-center mt-4 flex-wrap gap-12 z-10">
                {isLoading ? (
                    Array.from({ length: peoples.length }, (_, i) => <SkeletonDemo key={i} />)
                ) : (
                    peoples.map((person) => (
                        <StartPopover key={person.clerkId} person={person} />
                    ))
                )}
            </div>
        </div>
    );
};

export default StartPage;
