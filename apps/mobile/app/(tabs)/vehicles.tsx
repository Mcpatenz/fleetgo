import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const vehicles = [
  { id: "1", plate: "ABC-1234", model: "Toyota Hiace", status: "Active" },
  { id: "2", plate: "XYZ-8891", model: "Isuzu Elf", status: "Maintenance" },
  { id: "3", plate: "LRT-9902", model: "Ford Transit", status: "Active" },
];

export default function VehiclesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicles</Text>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.plate}>{item.plate}</Text>
            <Text style={styles.model}>{item.model}</Text>
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
    marginTop: 52,
    marginBottom: 20,
  },
  item: {
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
    marginTop: 4,
    color: "#475569",
  },
  status: {
    marginTop: 10,
    color: "#2563eb",
    fontWeight: "700",
  },
});
