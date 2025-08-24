import "./globals.css"; 

import type { ReactNode } from "react"; 

import BottomNav from "@/components/BottomNav"; 

import HeaderShell from "@/components/HeaderShell";

  

export default function RootLayout({ children }: { children: ReactNode }) { 


  return ( 

    <html lang="en" suppressHydrationWarning>

      <body suppressHydrationWarning>

        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur"> 

          <div className="mx-auto max-w-screen-sm px-4 h-14 flex items-center justify-between"> 

            <HeaderShell />

          </div> 

        </header> 

        <main className="mx-auto max-w-screen-sm px-4 pb-24 pt-4"> 

          {children} 

        </main> 

        <BottomNav /> 

      </body> 

    </html> 

  ); 

} 