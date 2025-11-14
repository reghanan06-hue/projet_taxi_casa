import { create } from "zustand";

// =========================
//  Types
// =========================
export interface Place {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
}

export interface Taxi {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  driver: string;
  rating: number;
  path: string;
}

interface PlacesState {
  places: Place[];
  taxis: Taxi[];
  selectedTaxi: Taxi | null;
  selectedPlace: Place | null;

  resetTaxi: () => void;
  resetPlace: () => void;

  setPlaces: (newPlaces: Place[]) => void;
  setTaxis: (newTaxis: Taxi[]) => void;

  selectTaxi: (taxi: Taxi) => void;
  selectPlace: (place: Place) => void;

  calculateDistanceAndPrice: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => { distance: number; price: number;durationMn:number };
}

// =========================
//  Store Zustand corrigé
// =========================
export const usePlacesStore = create<PlacesState>((set) => ({
  //  Lieux prédéfinis
  places: [
    { id: 1, title: "Mosquée Hassan II", latitude: 33.6083, longitude: -7.6325 },
    { id: 2, title: "Quartier des Habous", latitude: 33.5786, longitude: -7.5969 },
    { id: 3, title: "Place Mohammed V", latitude: 33.5899, longitude: -7.6039 },
    { id: 4, title: "Morocco Mall", latitude: 33.5671, longitude: -7.6921 },
    { id: 5, title: "Plage d'Ain Diab", latitude: 33.5968, longitude: -7.6775 },
    { id: 6, title: "Casa Port", latitude: 33.6019, longitude: -7.6121 },
    { id: 7, title: "Casa Voyageurs", latitude: 33.5883, longitude: -7.6023 },
  ],

  taxis: [
    { id: 1, title: "Taxi 1", driver:"Ahmed Benali", rating: 4.8,path:"A-10234-BM",  latitude: 33.5899, longitude: -7.605 },
    { id: 2, title: "Taxi 2", driver:"Ali Anssari", rating: 5,path:"A-56789-Toyota", latitude: 33.5905, longitude: -7.607 },
    { id: 3, title: "Taxi 3", driver:"Said Salami", rating: 3.8,path:"A-23456-Dasia", latitude: 33.5889, longitude: -7.601 },
    { id: 4, title: "Taxi 4", driver:"Badre Alami", rating: 3.5, path:"A-78901-BM", latitude: 33.5922, longitude: -7.604 },
    { id: 5, title: "Taxi 5", driver:"Ahmed Mohamadi", rating: 5, path:"A-34567-Toyota",latitude: 33.5935, longitude: -7.606 },
  ],

  selectedTaxi: null,
  selectedPlace: null,

  // =========================
  //  Reset functions
  // =========================
  resetTaxi: () => set({ selectedTaxi: null }),
  resetPlace: () => set({ selectedPlace: null }),

  // =========================
  //  Setters
  // =========================
  setPlaces: (newPlaces) => set({ places: newPlaces }),
  setTaxis: (newTaxis) => set({ taxis: newTaxis }),

  selectTaxi: (taxi) => set({ selectedTaxi: taxi }),
  selectPlace: (place) => set({ selectedPlace: place }),

  // =========================
  // 🧮 Fonction de calcul
  // =========================
  calculateDistanceAndPrice: (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const baseFare = 7;
    const pricePerKm = 3;

    const price = baseFare + distance * pricePerKm;
 const speed = 40; // km/h
  const durationMinutes = (distance / speed) * 60;
    return {
      distance: parseFloat(distance.toFixed(2)),
      price: parseFloat(price.toFixed(2)),
      durationMn:parseFloat(price.toFixed(2)),
    };
  },
}));
