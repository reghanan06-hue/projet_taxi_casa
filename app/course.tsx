import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { usePlacesStore } from './data/locations';

export default function SimulatedMap() {
  const router = useRouter();

  // 1 seul appel zustand
  const {
    selectedTaxi,
    resetTaxi,
    places,
    calculateDistanceAndPrice
  } = usePlacesStore();



  const date = new Date().toISOString().slice(0, 10);

  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);

  const [nameDriver, setNameDriver] = useState("");
  const [rating, setRating] = useState("");

  // route fixe simulation
  const ROUTE = [
    { latitude: 33.5731, longitude: -7.5898 },
    { latitude: 33.5735, longitude: -7.5905 },
    { latitude: 33.5742, longitude: -7.5912 },
    { latitude: 33.5750, longitude: -7.5920 },
  ];

  const [index, setIndex] = useState(0);
  const [taxiCoord, setTaxiCoord] = useState(ROUTE[0]);
  //const mapRef = useRef(null);
const mapRef = useRef<MapView>(null);

  const STEP_MS = 1000;

  // Simulation déplacement taxi
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1;
        if (next >= ROUTE.length) {
          clearInterval(interval);
          return prev;
        }
        setTaxiCoord(ROUTE[next]);

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...ROUTE[next],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 500);
        }
        return next;
      });
    }, STEP_MS);

    return () => clearInterval(interval);
  }, []);

//  Calcul automatique Distance & Prix quand destination change
 
//
  // Charger infos taxi sélectionné
  useEffect(() => {
    if (selectedTaxi) {
      setNameDriver(selectedTaxi.driver);
      setRating(selectedTaxi.rating.toString());
      setDuration(duration);
      setPrice(price);
    }
  }, [selectedTaxi]);

  // Alert annulation ride
  const showAlert = () => {
    Alert.alert(
      "Confirmation",
      "Do you want to cancel the ride?",
      [
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            resetTaxi();
            router.push("/map");
          }
        },
        { text: "No", style: "cancel" }
      ]
    );
  };

// 🔥 Calculer distance, prix et durée dès que l'écran charge
useEffect(() => {
 // const start = ROUTE[0];

 const start = { latitude: 33.6083, longitude: -7.6325 }; // Hassan II

  const end = ROUTE[ROUTE.length - 1];
  const { distance, price, durationMn } = calculateDistanceAndPrice(
    start.latitude,
    start.longitude,
    end.latitude,
    end.longitude
  );

  setDuration(durationMn);
  setPrice(price);
}, []);

// if user not select taxi dispaly msg eror
  if (!selectedTaxi)
    return (
      <View style={styles.center}>
        <Text style={styles.noTaxi}>No taxi selected</Text>
        <TouchableOpacity style={styles.bttnResver} onPress={() => router.push("/map")}>
          <Text style={styles.textBtnResver}>Back</Text>
        </TouchableOpacity>
      </View>
    );

//  select  taxi dispaly card  and info driver
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>

      {/* MAP */}
      <MapView
        ref={mapRef}
        style={{ width: '100%', height: 400, borderRadius: 12 }}
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
          <Image source={require('../assets/images/driver.png')} style={styles.photo} />
          <Text style={styles.text}>{nameDriver}</Text>
          <Image source={require('../assets/images/start.png')} style={styles.star} />
          <Text style={styles.text}>{rating}</Text>
        </View>

        <View style={styles.infoCourse}>
          <Image source={require('../assets/images/taxi.png')} style={styles.taxiImg} />
          <Text style={styles.textMatricule}>{selectedTaxi?.path}</Text>
        </View>

        <View style={styles.infoCourse}></View>
        <Text style={styles.infoText}>Date: {date}</Text>
        <Text style={styles.infoText}>Time: {duration} min</Text>
                <Text style={styles.infoText}>Prix: {price} Dh</Text>
{/* Boutons */}
      <View style={styles.styleBttn}>
        <TouchableOpacity style={styles.bttnResver} onPress={showAlert}>
          <Text style={styles.textBtnResver}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bttnResver} onPress={() => router.push("/historique")}>
          <Text style={styles.textBtnResver}>Save</Text>
        </TouchableOpacity>
      </View>
      </View>

      

    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  noTaxi: { color: "blue", fontSize: 25, fontWeight: "bold" },

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
    height:450,
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
    marginLeft: 15,
  },

  text: { color: 'blue', fontSize: 18 },

  textMatricule: {
    color: 'black',
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 15,
    marginLeft: 35,
  },

  photo: { width: 80, height: 80, borderRadius: 40 },
  star: { width: 30, height: 30 },
  taxiImg: { width: 60, height: 60 },

  infoText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 5
  },

  bttnResver: {
    backgroundColor: '#1055C9',
    width: 150,
    height: 50,
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 5,
    justifyContent: 'center',
  },

  textBtnResver: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  styleBttn: {
    flexDirection: "row",
    justifyContent: "space-around",
  }
});
