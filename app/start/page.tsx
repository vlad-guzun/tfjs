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

    const handleFocus = () => {
        document.querySelectorAll('.text-item').forEach((item) => {
            item.classList.add('text-item-glow');
        });
    };

    const handleBlur = () => {
        document.querySelectorAll('.text-item').forEach((item) => {
            item.classList.remove('text-item-glow');
        });
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
                    color: white;
                    opacity: 1;
                    text-shadow: 0 0 15px rgba(255, 255, 255, 0.5), 
                                 0 0 30px rgba(255, 255, 255, 0.4),
                                 0 0 45px rgba(255, 255, 255, 0.3),
                                 0 0 60px rgba(255, 255, 255, 0.2),
                                 0 0 75px rgba(255, 255, 255, 0.1);
                    transition: text-shadow 0.3s, opacity 0.3s;
                }
                .text-item:hover {
                    text-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 
                                 0 0 60px rgba(255, 255, 255, 0.6), 
                                 0 0 90px rgba(255, 255, 255, 0.4);
                }
                .text-item-glow {
                    text-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 
                                 0 0 60px rgba(255, 255, 255, 0.6), 
                                 0 0 90px rgba(255, 255, 255, 0.4);
                }
                .glowing-textarea {
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    background-color: black;
                    color: white;
                    text-shadow: 0 0 15px rgba(255, 255, 255, 0.5), 
                                 0 0 30px rgba(255, 255, 255, 0.4),
                                 0 0 45px rgba(255, 255, 255, 0.3),
                                 0 0 60px rgba(255, 255, 255, 0.2),
                                 0 0 75px rgba(255, 255, 255, 0.1);
                    transition: text-shadow 0.3s, border-color 0.3s, box-shadow 0.3s;
                }
                .glowing-textarea:focus {
                    border-color: rgba(255, 255, 255, 0.5);
                    box-shadow: 0 0 30px rgba(255, 255, 255, 0.7), 
                                0 0 60px rgba(255, 255, 255, 0.5), 
                                0 0 90px rgba(255, 255, 255, 0.3);
                    outline: none;
                }
                `}
            </style>
            <div className="relative flex justify-center items-center mt-10 z-10" style={{ height: '300px' }}>
                <div className="relative z-20">
                    <Textarea
                        className='glowing-textarea w-[300px] lg:w-[400px] font-serif relative z-20'
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Type and find someone..."
                    />
                </div>
                <div className="absolute inset-0 flex justify-center items-center overflow-hidden z-0">
                    {textItems.map((text, index) => {
                        const angle = (index / textItems.length) * 360;
                        const xRadius = 300; 
                        const yRadius = 100; 
                        const x = Math.cos((angle * Math.PI) / 180) * xRadius;
                        const y = Math.sin((angle * Math.PI) / 180) * yRadius;
                        const rotate = text === "like profiles" ? angle + 250 : angle + 60;
                        return (
                            <div
                                key={index}
                                className="absolute text-md text-item font-serif"
                                style={{
                                    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
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
