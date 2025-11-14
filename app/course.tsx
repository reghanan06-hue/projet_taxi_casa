import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { usePlacesStore } from './data/locations';

export default function SimulatedMap() {
  const router = useRouter();
const selectedTaxi = usePlacesStore((state) => state.selectedTaxi);
const { resetTaxi } = usePlacesStore();
const date = new Date().toISOString().slice(0, 10);


 const [namedriver,setnameDriver] = useState("");
 const [rating,setRating] =useState("");

  const ROUTE = [
    { latitude: 33.5731, longitude: -7.5898 },
    { latitude: 33.5735, longitude: -7.5905 },
    { latitude: 33.5742, longitude: -7.5912 },
    { latitude: 33.5750, longitude: -7.5920 },
  ];

  const [index, setIndex] = useState(0);
  const [taxiCoord, setTaxiCoord] = useState(ROUTE[0]);
  const mapRef = useRef<MapView | null>(null);
  const STEP_MS = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= ROUTE.length) {
          clearInterval(interval);
          return prev;
        }
        setTaxiCoord(ROUTE[next]);
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              ...ROUTE[next],
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            500
          );
        }
        return next;
      });
    }, STEP_MS);

    return () => clearInterval(interval);
  }, []);
  // select taxi for display data
  useEffect(() => {
  if (selectedTaxi) {
    setnameDriver(selectedTaxi.driver);
    setRating(selectedTaxi.rating.toString());
  }
}, [selectedTaxi]);
// afficher msg alert
const showAlert = () => {
  Alert.alert(
    "Confirmation",
    "Do you want to cancel the ride?",
    [
      {
        text: "Yes",
        style: "destructive",

       onPress: () => {
          resetTaxi();          // initial value info driver
          router.push("/map");  
        }
      },
      {
        text: "No",
        style: "cancel"
      }
    ]
  );
};
if (!selectedTaxi)
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "blue", fontSize: 25,fontWeight:"bold" }}>
        No taxi selected
      </Text>
       <TouchableOpacity style={styles.bttnResver}>
        <Text style={styles.textBtnResver} onPress={()=>router.push("/map")}> back</Text>
      </TouchableOpacity>
    </View>
  );

   return (

  
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={{ width: '100%', height: 500, borderRadius: 12 }}
        initialRegion={{
          latitude: ROUTE[0].latitude,
          longitude: ROUTE[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polyline coordinates={ROUTE} strokeWidth={4} strokeColor="#2B8BE6" />

        <Marker coordinate={taxiCoord}>
          <View style={styles.taxiMarker}>
            <Text style={{ fontSize: 28, color: 'red' }}>🚕 Taxi</Text>
          </View>
        </Marker>
      </MapView>

      {/* Infos chauffeur */}
      <View style={styles.modelInfo}>
        <View style={styles.infoDriver}>
          <Image
            source={require('../assets/images/driver.png')}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <Text style={styles.text}>{selectedTaxi?.driver || "Not selected"}</Text>
          <Image
            source={require('../assets/images/start.png')}
            style={{ width: 30, height: 30 }}
          />
          <Text style={styles.text}>{selectedTaxi?.rating ?? "0"}</Text>

        </View>

        <View style={styles.infoCourse}>
           <Image
            source={require('../assets/images/taxi.png')}
            style={{ width: 60, height: 60 }}
          />
          <Text style={styles.textMatricule}>{selectedTaxi?.path ?? "no id of taxi"}</Text>

        </View>
         <View style={styles.infoCourse}>
         
          <Text style={{textAlign:"center",fontWeight:"bold",marginHorizontal:95,fontSize:15}}>Date: {date}</Text>

        </View>
        <View style={styles.infoCourse}>
         
          <Text style={{textAlign:"center",fontWeight:"bold",fontSize:15}}>Time: 20 min</Text>

        </View>
      </View>
<View style={styles.styleBttn}> 
{/* Bouton Annuler */}
      <TouchableOpacity style={styles.bttnResver}>
        <Text style={styles.textBtnResver} onPress={showAlert}>Cancel</Text>
      </TouchableOpacity>
       {/* Bouton save */}
      <TouchableOpacity style={styles.bttnResver}>
        <Text style={styles.textBtnResver} onPress={()=>router.push("/historique")}>Save</Text>
      </TouchableOpacity>
</View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  taxiMarker: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelInfo: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  infoDriver: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  infoCourse: {
    flexDirection: 'row',
    marginLeft:15,
  },
  text: {
    color: 'blue',
    fontSize: 18,
  },
  textMatricule:{
   color: 'black',
    fontSize: 15,
    fontWeight:"bold",
    marginTop:15,
    marginLeft:35,
  },
  bttnResver: {
    backgroundColor: '#1055C9',
    width: 150,
    height: 50,
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 20,
    marginLeft:30,
    marginBottom: 5,
    justifyContent: 'center',
  },
  textBtnResver: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  styleBttn:{
    flexDirection:"row",
  }
});
