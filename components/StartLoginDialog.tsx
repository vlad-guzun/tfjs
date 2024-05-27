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
      
    const innerRepeatedText = 
      "login • sign in • access • enter • login • sign in • access • enter • login • sign in • access • enter • connect • share • enjoy • create • interact • grow • value time • find friends • meet new people • chat • stay updated • stay connected";
  
    const outermostRepeatedText =
      "join us • start now • become a member • join us • start now • become a member • join us • start now • become a member • join us • start now • become a member • join us • start now • become a member • interact • network • engage • participate • join • connect • experience • develop • innovate • grow • find friends  ";
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="text-white">{text}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="absolute shadow-[0_0_10px_2px_rgba(255,255,255,0.6)] bg-black flex flex-col justify-center items-center lg:h-[90vh] lg:w-[60vh] md:h-[80vh] md:w-[50vh] h-[70vh] w-[40vh]">
          <AlertDialogHeader className="w-full">
            <AlertDialogFooter className="absolute top-4 right-2">
              <AlertDialogCancel>
                <p className="text-white hover:text-slate-400">X</p>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogHeader>
          <div className="flex-grow flex flex-col justify-center items-center w-full relative z-10 text-white hover:text-slate-400">
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
                  id="outermostTextCircle"
                  d="M 110, 110 m -95, 0 a 95,95 0 1,1 190,0 a 95,95 0 1,1 -190,0"
                />
                <path
                  id="outerTextCircle"
                  d="M 110, 110 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                />
                <path
                  id="innerTextCircle"
                  d="M 110, 110 m -65, 0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0"
                />
              </defs>
              <text fill="white" fontSize="6" fontFamily="serif" className="subtle-glow outermost-text">
                <textPath href="#outermostTextCircle" startOffset="0%">
                  {outermostRepeatedText}
                </textPath>
              </text>
              <text fill="white" fontSize="6" fontFamily="serif" className="subtle-glow outer-text">
                <textPath href="#outerTextCircle" startOffset="0%">
                  {repeatedText}
                </textPath>
              </text>
              <text fill="white" fontSize="6" fontFamily="serif" className="subtle-glow inner-text">
                <textPath href="#innerTextCircle" startOffset="0%">
                  {innerRepeatedText}
                </textPath>
              </text>
            </svg>
          </div>
        </AlertDialogContent>
        <style jsx>{`
          .outermost-text {
            animation: rotate 24s linear infinite;
            transform-origin: center;
          }
  
          .outer-text {
            animation: rotate 20s linear infinite;
            transform-origin: center;
          }
      
          .inner-text {
            animation: rotate-slow 15s linear infinite;
            transform-origin: center;
          }
      
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
      
          @keyframes rotate-slow {
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
  