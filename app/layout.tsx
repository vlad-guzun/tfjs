import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, UserButton } from "@clerk/nextjs";


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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className + " bg-black"} >
          <div className="w-full min-h-screen flex">
            <div className="w-0 md:w-1/6 border-white lg:border-r hidden lg:block">
              <div>
                <Link href={"/"} >Home</Link>
              </div>
              <div>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
            <div className="w-2/3 border-white lg:border-r">{children}</div>
            <div className="w-0 md:w-1/6 border lg:border-r hidden flex-col justify-between">
                <div className="m-3 hidden lg:block"><Link href={"/similar"}>find someone</Link></div>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
