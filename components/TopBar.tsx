"use client"; 

import Link from "next/link"; import LanguageToggle from "@/components/LanguageToggle"; 

export default function TopBar() { 
  return (
    <div className="mx-auto max-w-screen-sm px-4 h-14 flex items-center justify-between">
      {/* Left: title */}
      <div className="font-semibold">QSL Fantasy</div>

      {/* Right: actions */}
      <div className="flex items-center gap-2"> 

        <Link href="/login" className="text-sm underline">Login</Link> 

        <LanguageToggle /> 

      </div> 

    </div> 

  ); 

}      