"use client";
import {useEffect,useState} from "react";
import {collection,getDocs} from "firebase/firestore";
import {db} from "../../lib/firebase";
import AdminShell from "../components/AdminShell";

export default function DashboardPage(){
 const [orders,setOrders]=useState<any[]>([]),[users,setUsers]=useState<any[]>([]),[loading,setLoading]=useState(true);
 useEffect(()=>{Promise.all([getDocs(collection(db,"Orders")),getDocs(collection(db,"UserProfiles"))]).then(([o,u])=>{setOrders(o.docs.map(d=>({id:d.id,...d.data()})));setUsers(u.docs.map(d=>({id:d.id,...d.data()})));}).finally(()=>setLoading(false))},[]);
 const today=new Date(); const todaySales=orders.filter(o=>{const s=o.createdAt?.seconds?new Date(o.createdAt.seconds*1000):null;return s&&s.toDateString()===today.toDateString()&&o.status!=="cancelled"}).reduce((n,o)=>n+Number(o.total||0),0);
 const pending=orders.filter(o=>["pending","confirmed","preparing"].includes(o.status)).length;
 const delivered=orders.filter(o=>o.status==="delivered").length;
 return <AdminShell><main className="page"><h1>Dashboard</h1><p className="subtitle">A quick look at your restaurant today.</p>
 {loading?<div className="card">Loading...</div>:<>
 <div className="grid"><div className="stat"><p>Total Orders</p><h2>{orders.length}</h2></div><div className="stat"><p>Today's Sales</p><h2>Rs. {todaySales}</h2></div><div className="stat"><p>Pending Orders</p><h2>{pending}</h2></div><div className="stat"><p>Customers</p><h2>{users.length}</h2></div></div>
 <div className="card" style={{marginTop:20}}><div className="row"><div><h2>Order Overview</h2><p className="subtitle" style={{margin:0}}>Delivered: {delivered} • Pending: {pending} • Cancelled: {orders.filter(o=>o.status==="cancelled").length}</p></div></div></div>
 <div className="card"><h2>Recent Orders</h2>{orders.slice().sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)).slice(0,6).map(o=><div className="listItem" key={o.id}><div className="info"><h3>#{o.id.slice(0,8)} · {o.customerName||"Customer"}</h3><p>{(o.items||[]).map((i:any)=>`${i.name} × ${i.quantity||i.qty||1}`).join(", ")}</p></div><div><strong>Rs. {o.total||0}</strong><div className="badge">{o.status||"pending"}</div></div></div>)}</div>
 </>}
 </main></AdminShell>
}
