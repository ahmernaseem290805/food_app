"use client";
import {useEffect,useState} from "react";
import {signInWithEmailAndPassword,onAuthStateChanged} from "firebase/auth";
import {doc,getDoc} from "firebase/firestore";
import {auth,db} from "../../lib/firebase";
import {useRouter} from "next/navigation";

export default function LoginPage(){
 const router=useRouter();const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [loading,setLoading]=useState(false);const [error,setError]=useState("");
 useEffect(()=>{const unsub=onAuthStateChanged(auth,async user=>{if(!user)return;const s=await getDoc(doc(db,"Admin",user.uid));if(s.exists()&&s.data().role==="admin")router.replace("/dashboard")});return()=>unsub()},[router]);
 const login=async e=>{e.preventDefault();setError("");setLoading(true);try{const c=await signInWithEmailAndPassword(auth,email.trim(),password);const s=await getDoc(doc(db,"Admin",c.user.uid));if(!s.exists()||s.data().role!=="admin"){await auth.signOut();throw new Error("You are not authorized as an admin.")}router.replace("/dashboard")}catch(e:any){setError(e.message||"Invalid email or password.")}finally{setLoading(false)}};
 return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:20,background:"linear-gradient(135deg,#FFF8F3,#FFE5D6)"}}><div style={{width:"100%",maxWidth:420,background:"#fff",padding:32,borderRadius:24,boxShadow:"0 20px 60px rgba(80,30,10,.12)"}}><div style={{width:54,height:54,borderRadius:17,display:"grid",placeItems:"center",background:"linear-gradient(135deg,#FF6B35,#FF3D00)",color:"#fff",fontSize:25}}>🍽️</div><h1 style={{fontSize:30,margin:"18px 0 6px"}}>Admin Login</h1><p style={{color:"#777",marginTop:0}}>Manage your restaurant from one place.</p><form onSubmit={login}><div className="field"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="admin@example.com"/></div><div className="field"><label>Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required placeholder="••••••••"/></div>{error&&<p style={{color:"#D93636",fontSize:13}}>{error}</p>}<button className="primary" style={{width:"100%",padding:14}} disabled={loading}>{loading?"Logging in...":"Login to Dashboard"}</button></form></div></main>
}
