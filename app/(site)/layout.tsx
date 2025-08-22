import LanguageToggle from "@/components/LanguageToggle"; 

import "../globals.css"; 

import type { ReactNode } from "react"; 

import TopBar from "@/components/TopBar"; 


import BottomNav from "@/components/BottomNav"; 

  

export default function RootLayout({ children }: { children: ReactNode }) { 

  return ( 

    <html lang="en"> 

      <body> 

        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur"> 

          <div className="mx-auto max-w-screen-sm px-4 h-14 flex items-center justify-between"> 

            <TopBar />
            <LanguageToggle />  

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