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
  import { X } from "lucide-react";
  
  export function StartLoginDialog({ text }: { text: string }) {
    const repeatedText =
      "post • discover • like profiles • learn • relax • watch reels • send messages • follow people • explore • connect • share • enjoy • create • interact • network • engage • participate • join • connect • experience • develop • innovate • grow • find friends • meet new people • chat • stay updated • stay connected • follow trends • ";
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="text-white">{text}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="absolute shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] bg-black flex flex-col justify-center items-center lg:h-[90vh] lg:w-[60vh] md:h-[80vh] md:w-[50vh] h-[70vh] w-[40vh]">
          <AlertDialogHeader className="w-full">
            <AlertDialogFooter className="absolute top-5 right-3 text-white">
              <AlertDialogCancel>
                <X size={17} className="bg-black hover:text-slate-400" />
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogHeader>
          <div className="flex-grow flex flex-col justify-center items-center w-full relative z-10 text-white">
            <SignInButton />
          </div>
          <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 220 220"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <path
                  id="outerTextCircle"
                  d="M 110, 110 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                />
              </defs>
              <text fill="white" fontSize="10" fontFamily="serif" className="outer-text">
                <textPath href="#outerTextCircle" startOffset="0%">
                  {repeatedText}
                </textPath>
              </text>
            </svg>
          </div>
        </AlertDialogContent>
        <style jsx>{`
          .outer-text {
            animation: rotate 60s linear infinite;
            transform-origin: center;
            text-shadow: 25px 2px 10px white, 15px 10px 15px rgba(255, 255, 255, 0.7);
          }
  
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </AlertDialog>
    );
  }
  