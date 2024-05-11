"use client"

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Baseline, CircleAlert, Clapperboard, Plus, X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from './ui/input';
import { Popover, PopoverContent } from './ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { UploadButton } from "../lib/uploadthing";
import { useUser } from '@clerk/nextjs';
import { createVideoPost } from '@/lib/actions/post.action';

export function VideoDialog() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const user = useUser();

  const handleSubmit = async () => {
    if (url === "" || title === "") {
      setErrorMessage("Title and URL are required.");
      setShowModal(true);
      return;
    }
    const videoPost = await createVideoPost(title, url, user?.user?.id);
    console.log(videoPost);
    window.location.reload();
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-black text-white hover:text-black hover:bg-white">
            <div className="flex flex-col items-center justify-center">
              <Clapperboard size={30} />
              <Label>Video</Label>
            </div>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-black text-white w-[400px] h-[500px]">
          <AlertDialogHeader className="flex justify-center items-center">
            <div>
              <UploadButton
                appearance={{
                  button: "bg-black text-white flex flex-col w-[100px] h-[120px] items-center justify-center border border-slate-500 p-[100px] border-dotted",
                }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (Array.isArray(res) && res.length > 0) {
                    const url = res[0].url;
                    setUrl(url);
                  }
                }}
              ></UploadButton>
            </div>
            <AlertDialogCancel className="absolute top-0 right-0 bg-black border-none hover:bg-black hover:text-slate-400" ><X size={15} /></AlertDialogCancel>
            <AlertDialogAction className="bg-black hover:bg-black text-white absolute bottom-0 hover:text-slate-400">
              <Plus size={15} onClick={handleSubmit} />
            </AlertDialogAction>
            <Popover>
              <PopoverTrigger className="absolute bottom-0 left-0 pb-3 pl-5 hover:text-slate-500">
                <Baseline size={15} />
              </PopoverTrigger>
              <PopoverContent className="bg-black border border-white">
                <div className='flex flex-col items-center'>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Add Some Title" className="bg-black text-white border border-slate-700" />
                </div>
              </PopoverContent>
            </Popover>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-black border rounded-lg text-white overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <CircleAlert />
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-white">Wait, before posting...</h3>
                    <div className="mt-2">
                      <p className="text-sm text-white">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-black px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button onClick={() => setShowModal(false)} type="button" className="text-white bg-black hover:text-slate-400 hover:bg-black">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
