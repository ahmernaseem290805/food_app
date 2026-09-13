"use client";
import {useEffect,useState} from "react";
import {collection,getDocs,deleteDoc,doc} from "firebase/firestore";
import {db} from "../../lib/firebase";
import AdminShell from "../components/AdminShell";
export default function CustomersPage(){
 const [users,setUsers]=useState<any[]>([]),[orders,setOrders]=useState<any[]>([]);
 const load=async()=>{const [u,o]=await Promise.all([getDocs(collection(db,"UserProfiles")),getDocs(collection(db,"Orders"))]);setUsers(u.docs.map(d=>({id:d.id,...d.data()})));setOrders(o.docs.map(d=>({id:d.id,...d.data()})))};
 useEffect(()=>{load()},[]);
 const remove=async id=>{if(!confirm("Remove this customer profile? Firebase Authentication account is not deleted from the browser."))return;await deleteDoc(doc(db,"UserProfiles",id));load()};
 return <AdminShell><main className="page"><h1>Customers</h1><p className="subtitle">Registered users and their order history.</p><section className="card">{users.length===0?<p>No customer profiles found.</p>:users.map(u=>{const count=orders.filter(o=>o.userId===u.id).length;return <div className="listItem" key={u.id}><div className="info"><h3>{u.UserName||u.name||"Customer"}</h3><p>{u.email||"No email saved"} · {count} order(s)</p><p>ID: {u.id}</p></div><button className="danger" onClick={()=>remove(u.id)}>Remove Profile</button></div>})}</section></main></AdminShell>
}
