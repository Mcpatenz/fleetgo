import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
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

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    vehiclesInMaintenance: 0,
    fuelCostThisMonth: 0,
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          Alert.alert("Session expired", "Please log in again.");
          return;
        }

        const [summaryResponse, vehiclesResponse] = await Promise.all([
          apiRequest<{ data: typeof stats }>("/api/v1/dashboard/summary", token),
          apiRequest<{ data: Vehicle[] }>("/api/v1/vehicles", token),
        ]);

        setStats(summaryResponse.data);
        setVehicles(vehiclesResponse.data);
      } catch (error) {
        Alert.alert("Error", "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}> 
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FleetGo</Text>
      <Text style={styles.subtitle}>Fleet overview</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{stats.totalVehicles}</Text>
          <Text style={styles.cardLabel}>Vehicles</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{stats.activeVehicles}</Text>
          <Text style={styles.cardLabel}>Active</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{stats.vehiclesInMaintenance}</Text>
          <Text style={styles.cardLabel}>Maintenance</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>₱{stats.fuelCostThisMonth.toLocaleString()}</Text>
          <Text style={styles.cardLabel}>Fuel Cost</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Vehicles</Text>
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
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
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
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
