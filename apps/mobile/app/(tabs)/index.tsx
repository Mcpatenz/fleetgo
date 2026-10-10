import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const stats = [
  { label: "Vehicles", value: "128" },
  { label: "Active", value: "94" },
  { label: "Maintenance", value: "12" },
  { label: "Fuel Spend", value: "₱58,450" },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FleetGo</Text>
        <Text style={styles.subtitle}>Fleet overview</Text>
      </View>

      <View style={styles.grid}>
        {stats.map((item) => (
          <View key={item.label} style={styles.card}>
            <Text style={styles.cardValue}>{item.value}</Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Summary</Text>
        <Text style={styles.item}>• 3 vehicles due for maintenance</Text>
        <Text style={styles.item}>• 1 document expires soon</Text>
        <Text style={styles.item}>• 2 fuel entries awaiting approval</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  header: {
    marginTop: 52,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },
  cardLabel: {
    marginTop: 6,
    color: "#475569",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#0f172a",
  },
  item: {
    color: "#334155",
    marginBottom: 8,
  },
});
