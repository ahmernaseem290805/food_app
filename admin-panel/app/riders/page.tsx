"use client";
import {useEffect,useState} from "react";
import {collection,addDoc,getDocs,deleteDoc,doc,serverTimestamp} from "firebase/firestore";
import {db} from "../../lib/firebase";
import AdminShell from "../components/AdminShell";
export default function RidersPage(){
 const [riders,setRiders]=useState<any[]>([]),[name,setName]=useState(""),[phone,setPhone]=useState(""),[busy,setBusy]=useState(false);
 const load=async()=>{const s=await getDocs(collection(db,"Riders"));setRiders(s.docs.map(d=>({id:d.id,...d.data()})))};
 useEffect(()=>{load()},[]);
 const add=async()=>{if(!name||!phone)return alert("Name and phone are required.");setBusy(true);try{await addDoc(collection(db,"Riders"),{name:name.trim(),phone:phone.trim(),available:true,createdAt:serverTimestamp()});setName("");setPhone("");load()}finally{setBusy(false)}};
 const remove=async id=>{if(confirm("Delete this rider?")){await deleteDoc(doc(db,"Riders",id));load()}};
 return <AdminShell><main className="page"><h1>Delivery Riders</h1><p className="subtitle">Add riders and use them for order assignment.</p><section className="card"><h2>Add Rider</h2><div className="formGrid"><div className="field"><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Rider name"/></div><div className="field"><label>Phone</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="03xx..."/></div></div><button className="primary" disabled={busy} onClick={add}>{busy?"Adding...":"Add Rider"}</button></section><section className="card"><h2>Riders</h2>{riders.length===0?<p>No riders added.</p>:riders.map(r=><div className="listItem" key={r.id}><div className="info"><h3>{r.name}</h3><p>{r.phone}</p></div><span className={`badge ${r.available===false?"red":"green"}`}>{r.available===false?"Unavailable":"Available"}</span><button className="danger" onClick={()=>remove(r.id)}>Delete</button></div>)}</section></main></AdminShell>
}
