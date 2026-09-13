"use client";
import { useEffect,useState } from "react";
import type { ReactNode } from "react";
import { usePathname,useRouter } from "next/navigation";
import { auth,db } from "../../lib/firebase";
import { onAuthStateChanged,signOut } from "firebase/auth";
import { doc,getDoc } from "firebase/firestore";

const links=[["/dashboard","📊","Dashboard"],["/orders","📦","Orders"],["/products","🍔","Products"],["/categories","🗂️","Categories"],["/customers","👥","Customers"],["/riders","🚴","Riders"],["/notifications","🔔","Notifications"],["/settings","⚙️","Restaurant Settings"]];
export default function AdminShell({children}:{children:ReactNode}){
 const router=useRouter(),path=usePathname(); const [checking,setChecking]=useState(true);
 useEffect(()=>{const unsub=onAuthStateChanged(auth,async user=>{if(!user){router.replace("/login");return} const snap=await getDoc(doc(db,"Admin",user.uid)); if(!snap.exists()||snap.data().role!=="admin"){await signOut(auth);router.replace("/login");return} setChecking(false)});return ()=>unsub()},[router]);
 if(checking)return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#FFF8F3"}}>Checking admin access...</div>;
 return <div style={{display:"flex",minHeight:"100vh"}}><aside style={{width:245,background:"#171717",color:"#fff",padding:18,position:"fixed",top:0,bottom:0,left:0,display:"flex",flexDirection:"column",zIndex:5}}>
 <div style={{fontWeight:900,fontSize:20,padding:"10px 8px 24px"}}>🍽️ Jafz Admin</div>
 <nav style={{display:"grid",gap:7}}>{links.map(([href,icon,label])=><button key={href} onClick={()=>router.push(href)} style={{border:0,textAlign:"left",padding:"12px 13px",borderRadius:12,color:"#fff",background:path===href?"linear-gradient(135deg,#FF6B35,#FF3D00)":"transparent",fontWeight:800}}>{icon} <span style={{marginLeft:8}}>{label}</span></button>)}</nav>
 <div style={{marginTop:"auto"}}><button onClick={async()=>{await signOut(auth);router.replace("/login")}} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid #444",background:"transparent",color:"#fff",fontWeight:800}}>Logout</button></div>
 </aside><section style={{marginLeft:245,flex:1}}>{children}</section></div>
}
