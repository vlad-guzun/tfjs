import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { X, ChevronRight } from "lucide-react";
import React from "react";

export function StarterDialog({ icon,text }: { icon: React.ReactNode,text: React.ReactNode }) {
  const features = [
    "chat privately",
    "like profiles",
    "create live videos",
    "follow or find new people",
    "and many more"

  ];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="hover:bg-black bg-black text-white hover:text-slate-300 border-none">{icon}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="text-white bg-black border border-slate-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif">{text}... would you log in first?</AlertDialogTitle>
            <ul className="list-none p-0 m-0">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2 font-serif">
                  <ChevronRight className="mr-2 text-pink-700" />
                  {feature}
                </li>
              ))}
            </ul>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-black text-white border-none hover:bg-black hover:text-slate-500">
            <X size={18}/>
          </AlertDialogCancel>
          <SignInButton>
            <Button className="bg-black text-white hover:bg-black hover:text-slate-500 text-sm">
              Sign in
            </Button>
          </SignInButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
