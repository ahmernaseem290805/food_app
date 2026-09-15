"use client";
import {useEffect,useState} from "react";
import {collection,addDoc,getDocs,serverTimestamp} from "firebase/firestore";
import {db} from "../../lib/firebase";
import AdminShell from "../components/AdminShell";
export default function NotificationsPage(){
 const [items,setItems]=useState<any[]>([]),[title,setTitle]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
 const load=async()=>{const s=await getDocs(collection(db,"Notifications"));setItems(s.docs.map(d=>({id:d.id,...d.data()})).sort((a:any,b:any)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)))};
 useEffect(()=>{load()},[]);
 const send=async()=>{if(!title||!message)return alert("Title and message are required.");setBusy(true);try{await addDoc(collection(db,"Notifications"),{title:title.trim(),message:message.trim(),createdAt:serverTimestamp(),readBy:[]});setTitle("");setMessage("");load();alert("Notification saved for customers.")}finally{setBusy(false)}};
 return <AdminShell><main className="page"><h1>Notifications</h1><p className="subtitle">Create in-app announcements and offers.</p><section className="card"><div className="field"><label>Title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Weekend offer"/></div><div className="field"><label>Message</label><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="20% off on burgers today!"/></div><button className="primary" disabled={busy} onClick={send}>{busy?"Saving...":"Publish Notification"}</button></section><section className="card"><h2>Published</h2>{items.map(n=><div className="listItem" key={n.id}><div className="info"><h3>{n.title}</h3><p>{n.message}</p></div></div>)}</section></main></AdminShell>
}
