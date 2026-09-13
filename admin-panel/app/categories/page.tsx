"use client";
import {useEffect,useState} from "react";
import {collection,addDoc,getDocs,deleteDoc,doc,updateDoc,serverTimestamp} from "firebase/firestore";
import {db} from "../../lib/firebase";
import AdminShell from "../components/AdminShell";
export default function CategoriesPage(){
 const [cats,setCats]=useState<any[]>([]),[name,setName]=useState(""),[editing,setEditing]=useState<string|null>(null);
 const load=async()=>{const s=await getDocs(collection(db,"Categories"));setCats(s.docs.map(d=>({id:d.id,...d.data()})))};
 useEffect(()=>{load()},[]);
 const save=async()=>{if(!name.trim())return;if(editing)await updateDoc(doc(db,"Categories",editing),{name:name.trim(),updatedAt:serverTimestamp()});else await addDoc(collection(db,"Categories"),{name:name.trim(),createdAt:serverTimestamp()});setName("");setEditing(null);load()};
 const remove=async id=>{if(!confirm("Delete this category? Products using it will keep their old category value."))return;await deleteDoc(doc(db,"Categories",id));load()};
 return <AdminShell><main className="page"><h1>Categories</h1><p className="subtitle">Manage Burgers, Pizza, Drinks, Fries and more.</p><section className="card"><div className="row"><h2>{editing?"Edit Category":"Add Category"}</h2>{editing&&<button className="secondary" onClick={()=>{setEditing(null);setName("")}}>Cancel</button>}</div><div style={{display:"flex",gap:10}}><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Category name"/><button className="primary" onClick={save}>{editing?"Update":"Add"}</button></div></section><section className="card"><h2>All Categories</h2>{cats.map(c=><div className="listItem" key={c.id}><div className="info"><h3>{c.name||c.id}</h3><p>ID: {c.id}</p></div><div className="actions"><button className="secondary" onClick={()=>{setEditing(c.id);setName(c.name||"")}}>Edit</button><button className="danger" onClick={()=>remove(c.id)}>Delete</button></div></div>)}</section></main></AdminShell>
}
