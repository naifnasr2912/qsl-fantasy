"use client"; 

  

import { Suspense, useEffect, useState } from "react"; 

import { useRouter, useSearchParams } from "next/navigation"; 

import {supabase} from "@/lib/supabaseClient"; 

import { ensureAndGetProfile } from "@/lib/profile"; 

  

export default function LoginPage() { 

  // Only the FORM lives in Suspense so useSearchParams() is safe 

  return ( 

    <Suspense fallback={null}> 

      <LoginForm /> 

    </Suspense> 

  ); 

} 

  

function LoginForm() { 

  const [email, setEmail] = useState(""); 

  const [password, setPassword] = useState(""); 

  const [msg, setMsg] = useState<string>(""); 

  const [currentEmail, setCurrentEmail] = useState<string | null>(null); 

  

  const router = useRouter(); 

  const searchParams = useSearchParams(); 

  const next = searchParams.get("next") ?? "/pick"; 

  

  // Show which account is currently logged in (useful if the user is already signed in) 

  useEffect(() => { 

    let ignore = false; 

  

    (async () => { 

      const { data } = await supabase.auth.getSession(); 

      if (!ignore) setCurrentEmail(data.session?.user?.email ?? null); 

    })(); 

  

    return () => { 

      ignore = true; 

    }; 

  }, []); 

  

  async function handleAuth(e: React.FormEvent) { 

    e.preventDefault(); 

    setMsg(""); 

  

    // 1) Try to sign in 

    const { data: signInData, error: signInErr } = 

      await supabase.auth.signInWithPassword({ email, password }); 

  

    if (!signInErr && signInData.user) { 

      try { 

        await ensureAndGetProfile(); 

      } catch {} 

      setCurrentEmail(email); 

      router.replace(next); 

      return; 

    } 

  

    // 2) If sign in failed (likely no account), create one quickly 

    const { error: signUpErr } = await supabase.auth.signUp({ email, password }); 

  

    if (signUpErr) { 

      setMsg(`Sign up error: ${signUpErr.message}`); 

      setCurrentEmail(email); 

      return; 

    } 

  

    // 3) Profile & optional verification message 

    try { 

      await ensureAndGetProfile(); 

    } catch {} 

  

    const { data: check } = await supabase.auth.getSession(); 

    if (check.session) { 

      router.replace(next); 

      return; 

    } 

  

    setMsg("Account created. Please verify your email, then sign in."); 

  } 

 return (
  <div className="space-y-4"> 

      <form onSubmit={handleAuth} className="rounded-2xl shadow p-4 bg-white space-y-3"> 

        <h1 className="text-xl font-semibold">Login</h1> 

 

      <input 

          type="email" 

          className="w-full rounded-xl border p-3" 

          placeholder="you@example.com" 

          value={email} 

          onChange={(e) => setEmail(e.target.value)} 

          required 

        /> 

 

<input 
      type="password" 
      className="w-full rounded-xl border p-3" 
      placeholder="********" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)} 
      required 
    /> 

 

       <button type="submit" className="w-full h-12 rounded-2xl bg-black text-white font-medium"> 

          Continue 

        </button> 

 

     <p className="mt-2 text-center text-sm text-gray-600"> 

          Don’t have an account?{" "} 

          <a href="/signup" className="text-blue-600 underline">Sign up</a> 

        </p> 

  

        {msg ? <p className="text-sm text-center opacity-80">{msg}</p> : null} 

  

        {currentEmail && ( 

          <p className="mb-2 text-sm text-gray-600"> 

            Logged in as: <span className="font-medium">{currentEmail}</span> 

          </p> 

        )} 

      </form> 

    </div> 

  ); 

} 
