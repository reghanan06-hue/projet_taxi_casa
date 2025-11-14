import { useRouter } from "expo-router";
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import "../assets/images/tax1.jpg";

export default function splash() {
  const router= useRouter();
  return (
   <View>
     <Image
          source={require("../assets/images/tax1.jpg")}
          style={styles.image}
          resizeMode="cover"
        />
<TouchableOpacity
        style = {styles.BtnWelcome}

onPress={()=> router.push("/map")}>

        <Text style={styles.text}>welcome</Text>
      </TouchableOpacity>
   </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    marginVertical: 50,
      backgroundColor: "white",
  },
  
 
  
  BtnWelcome: {
    backgroundColor: "#1055C9",
    width: 300,
    height: 55,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 30,
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
    image: {
    width: "100%",
    height: 500,
  },
  
});
