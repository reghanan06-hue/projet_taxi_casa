import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function historique() {
  const data = [
  { id: "1", title: "Card 1" },
  { id: "2", title: "Card 2" },
  { id: "3", title: "Card 3" },
];
  return (
   <View style={styles.contenaier}>

  <FlatList
  data={data}
  keyExtractor={(item)=> item.id.toString()}
  renderItem={({item})=>(
  <View style={styles.card}>
   <Text> date : {item.title}</Text>
 <Text>From: {item.title}</Text>
  <Text>to: {item.title}</Text>
  </View>
 
  )
}
  />
   </View>
  )
}
const styles =StyleSheet.create({
contenaier:{
  flex:1,
   padding: 10,
   marginVertical:50,
},
card: {
    backgroundColor: '#40acdaff',
    marginVertical: 5,
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    shadowColor: '#d0be4bff',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});