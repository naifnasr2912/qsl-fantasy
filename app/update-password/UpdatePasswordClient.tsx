// app/update-password/UpdatePasswordClient.tsx 

"use client"; 

  

import { useState } from "react"; 

import { useRouter, useSearchParams } from "next/navigation"; 

import { supabase } from "@/lib/supabaseClient"; 

  

export default function UpdatePasswordClient() { 

  const router = useRouter(); 

  const params = useSearchParams(); 

  

  // Supabase sends either access_token or code (PKCE) in the URL 

  const accessToken = params.get("access_token"); 

  const code = params.get("code"); 

  

  const [password, setPassword] = useState(""); 

  const [confirm, setConfirm] = useState(""); 

  const [msg, setMsg] = useState(""); 

  

  async function handleSubmit(e: React.FormEvent) { 

    e.preventDefault(); 

    setMsg(""); 

  

    if (password.length < 6) { 

      setMsg("Password must be at least 6 characters."); 

      return; 

    } 

    if (password !== confirm) { 

      setMsg("Passwords do not match."); 

      return; 

    } 

  

    try { 

      // If you’re using the “Reset Password” email from Supabase, 

      // the magic link sets a session automatically in the browser. 

      // For PKCE flow, exchange the code first: 

      if (code && !accessToken) { 

        const { error } = await supabase.auth.exchangeCodeForSession(code); 

        if (error) throw error; 

      } 

  

      const { error: updErr } = await supabase.auth.updateUser({ password }); 

      if (updErr) throw updErr; 

  

      setMsg("Password updated. Redirecting…"); 

      router.replace("/login"); 

    } catch (err: any) { 

      setMsg(err?.message ?? "Could not update password."); 

    } 

  } 

  return ( 
    <div className="space-y-4"> 

      <h1 className="text-xl font-semibold">Update password</h1> 

  

      <form onSubmit={handleSubmit} className="rounded-2xl shadow p-4 bg-white space-y-3"> 

        <input 

          type="password" 

          placeholder="New password" 

          value={password} 

          onChange={(e) => setPassword(e.target.value)} 

          className="w-full rounded-xl border p-3" 

          required 

        /> 

        <input 

          type="password" 

          placeholder="Confirm password" 

          value={confirm} 

          onChange={(e) => setConfirm(e.target.value)} 

          className="w-full rounded-xl border p-3" 

          required 

        /> 

  

        <button type="submit" className="w-full h-12 rounded-2xl bg-black text-white font-medium"> 

          Save password 

        </button> 

  

        {msg ? <p className="text-sm text-center opacity-80">{msg}</p> : null} 

      </form> 

    </div> 

  ); 

} 