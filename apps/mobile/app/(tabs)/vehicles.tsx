import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import { getAccessToken } from "@/services/auth";
import { apiRequest } from "@/services/api";

type Vehicle = {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  status: string;
};

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [plateNumber, setPlateNumber] = useState("ABC-9999");
  const [make, setMake] = useState("Mercedes");
  const [model, setModel] = useState("Sprinter");
  const [year, setYear] = useState("2024");

  const loadVehicles = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await apiRequest<{ data: Vehicle[] }>("/api/v1/vehicles", token);
      setVehicles(response.data);
    } catch (error) {
      Alert.alert("Error", "Unable to load vehicles");
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleCreateVehicle = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        Alert.alert("Session expired", "Please login again.");
        return;
      }

      await apiRequest<{ data: Vehicle }>("/api/v1/vehicles", token, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plateNumber,
          make,
          model,
          year: Number(year),
          status: "ACTIVE",
        }),
      });

      Alert.alert("Success", "Vehicle created");
      setPlateNumber("");
      setMake("");
      setModel("");
      setYear("");
      loadVehicles();
    } catch (error) {
      Alert.alert("Error", "Unable to create vehicle");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicles</Text>

      <View style={styles.form}>
        <TextInput placeholder="Plate Number" value={plateNumber} onChangeText={setPlateNumber} style={styles.input} />
        <TextInput placeholder="Make" value={make} onChangeText={setMake} style={styles.input} />
        <TextInput placeholder="Model" value={model} onChangeText={setModel} style={styles.input} />
        <TextInput placeholder="Year" value={year} onChangeText={setYear} keyboardType="numeric" style={styles.input} />

        <Pressable onPress={handleCreateVehicle} style={styles.button}>
          <Text style={styles.buttonText}>Create vehicle</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Vehicle list</Text>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.vehicleItem}>
            <Text style={styles.plate}>{item.plateNumber}</Text>
            <Text style={styles.model}>{item.make} {item.model}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 50,
    marginBottom: 20,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0f172a",
  },
  vehicleItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  plate: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  model: {
    color: "#475569",
    marginTop: 4,
  },
  status: {
    marginTop: 8,
    color: "#2563eb",
    fontWeight: "700",
  },
});
