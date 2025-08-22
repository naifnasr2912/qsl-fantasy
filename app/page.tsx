"use client"; 

import { useState } from "react"; 

import { supabase } from "@/lib/supabaseClient"; 

import { ensureAndGetProfile } from "@/lib/profile"; 

export default function LoginPage() { 

  const [email, setEmail] = useState(""); 

  const [password, setPassword] = useState(""); 

  const [msg, setMsg] = useState<string>(""); 

  async function handleAuth(e: React.FormEvent) { 

	    e.preventDefault(); 

    setMsg(""); 

  

    // Try sign-in first 

    const signIn = await supabase.auth.signInWithPassword({ email, password }); 

    if (signIn.error) { 

      // If no account, create it quickly 

      const signUp = await supabase.auth.signUp({ email, password }); 

      if (signUp.error) { 

        setMsg(`Sign up error: ${signUp.error.message}`); 

        return; 

      } 

      setMsg("Account created. Press Sign In again."); 

      return; 

    } 

  

    try { 

      const profile = await ensureAndGetProfile(); 

      setMsg(`Signed in! Hello ${profile.display_name ?? profile.email}`); 

      // Optional redirect: 

      // window.location.href = "/pick"; 

    } catch (e: any) { 

      setMsg(`Signed in, but profile error: ${e.message}`); 

    } 

  } 

  

  async function signOut() { 

    await supabase.auth.signOut(); 

    setMsg("Signed out"); 

  } 

  

  return ( 

    <div className="rounded-2xl shadow p-4 bg-white"> 

      <h2 className="text-lg font-semibold">Sign in / Sign up</h2> 

      <form onSubmit={handleAuth} className="grid gap-2 mt-3"> 

        <input 

          className="h-12 rounded-2xl border px-4" 

          type="email" 

          required 

          placeholder="you@email.com" 

          value={email} 

          onChange={(e)=>setEmail(e.target.value)} 

        /> 

        <input 

          className="h-12 rounded-2xl border px-4" 

          type="password" 

          required 

          placeholder="password (min 6)" 

          value={password} 

          onChange={(e)=>setPassword(e.target.value)} 

        /> 

        <button className="h-12 rounded-2xl bg-black text-white font-medium">Sign In</button> 

      </form> 

      {msg && <p className="text-sm mt-2">{msg}</p>} 

      <button onClick={signOut} className="mt-3 h-12 rounded-2xl bg-gray-200 w-full font-medium"> 

        Sign out 

      </button> 

    </div> 

  ); 

} 