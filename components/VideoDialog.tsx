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
import { Baseline, Bold, Clapperboard, Plus, X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from './ui/input';
import { Popover, PopoverContent } from './ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { IoAddSharp } from "react-icons/io5";


export function VideoDialog() {
  return (
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
            Here will be the video
          </div>
          <AlertDialogCancel className="absolute top-0 right-0 bg-black border-none hover:bg-black hover:text-slate-400" ><X size={15} /></AlertDialogCancel>
          <AlertDialogAction className="bg-black hover:bg-black text-white absolute bottom-0 hover:text-slate-400">
            <Plus size={15} />
          </AlertDialogAction>
          <Popover>
            <PopoverTrigger className="absolute bottom-0 left-0 pb-3 pl-5 hover:text-slate-500">
                <Baseline size={15} />
            </PopoverTrigger>
            <PopoverContent className="bg-black border border-slate-500">
              <div className='flex flex-col items-center'>
                <Input placeholder="Add Some Title" className="bg-black text-white border border-slate-700"/>
                <Button className="bg-black hover:bg-black hover:text-slate-400 h-[20px] mt-2"><Plus size={15}/></Button>
              </div>
            </PopoverContent>
          </Popover>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
