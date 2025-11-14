import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { usePlacesStore } from "./data/locations";
export default function MapScreen() {
  const { places, taxis,selectTaxi,  selectPlace} = usePlacesStore();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  //const [selecttaxi,selectTaxi] = useState("");

  const router = useRouter();
  // position par defaut (Mosquée Hassan II)
  const defaultLocation = {
    coords: {
      latitude: 33.6083,
      longitude: -7.6325,
    },
  };

  useEffect(() => {
    (async () => {
      try {
      // demande permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission refusée",
            "L'accès à la localisation est refusé. Utilisation du lieu par défaut (Mosquée Hassan II)."
          );
          setLocation(defaultLocation as any);
          setLoading(false);
          return;
        }

        // take position location
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation(loc);
        setLoading(false);
      } catch (error) {
// si eror en GPs
        Alert.alert(
          "Erreur de localisation",
          "Impossible d'obtenir la position actuelle. Mosquée Hassan II sera utilisée par défaut."
        );
        setLocation(defaultLocation as any);
        setLoading(false);
      }
    })();
  }, []);

// onloading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  // affiche map
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        provider="google"
        showsUserLocation={true}
        initialRegion={{
          latitude: location?.coords.latitude || defaultLocation.coords.latitude,
          longitude: location?.coords.longitude || defaultLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* place */}
        {places.map((place) => (
          <Marker
            key={`place-${place.id}`}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.title}
            pinColor="blue"
            onPress={()=>selectPlace(place) }
            //selectPlace(place)
          />
        ))}

        {/* taxi */}
        {taxis.map((taxi) => (
          <Marker
            key={`taxi-${taxi.id}`}
            coordinate={{
              latitude: taxi.latitude,
              longitude: taxi.longitude,
            }}
            title={taxi.title}
            pinColor="red"
            //image={require('./assets/images/taxi-app.png')}
                       // selectTaxi(taxi); 
                      onPress={()=>selectTaxi(taxi)} 
                      // }           
          />
          
        ))}

        {/* position user */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Ma position"
            pinColor="green"
          />
        )}
      </MapView>
       {/* Texte & Bouton réservation */}
      <Text style={styles.textQs}>Where are you going?</Text>

      <TouchableOpacity
        style={styles.bttnResver}

     onPress={()=> router.push("/reservation")}>

        <Text style={styles.textBtnResver}>Reserve a taxi</Text>
      </TouchableOpacity>
    </View>
    
  );
}
// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  map: { width: "100%", flex: 1 },
  bttnResver: {
    backgroundColor: "#1055C9",
    width: 250,
    height: 50,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 90,
  },
  textBtnResver: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 9,
  },
  textQs: { fontSize: 20, fontWeight: "bold", textAlign: "center",marginTop:30 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  zoomContainer: {
    position: "absolute",
    right:5,
    bottom: 190,
    marginRight:1,
    flexDirection: "column",
  },
  btn: {
    backgroundColor: "white",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    elevation: 4,
  },
  text: { fontSize: 28, fontWeight: "bold" },
});

