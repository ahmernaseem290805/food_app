import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { colors, gradients } from "../design/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function Categories({ navigation, onSelect }) {
  const [categories, setCategories] = useState([]); const [active, setActive] = useState("all");
  useEffect(() => { getDocs(collection(db,"Categories")).then(s => setCategories([{id:"all",name:"All"}, ...s.docs.map(d => ({id:d.id,name:d.data().name || d.id}))])).catch(() => setCategories([{id:"all",name:"All"}])); }, []);
  const select = cat => { setActive(cat.id); onSelect?.(cat.name === "All" ? null : cat.name); };
  return <View style={styles.wrap}><View style={styles.heading}><Text style={styles.title}>Categories</Text><TouchableOpacity onPress={() => navigation?.navigate("Categories")}><Text style={styles.explore}>Explore</Text></TouchableOpacity></View>{categories.length===0?<ActivityIndicator color={colors.primary}/>:<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>{categories.map(cat=>active===cat.id?<TouchableOpacity key={cat.id} onPress={()=>select(cat)}><LinearGradient colors={gradients.primary} style={styles.item}><Text style={styles.selected}>{cat.name}</Text></LinearGradient></TouchableOpacity>:<TouchableOpacity key={cat.id} onPress={()=>select(cat)} style={[styles.item,styles.normal]}><Text style={styles.normalText}>{cat.name}</Text></TouchableOpacity>)}</ScrollView>}</View>;
}
const styles=StyleSheet.create({wrap:{marginTop:4},heading:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:16,marginBottom:2},title:{fontSize:19,fontWeight:"900",color:colors.text},explore:{color:colors.primary,fontWeight:"800"},scroll:{paddingHorizontal:16,paddingVertical:12,gap:10},item:{height:42,paddingHorizontal:16,borderRadius:15,justifyContent:"center"},normal:{backgroundColor:"#fff",borderWidth:1,borderColor:colors.border},selected:{color:"#fff",fontWeight:"800"},normalText:{color:colors.text,fontWeight:"700"}});
