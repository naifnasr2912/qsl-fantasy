"use client"; 

  

import { useState } from "react"; 

import { supabase } from "@/lib/supabaseClient"; 

import { useRouter } from "next/navigation"; 

  

export default function SignupPage() { 

  const [email, setEmail] = useState(""); 

  const [password, setPassword] = useState(""); 

  const [msg, setMsg] = useState<string | null>(null); 

  const router = useRouter(); 

  

  async function handleSignup(e: React.FormEvent) { 

    e.preventDefault(); 

    setMsg(null); 

  

    const { data, error } = await supabase.auth.signUp({ email, password }); 

  

    if (error) { 

      setMsg(`Sign up error: ${error.message}`); 

      return; 

    } 

  

    setMsg("Account created! Please check your email to confirm."); 

    // Optional: redirect after signup 

    // router.push("/login"); 

  } 

  return ( 

    <div className="space-y-4"> 

      <form onSubmit={handleSignup} className="rounded-2xl shadow p-4 bg-white space-y-3"> 

        <h1 className="text-xl font-semibold">Sign Up</h1> 

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

        <button 

          type="submit" 

          className="w-full h-12 rounded-2xl bg-black text-white font-medium" 

        > 

          Continue 

        </button> 

        {/* Small link back to login */} 

        <p className="mt-2 text-center text-sm text-gray-600"> 

          Already have an account?{" "} 

          <a href="/login" className="text-blue-600 underline"> 

            Log in 

          </a> 

        </p> 

        {msg ? <p className="text-sm text-center opacity-80">{msg}</p> : null} 

      </form> 

    </div> 

  ); 

}  