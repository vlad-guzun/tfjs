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
    const containerRef = useRef<HTMLDivElement>(null);

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
        if (containerRef.current) {
            containerRef.current.classList.add('focus-glow');
        }
    };

    const handleBlur = () => {
        if (containerRef.current) {
            containerRef.current.classList.remove('focus-glow');
        }
    };

    const textItems = [
        "post",
        "discover",
        "like profiles",
        "learn",
        "relax",
        "watch reels",
        "send messages",
        "follow people",
        "explore",
        "connect",
        "share",
        "enjoy",
        "create",
        "interact",
        "network",
        "engage",
        "participate",
        "join",
        "connect",
        "experience",
        "develop",
        "innovate",
        "grow",
        "find friends",
        "meet new people",
        "chat",
        "stay updated",
        "stay connected",
        "follow trends"
    ];

    const generatePathText = () => {
        const repeatedText = textItems.join(' • ');

        const ovalPath = isSmallScreen 
            ? "M 250, 100 m -230, 0 a 230,90 0 1,1 460,0 a 230,90 0 1,1 -460,0"
            : "M 250, 100 m -190, 0 a 190,75 0 1,1 380,0 a 190,75 0 1,1 -380,0";

        return (
            <svg width="100%" height="100%" viewBox="0 0 500 200" className="absolute inset-0 z-0">
                <defs>
                    <path id="ovalPath" d={ovalPath} />
                </defs>
                <text fill="white" fontSize="12" fontFamily="serif" className="subtle-glow">
                    <textPath href="#ovalPath" startOffset="0%">
                        {repeatedText}
                    </textPath>
                </text>
            </svg>
        );
    };

    return (
        <div className='relative text-white h-screen mt-[100px] lg:mt-[150px] mb-[30px]' ref={containerRef}>
            <style>
                {`
                body {
                    background-color: #000; /* Black background */
                    position: relative;
                    overflow: hidden;
                }

                .gradient {
                    --size: 500px;
                    --speed: 50s;
                    --easing: cubic-bezier(0.8, 0.2, 0.2, 0.8);

                    width: var(--size);
                    height: var(--size);
                    filter: blur(calc(var(--size) / 16)); /* Further reduced blur for minimal glow */
                    background-image: linear-gradient(hsl(0, 0%, 50%), hsl(0, 0%, 30%)); /* Lightest grey gradient */
                    animation: rotate var(--speed) var(--easing) alternate infinite;
                    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                    position: absolute;
                    top: calc(50% - 150px); /* Adjusted to move 150px up from center */
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: -1;
                }

                @media (max-width: 768px) {
                    .gradient {
                        --size: 450px; /* Slightly smaller size for small screens */
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    .gradient {
                        --size: 500px; /* Slightly larger size for medium screens */
                    }
                }

                @media (min-width: 1025px) {
                    .gradient {
                        --size: 600px; /* Increased size for large screens */
                    }
                }

                @keyframes rotate {
                    0% {
                        transform: translate(-50%, -50%) rotate(0deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(360deg);
                    }
                }

                .text-item-glow {
                    text-shadow: 0 0 8px white, 
                                 0 0 8px rgba(255, 255, 255, 0.8), 
                                 0 0 8px rgba(255, 255, 255, 0.6), 
                                 0 0 20px rgba(255, 255, 255, 0.4), 
                                 0 0 15px rgba(255, 255, 255, 0.3);
                }
                .focus-glow text {
                    text-shadow: 0 0 2px white, 
                                 0 0 4px rgba(255, 255, 255, 0.8), 
                                 0 0 6px rgba(255, 255, 255, 0.6), 
                                 0 0 10px rgba(255, 255, 255, 0.4), 
                                 0 0 15px rgba(255, 255, 255, 0.3);
                }
                .glowing-textarea {
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    background-color: black;
                    color: white;
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 
                                 0 0 20px rgba(255, 255, 255, 0.4),
                                 0 0 30px rgba(255, 255, 255, 0.3),
                                 0 0 40px rgba(255, 255, 255, 0.2),
                                 0 0 50px rgba(255, 255, 255, 0.1);
                    transition: text-shadow 0.3s, border-color 0.3s, box-shadow 0.3s;
                }
                .glowing-textarea:focus {
                    border-color: rgba(255, 255, 255, 0.5);
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4), 
                                0 0 20px rgba(255, 255, 255, 0.3), 
                                0 0 30px rgba(255, 255, 255, 0.2);
                    outline: none;
                }

                .subtle-glow {
                    text-shadow: 0 0 2px rgba(255, 255, 255, 0.5), 
                                 0 0 4px rgba(255, 255, 255, 0.3);
                }
                `}
            </style>
            <div className="gradient"></div>
            <div className="relative flex justify-center items-center mt-10 z-10" style={{ height: '300px' }}>
                <div className="relative z-20">
                    <Textarea
                        className='glowing-textarea w-[260px] md:w-[350px] lg:w-[400px] font-serif relative z-20'
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Type and find someone..."
                    />
                </div>
                {generatePathText()}
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
