"use client";

import React from 'react';
import { TextDialog } from './TextDialog';
import { VideoDialog } from './VideoDialog';
import { X } from 'lucide-react';

const OptionModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-50 absolute inset-0"></div>
            <div className="bg-black h-[100px] w-[300px] border border-slate-700 rounded-lg p-8 text-white relative z-10">
                <button
                    className="absolute top-0 right-0 m-2 text-white"
                    onClick={onClose}
                >
                    <X className="hover:text-slate-400" size={15}/>
                </button>
                <div className="flex gap-[30px] items-center justify-center">
                  <TextDialog />
                  <VideoDialog />
                </div>
            </div>
        </div>
    );
};

export default OptionModal;
