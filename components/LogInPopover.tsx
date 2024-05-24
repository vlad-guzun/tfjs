import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { VenetianMask } from "lucide-react"
import { FaFacebookF, FaGoogle, FaInstagram } from "react-icons/fa"

export function LoginPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="fixed top-0 bg-black text-white hover:bg-black hover:text-slate-400 border-none">Login</Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 bg-black text-white border border-slate-700">
        <div className="flex flex-col gap-3 ">
          <SignInButton>
            <button>
              <div className="flex flex-col items-start gap-1 hover:bg-white hover:text-black rounded-md p-2">
                <div className="flex items-center">
                  <p>Continue with</p>
                  <div className="flex gap-1 font-serif ml-1"><FaInstagram size={14}/><FaFacebookF size={13}/><FaGoogle size={13}/></div>
                </div>
                <span className="text-pink-600 font-serif text-xs">Can do everything</span>
              </div>
            </button>
          </SignInButton>
          <Button className="hover:bg-white hover:text-black bg-black text-white">
            <div className="flex flex-col">
              <div className="flex items-start gap-1  rounded-md">
                <p className="font-serif">Continue as guest</p>
                <VenetianMask size={17}/>
              </div>
              <p className="text-pink-600 font-serif text-xs">view only</p>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
