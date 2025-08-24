"use client"; 

  

import Link from "next/link"; 

import LanguageToggle from "@/components/LanguageToggle"; 

import { supabase } from "@/lib/supabaseClient"; 

import { useRouter } from "next/navigation"; 

import { useEffect, useState } from "react"; 

  

export default function TopBar() { 

  const router = useRouter(); 

  const [signedIn, setSignedIn] = useState(false); 

  const [mounted, setMounted] = useState(false);

  

  // check if user is signed in 

  useEffect(() => { 
    
    setMounted(true);

    async function checkUser() { 

      const { data } = await supabase.auth.getUser(); 

      setSignedIn(!!data.user); 

    } 

    checkUser(); 

  

    // listen for changes in auth state 

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { 

      setSignedIn(!!session?.user); 

    }); 

  

    return () => { 

      listener.subscription.unsubscribe(); 

    }; 

  }, []); 

  if (!mounted) return null; // avoid hydration mismatch



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

       {!signedIn ? ( 

          <Link href="/login" className="text-sm underline"> 

            Login 

          </Link> 

        ) : ( 

         <button 

            onClick={handleLogout} 

            className="text-sm underline text-gray-700 hover:text-black" 

          > 

            Sign out 

          </button> 

        )} 

  

        <LanguageToggle /> 

      </div> 

    </div> 

  ); 

} 
  
  