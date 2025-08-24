"use client"; 

  

import Link from "next/link"; 

import LanguageToggle from "@/components/LanguageToggle"; 

import {supabase} from "@/lib/supabaseClient"; 

import { useRouter } from "next/navigation"; 

import { useEffect, useState } from "react"; 

import type { AuthChangeEvent, Session } from "@supabase/supabase-js"; 

  

export default function TopBar() { 

  const router = useRouter(); 

  

  // UI state 

  const [signedIn, setSignedIn] = useState(false); 

  const [email, setEmail] = useState<string | null>(null); 

  const [mounted, setMounted] = useState(false); 

  

  // On mount: read current session and subscribe to auth changes 

  useEffect(() => { 

    let isActive = true; 

  

    const load = async () => { 

      const { data } = await supabase.auth.getSession(); 

      if (!isActive) return; 

      setSignedIn(!!data.session?.user); 

      setEmail(data.session?.user?.email ?? null); 

      setMounted(true); 

    }; 

    load(); 

  

    const { data: listener } = supabase.auth.onAuthStateChange( 

      (_event: AuthChangeEvent, session: Session | null) => { 

        if (!isActive) return; 

        setSignedIn(!!session?.user); 

        setEmail(session?.user?.email ?? null); 

      } 

    ); 

  

    return () => { 

      isActive = false; 

      listener.subscription.unsubscribe(); 

    }; 

  }, []); 

  

  // Avoid mismatch while the client hydrates 

  if (!mounted) return null; 

  

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

        {signedIn ? ( 

          <> 

            {email ? ( 

              <span className="text-sm text-gray-600 hidden sm:inline"> {email}</span> 

            ) : null} 

            <button 

              onClick={handleLogout} 

              className="text-sm underline text-gray-700 hover:text-black" 

            > 

              Sign out 

            </button> 

          </> 

        ) : ( 

          <Link href="/login" className="text-sm underline"> 

            Login 

          </Link> 

        )} 

  

        <LanguageToggle /> 

      </div> 

    </div> 

  ); 

} 

