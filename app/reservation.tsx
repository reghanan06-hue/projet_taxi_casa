import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { usePlacesStore } from "./data/locations";
export default function Reservation() {
  const router =useRouter();
  const { places, calculateDistanceAndPrice } = usePlacesStore();
const selectPlace = usePlacesStore((state) => state.selectPlace); // fonction pour mettre à jour
const selectedPlace = usePlacesStore((state) => state.selectedPlace); // valeur actuelle

  const [departure, setDeparture] = useState("Ma position actuelle");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState({ latitude: 33.6083, longitude: -7.6325 }); // Mosquée Hassan II par défaut
  const [loading, setLoading] = useState(true);

  // Récupération de la position
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Permission refusée — utilisation de la position par défaut");
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch (err) {
        console.log("Erreur localisation :", err);
        setLocation({ latitude: 33.6083, longitude: -7.6325 }); // fallback
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //  Calcul automatique Distance & Prix quand destination change
  useEffect(() => {
  if (!location || !selectedPlace) return;

  const { distance, price } = calculateDistanceAndPrice(
    location.latitude,
    location.longitude,
    selectedPlace.latitude,
    selectedPlace.longitude
  );

  setDistance(distance);
  setPrice(price);
}, [selectedPlace, location]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1055C9" />
        <Text>Chargement de la localisation...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textRes}>Réservation</Text>

      <Text style={styles.textPlace}>Départ</Text>
      <TextInput
        style={styles.input}
        value={departure}
        editable={false}
      />

      <Text style={styles.textPlace}>Arrived</Text>

<Picker
  style={styles.picker}
  selectedValue={selectedPlace?.id} // valeur actuelle
  onValueChange={(itemValue: number) => {
    const place = places.find((p) => p.id === itemValue);
    if (place) {
      selectPlace(place);           // met à jour store
      setDestination(place.title);  // met à jour state local
    }
  }}
>
  {places.map((p) => (
    <Picker.Item key={p.id} label={p.title} value={p.id} />
  ))}
</Picker>




      <View style={styles.detailRes}>
        <Text style={styles.titleDis}>Distance :</Text>
        <Text style={styles.textResdetail}>{distance} km</Text>
      </View>

      <View style={styles.detailRes}>
        <Text style={styles.titleDis}>Price :</Text>
        <Text style={styles.textResdetail}>{price} MAD</Text>
      </View>

      <TouchableOpacity style={styles.BtnConf} onPress={()=> router.push("/course")}>
                                              
        <Text style={styles.textConf}>Booking confirmation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingTop: 15,
    marginVertical: 50,
  },
  textRes: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1055C9",
    marginVertical: 40,
  },
  textPlace: {
    fontSize: 20,
    marginLeft: 30,
  },
  input: {
    width: 350,
    height: 40,
    backgroundColor: "#8CE4FF",
    alignSelf: "center",
    marginBottom: 30,
    fontSize: 18,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  picker: {
    width: 350,
    height: 50,
    alignSelf: "center",
    backgroundColor: "#8CE4FF",
    borderRadius: 8,
    marginBottom: 30,
  },
  BtnConf: {
    backgroundColor: "#1055C9",
    width: 300,
    height: 55,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 30,
    justifyContent: "center",
  },
  textConf: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  detailRes: {
    flexDirection: "column",
    width: 380,
    backgroundColor: "#9BB4C0",
    borderRadius: 15,
    marginBottom: 20,
    alignSelf: "center",
    paddingVertical: 10,
  },
  titleDis: {
    color: "white",
    fontSize: 22,
    marginLeft: 30,
  },
  textResdetail: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 30,
  },
});
