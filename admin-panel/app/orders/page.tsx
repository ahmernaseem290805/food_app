"use client";
import {useEffect,useState} from "react";
import {collection,getDocs,doc,updateDoc} from "firebase/firestore";
import {db} from "../../lib/firebase";
import AdminShell from "../components/AdminShell";
const statuses=["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"];
export default function OrdersPage(){
 const [orders,setOrders]=useState<any[]>([]),[riders,setRiders]=useState<any[]>([]),[loading,setLoading]=useState(true);
 const load=async()=>{const [s,r]=await Promise.all([getDocs(collection(db,"Orders")),getDocs(collection(db,"Riders"))]);setRiders(r.docs.map(d=>({id:d.id,...d.data()})));setOrders(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));setLoading(false)};useEffect(()=>{load()},[]);
 const change=async(id,status)=>{await updateDoc(doc(db,"Orders",id),{status});load()}; const assign=async(id,riderId)=>{const rider=riders.find(r=>r.id===riderId);await updateDoc(doc(db,"Orders",id),{riderId:riderId||"",riderName:rider?.name||""});load()};
 return <AdminShell><main className="page"><h1>Orders</h1><p className="subtitle">See new orders and update their status.</p><div className="card">{loading?<p>Loading...</p>:orders.length===0?<p>No orders yet.</p>:orders.map(o=><div className="listItem" key={o.id}><div className="info"><h3>#{o.id.slice(0,8)} · {o.customerName||"Customer"}</h3><p>{o.customerEmail||""}</p><p>📍 {o.address||"Not provided"}</p><p>{(o.items||[]).map((i:any)=>`${i.name} × ${i.quantity||i.qty||1}`).join(" • ")}</p><strong>Rs. {o.total||0}</strong></div><div><select className="statusSelect" value={o.status||"pending"} onChange={e=>change(o.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select><select className="statusSelect" value={o.riderId||""} onChange={e=>assign(o.id,e.target.value)}><option value="">Assign rider</option>{riders.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select><div style={{marginTop:8,textAlign:"right"}}><span className="badge">{o.paymentMethod||"COD"} · {o.paymentStatus||"unpaid"}</span></div></div></div>)}</div></main></AdminShell>
}
