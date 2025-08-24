"use client"; 

  

import { Suspense } from "react"; 

import { useState } from "react"; 

import { useRouter, useSearchParams } from "next/navigation"; 

import { supabase } from "@/lib/supabaseClient"; 

import { ensureAndGetProfile } from "@/lib/profile"; 

  

export default function LoginPage() { 

  // Only render the form inside Suspense 

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

  

  const router = useRouter(); 

  const searchParams = useSearchParams(); 

  const next = searchParams.get("next") ?? "/pick"; 

  

  async function handleAuth(e: React.FormEvent) { 

    e.preventDefault(); 

    setMsg(""); 

  

    const { data: signInData, error: signInErr } = 

      await supabase.auth.signInWithPassword({ email, password }); 

  

    if (!signInErr && signInData.user) { 

      try { await ensureAndGetProfile(); } catch {} 

      router.replace(next); 

      return; 

    } 

  

    const { data: signUpData, error: signUpErr } = 

      await supabase.auth.signUp({ email, password }); 

  

    if (signUpErr) { setMsg(`Sign up error: ${signUpErr.message}`); return; } 

  

    try { await ensureAndGetProfile(); } catch {} 

    const { data: sessionCheck } = await supabase.auth.getSession(); 

    if (sessionCheck.session) { router.replace(next); return; } 

  

    setMsg("Account created. Please verify your email, then sign in."); 

  } 

  return ( 

    <div className="space-y-4"> 

      <form onSubmit={handleAuth} className="rounded-2xl shadow p-4 bg-white space-y-3"> 

        <h1 className="text-xl font-semibold">Login</h1> 

  

        <input type="email" className="w-full rounded-xl border p-3" 

               placeholder="you@example.com" value={email} 

               onChange={(e) => setEmail(e.target.value)} required /> 

  

        <input type="password" className="w-full rounded-xl border p-3" 

               placeholder="••••••••" value={password} 

               onChange={(e) => setPassword(e.target.value)} required /> 

  

        <button type="submit" className="w-full h-12 rounded-2xl bg-black text-white font-medium"> 

          Continue 

        </button> 

        <p className="mt-2 text-center text-sm text-gray-600"> 

          Don’t have an account?{" "} 

          <a href="/signup" className="text-blue-600 underline"> 

            Sign up 

            </a> 

          </p> 

  

        {msg ? <p className="text-sm text-center opacity-80">{msg}</p> : null} 

      </form> 

    </div> 

  ); 

} 