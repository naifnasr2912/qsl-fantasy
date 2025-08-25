"use client"; 

  

import { useState } from "react"; 

import { useRouter, useSearchParams } from "next/navigation"; 

import { supabase } from "@/lib/supabaseClient"; 

  

export default function UpdatePasswordPage() { 

  const router = useRouter(); 

  const searchParams = useSearchParams(); 

  const next = searchParams.get("next") ?? "/pick"; 

  

  const [password, setPassword] = useState(""); 

  const [confirm, setConfirm] = useState(""); 

  const [msg, setMsg] = useState<string>(""); 

  

  async function handleUpdate(e: React.FormEvent) { 

    e.preventDefault(); 

    setMsg(""); 

  

    if (password.length < 8) { 

      setMsg("Password must be at least 8 characters."); 

      return; 

    } 

    if (password !== confirm) { 

      setMsg("Passwords do not match."); 

      return; 

    } 

  

    // When you click the email link, Supabase creates a session for this route. 

    const { error } = await supabase.auth.updateUser({ password }); 

    if (error) { 

      setMsg(`Error updating password: ${error.message}`); 

      return; 

    } 

  

    setMsg("Password updated. Redirecting…"); 

    // Send them to login (or ?next=… target) 

    router.replace("/login?next=" + encodeURIComponent(next)); 

  } 

  return ( 

    <div className="space-y-4"> 

      <form onSubmit={handleUpdate} className="rounded-2xl shadow p-4 bg-white space-y-3"> 

        <h1 className="text-xl font-semibold">Set a new password</h1> 

  

        <input 

          type="password" 

          className="w-full rounded-xl border p-3" 

          placeholder="New password" 

          value={password} 

          onChange={(e) => setPassword(e.target.value)} 

          required 

          minLength={8} 

        /> 

  

        <input 

          type="password" 

          className="w-full rounded-xl border p-3" 

          placeholder="Confirm new password" 

          value={confirm} 

          onChange={(e) => setConfirm(e.target.value)} 

          required 

          minLength={8} 

        /> 

  

        <button type="submit" className="w-full h-12 rounded-2xl bg-black text-white font-medium"> 

          Update password 

        </button> 

  

        {msg ? <p className="text-sm text-center opacity-80">{msg}</p> : null} 

  

        <p className="mt-2 text-center text-sm text-gray-600"> 

          Didn’t get an email? <a href="/reset-password" className="text-blue-600 underline">Try again</a> 

        </p> 

      </form> 

    </div> 

  ); 

} 