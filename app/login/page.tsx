"use client"; 
import { useState } from "react"; 

import { useRouter, useSearchParams } from "next/navigation"; 

import { supabase } from "@/lib/supabaseClient"; 

import { ensureAndGetProfile } from "@/lib/profile"; 

  

export default function LoginPage() { 

  const [email, setEmail] = useState(""); 

  const [password, setPassword] = useState(""); 

  const [msg, setMsg] = useState<string>(""); 

  

  const router = useRouter(); 

  const searchParams = useSearchParams(); 

  const next = searchParams.get("next") ?? "/pick"; 

  

  async function handleAuth(e: React.FormEvent) { 

    e.preventDefault(); 

    setMsg(""); 

  

    // 1) Try sign in 

    const { data: signInData, error: signInErr } = 

      await supabase.auth.signInWithPassword({ email, password }); 

  

    if (!signInErr && signInData.user) { 

      try { 

        await ensureAndGetProfile(); 

      } catch (e: any) { 

        // Not fatal; we still redirect if auth worked 

        console.error(e); 

      } 

      router.replace(next); // ✅ redirect after successful login 

      return; 

    } 

  

    // 2) If sign-in failed, try sign-up 

    const { data: signUpData, error: signUpErr } = 

      await supabase.auth.signUp({ email, password }); 

  

    if (signUpErr) { 

      setMsg(`Sign up error: ${signUpErr.message}`); 

      return; 

    } 

  

    // Depending on your Supabase Auth settings, signUp may or may not create a session. 

    // If a session exists, redirect; if email confirmation is required, show a message. 

    if (signUpData.user) { 

      // Try to fetch/create profile; ignore errors for redirect 

      try { 

        await ensureAndGetProfile(); 

      } catch (e: any) { 

        console.error(e); 

      } 

  

      // If email confirmation is OFF, session exists -> redirect now 

      const { data: sessionCheck } = await supabase.auth.getSession(); 

      if (sessionCheck.session) { 

        router.replace(next); 

        return; 

      } 

  

      // Email confirmation ON -> ask user to verify then sign in 

      setMsg("Account created. Please verify your email, then sign in."); 

      return; 

    } 

  

    setMsg("Could not sign in or sign up. Please try again."); 

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

          placeholder="••••••••" 

          value={password} 

          onChange={(e) => setPassword(e.target.value)} 

          required 

        /> 

        <button 

          type="submit" 

          className="w-full h-12 rounded-2xl bg-black text-white font-medium"
        >
          Continue 
        </button>

        {msg ? ( 

          <p className="text-sm text-center opacity-80">{msg}</p> 

        ) : null} 

      </form> 

    </div> 

  ); 

} 