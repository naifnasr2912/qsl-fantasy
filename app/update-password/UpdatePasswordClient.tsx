"use client"; 

  

import { useEffect, useState } from "react"; 

import { useRouter } from "next/navigation"; 

import { supabase } from "@/lib/supabaseClient"; 

  

export default function UpdatePasswordClient() { 

  const router = useRouter(); 

  const [email, setEmail] = useState<string | null>(null); 

  const [pw1, setPw1] = useState(""); 

  const [pw2, setPw2] = useState(""); 

  const [msg, setMsg] = useState(""); 

  const [saving, setSaving] = useState(false); 

  

  // On mount, see if we actually have a session from the email link 

  useEffect(() => { 

    let mounted = true; 

  

    async function load() { 

      const { data } = await supabase.auth.getSession(); 

      if (!mounted) return; 

  

      // If the magic link created a session, you'll have the user's email here 

      const sessionEmail = data.session?.user?.email ?? null; 

      setEmail(sessionEmail); 

    } 

  

    load(); 

  

    // Also listen for auth state changes in case it arrives a moment later 

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { 

      setEmail(session?.user?.email ?? null); 

    }); 

  

    return () => { 

      mounted = false; 

      sub.subscription.unsubscribe(); 

    }; 

  }, []); 

  

  async function handleSubmit(e: React.FormEvent) { 

    e.preventDefault(); 

    setMsg(""); 

  

    if (pw1.length < 6) { 

      setMsg("Password must be at least 6 characters."); 

      return; 

    } 

    if (pw1 !== pw2) { 

      setMsg("Passwords do not match."); 

      return; 

    } 

  

    setSaving(true); 

    const { error } = await supabase.auth.updateUser({ password: pw1 }); 

    setSaving(false); 

  

    if (error) { 

      setMsg(`Error: ${error.message}`); 

      return; 

    } 

  

    setMsg("Password updated! Redirecting to login…"); 

    // Sign out to clear the one-time recovery session, then send them to login 

    try { 

      await supabase.auth.signOut(); 

    } finally { 

      router.replace("/login"); 

    } 

  } 

  return ( 

   <div className="max-w-sm mx-auto mt-20 p-6 border rounded-2xl shadow bg-white"> 

      <h1 className="text-xl font-semibold mb-1">Set a new password</h1> 

      <p className="text-sm text-gray-600 mb-4"> 

        {email ? <>for <span className="font-medium">{email}</span></> : "Checking session…"} 

      </p> 

  

      <form onSubmit={handleSubmit} className="space-y-4"> 

        <input 

          type="password" 

          placeholder="New password" 

          value={pw1} 

          onChange={(e) => setPw1(e.target.value)} 

          required 

          className="w-full border rounded-xl p-3" 

        /> 

        <input 

          type="password" 

          placeholder="Confirm new password" 

          value={pw2} 

          onChange={(e) => setPw2(e.target.value)} 

          required 

          className="w-full border rounded-xl p-3" 

        /> 

  

        <button 

          type="submit" 

          disabled={saving} 

          className="w-full h-12 rounded-2xl bg-black text-white font-medium disabled:opacity-60" 

        > 

          {saving ? "Updating…" : "Update Password"} 

        </button> 

      </form> 

  

      {msg && <p className="mt-4 text-sm text-center text-gray-700">{msg}</p>} 

  

      {!email && ( 

        <p className="mt-3 text-xs text-center text-gray-500"> 

          If this page was opened directly, request a new reset link from{" "} 

          <a href="/reset-password" className="underline">Reset Password</a>. 

        </p> 

      )} 

    </div> 

  ); 

} 