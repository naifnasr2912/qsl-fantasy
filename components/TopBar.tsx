"use client"; 

  

import Link from "next/link"; 

import LanguageToggle from "@/components/LanguageToggle"; 

import { supabase } from "@/lib/supabaseClient"; 

import { useRouter } from "next/navigation"; 

  

export default function TopBar() { 

  const router = useRouter(); 

  

  async function handleLogout() { 

    try { 

      await supabase.auth.signOut(); 

    } finally { 

      router.replace("/login"); 

    } 

  } 

  return (
    <div className="mx-auto max-w-screen-sm px-4 h-14 flex items-center justify-between"> 
      {/* left: title */} 
      <div className="font-semibold">QSL Fantasy</div> 

      {/* right: actions */}
      <div className="flex items-center gap-4"> 

        <Link href="/login" className="text-sm underline"> 

          Login 

        </Link> 

<button 

          onClick={handleLogout} 

          className="text-sm underline text-gray-700 hover:text-black" 

        > 

        Sign out 

        </button> 

  

        <LanguageToggle /> 

      </div> 

    </div> 

  ); 

} 
  