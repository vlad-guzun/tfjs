import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { DropdownMenuDemo } from "@/components/Dropdown";
import { Toaster } from "@/components/ui/toaster";
import ActiveStatus from "@/components/ActiveStatus";
import { OptionsAccordion } from "@/components/OptionsAcordion";
import { DropdownMenuDemoMobile } from "@/components/MobileOptionsAcordion";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorText: "white",
          colorInputText: "white",
          colorTextSecondary: "white",
          colorDanger: "red",
          colorSuccess: "white",
          colorInputBackground: "black",
          colorBackground: "black",
          colorTextOnPrimaryBackground: "white",
          colorNeutral: "white",
          colorPrimary: "white",
          colorShimmer: "white",
          colorWarning: "white",
        },
      }}
    >
      <html lang="en">
        <body className="bg-black">
          <div className="w-full min-h-screen flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/6 border-slate-800 lg:border-r lg:block hidden">
              <div className="p-3">
                <Link href={"/"} className="text-white hover:text-slate-700"></Link>
              </div>
              <div className="p-3">
                {/* <SignedIn>
                  <UserButton />
                </SignedIn> */}
              </div>
              <div className="sticky top-1/3 text-white flex flex-col items-center">
                <OptionsAccordion />
              </div>
            </div>
            <div className="w-full lg:w-2/3 border-slate-800 lg:border-r">
              <div className="block lg:hidden top-0 sticky">
                <DropdownMenuDemoMobile />
              </div>
              {children}
            </div>
            <Toaster />
            <ActiveStatus />
            <div className="w-full lg:w-1/6">
              <div className="p-3 text-white">
                {/* <Link href={"/similar"}>Find someone</Link> */}
              </div>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
