"use client"; 

  

import Link from "next/link"; 

import LanguageToggle from "@/components/LanguageToggle"; 

import {supabase} from "@/lib/supabaseClient"; 

import { useRouter } from "next/navigation"; 

import { useEffect, useState } from "react"; 

import type { AuthChangeEvent, Session } from "@supabase/supabase-js"; 

  

export default function TopBar() { 

  const router = useRouter(); 

  

  // UI/auth state 

  const [signedIn, setSignedIn] = useState(false); 

  const [email, setEmail] = useState<string | null>(null); 

  const [mounted, setMounted] = useState(false); 

  

  // On mount: check current user and subscribe to auth changes 

  useEffect(() => { 

    let unsubscribe: (() => void) | undefined; 

  

    async function checkUser() { 

      const { data } = await supabase.auth.getUser(); 

      setSignedIn(!!data.user); 

      setEmail(data.user?.email ?? null); 

    } 

  

    checkUser(); 

  

    const { data: listener } = supabase.auth.onAuthStateChange( 

      (_event: AuthChangeEvent, session: Session | null) => { 

        setSignedIn(!!session?.user); 

        setEmail(session?.user?.email ?? null); 

      } 

    ); 

  

    unsubscribe = () => listener.subscription.unsubscribe(); 

    setMounted(true); 

  

    return () => { 

      unsubscribe?.(); 

    }; 

  }, []); 

  

  // Avoid hydration mismatch 

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

            {email && ( 

              <span className="text-xs text-gray-500 hidden sm:inline"> 

                {email} 

              </span> 

            )} 

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