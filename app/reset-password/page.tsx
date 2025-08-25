"use client"; 

import { useState } from "react"; 

import {supabase} from "@/lib/supabaseClient"; 

  

export default function ResetPasswordPage() { 

  const [email, setEmail] = useState(""); 

  const [msg, setMsg] = useState<string>(""); 

  

  async function handleSend(e: React.FormEvent) { 

    e.preventDefault(); 

    setMsg(""); 

  

    const { error } = await supabase.auth.resetPasswordForEmail(email, { 

      redirectTo: `${window.location.origin}/update-password`, 

    }); 

  

    if (error) { 

      setMsg(`Error: ${error.message}`); 

      return; 

    } 

  

    setMsg("Check your inbox for a password reset link."); 

  } 

  return ( 

   <div className="space-y-4"> 

      <form onSubmit={handleSend} className="rounded-2xl shadow p-4 bg-white space-y-3"> 

        <h1 className="text-xl font-semibold">Reset your password</h1> 

  

        <input 

          type="email" 

          className="w-full rounded-xl border p-3" 

          placeholder="you@example.com" 

          value={email} 

          onChange={(e) => setEmail(e.target.value)} 

          required 

        /> 

  

        <button type="submit" className="w-full h-12 rounded-2xl bg-black text-white font-medium"> 

          Send reset link 

        </button> 

  

        {msg ? <p className="text-sm text-center opacity-80">{msg}</p> : null} 

      </form> 

    </div> 

  ); 

} 