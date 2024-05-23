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
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 768);
    const [isLargeScreen, setIsLargeScreen] = useState<boolean>(window.innerWidth >= 1024); 

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const getTextItemStyle = (index: number, isSmallScreen: boolean, isLargeScreen: boolean): React.CSSProperties => {
        const angle = (index / textItems.length) * 360;
        const xRadius = isSmallScreen ? 200 : (isLargeScreen ? 280 : 240);
        const yRadius = isSmallScreen ? 70 : (isLargeScreen ? 90 : 100);

        const x = Math.cos((angle * Math.PI) / 180) * xRadius;
        const y = Math.sin((angle * Math.PI) / 180) * yRadius;
    
        let rotate = angle; 
        if (textItems[index] === "like profiles") {
            rotate += 270; 
        } else if (textItems[index] === "watch reels") {
            rotate += 125; 
        } else if (textItems[index] === "send messages") {
            rotate += 90; 
        } else if (textItems[index] === "follow people") {
            rotate += 60; 
        } else if (textItems[index] === "post") {
            rotate += 90;
        } else if (textItems[index] === "discover") {
            rotate += 100;
        } else if (textItems[index] === "learn") {
            rotate += 260;
        } else if (textItems[index] === "relax") {
            rotate += 80;
        }
    
        return {
            transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
            transformOrigin: 'center',
            whiteSpace: 'nowrap',
            pointerEvents: 'none' 
        };
    };

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
                        className='glowing-textarea w-[300px] md:w-[350px] lg:w-[400px] font-serif relative z-20'
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Type and find someone..."
                    />
                </div>
                <div className="absolute inset-0 flex justify-center items-center overflow-hidden z-0">
                    {textItems.map((text, index) => (
                        <div
                            key={index}
                            className="absolute text-md text-item font-serif"
                            style={getTextItemStyle(index, isSmallScreen, isLargeScreen)}
                        >
                            {text}
                        </div>
                    ))}
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
