import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { signOut } from "firebase/auth";
import React, { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Cardapio from "./cardapio_screen";
import { auth } from "./services/firebaseConfig";

const Tab = createBottomTabNavigator();

// =====================================================
// HOME
// =====================================================

type StatusRestaurante = "aberto" | "fechado";

function HomeScreen() {
  const [status, setStatus] = useState<StatusRestaurante>("fechado");

  const isAberto = status === "aberto";

  return (
    <SafeAreaView style={styles.homeContainer}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          ZAPPY<Text style={styles.logoOrange}>FOOD</Text>
        </Text>
        <Text style={styles.title}>Painel do restaurante</Text>
      </View>

      <View style={styles.homeContent}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusIndicator,
                isAberto
                  ? styles.statusIndicatorOpen
                  : styles.statusIndicatorClosed,
              ]}
            />
            <Text style={styles.statusLabel}>STATUS DO RESTAURANTE</Text>
          </View>

          <Text style={styles.statusMessage}>
            {isAberto
              ? "Aberto — recebendo pedidos"
              : "Fechado — não recebendo pedidos"}
          </Text>

          <View style={styles.toggleRow}>
            <Pressable
              style={[
                styles.toggleOption,
                isAberto && styles.toggleOptionActiveOpen,
              ]}
              onPress={() => setStatus("aberto")}
            >
              <Text
                style={[styles.toggleText, isAberto && styles.toggleTextActive]}
              >
                🟢 ABERTO
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.toggleOption,
                !isAberto && styles.toggleOptionActiveClosed,
              ]}
              onPress={() => setStatus("fechado")}
            >
              <Text
                style={[
                  styles.toggleText,
                  !isAberto && styles.toggleTextActive,
                ]}
              >
                🔴 FECHADO
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>0</Text>
            <Text style={styles.summaryLabel}>Pedidos hoje</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>0</Text>
            <Text style={styles.summaryLabel}>Em preparo</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// =====================================================
// PEDIDOS (placeholder até definirmos os atributos)
// =====================================================

function PedidosScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderTitle}>Pedidos</Text>
      <Text style={styles.placeholderText}>Em construção.</Text>
    </View>
  );
}

// =====================================================
// API
// =====================================================

function ListarApiScreen() {
  return (
    <View style={styles.apiContainer}>
      <Text style={styles.apiTitle}>Dados da API</Text>

      <View style={styles.apiCard}>
        <Text style={styles.apiEndpoint}>GET /api/v1/pedidos</Text>
        <Text style={styles.apiStatus}>Status: 200 OK</Text>
      </View>

      <View style={styles.apiCard}>
        <Text style={styles.apiEndpoint}>GET /api/v1/cardapio</Text>
        <Text style={styles.apiStatus}>Status: 200 OK</Text>
      </View>
    </View>
  );
}

// =====================================================
// SAIR
// =====================================================

function SairScreen({ navigation }: any) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [saindo, setSaindo] = useState(false);

  // Abre o popup assim que a aba "Sair" é tocada
  useFocusEffect(
    useCallback(() => {
      setConfirmVisible(true);

      return () => setConfirmVisible(false);
    }, []),
  );

  // Cancelar fecha o popup e volta para a Home
  const handleCancel = () => {
    setConfirmVisible(false);

    navigation.navigate("Home");
  };

  const handleLogout = async () => {
    try {
      setSaindo(true);

      // Encerra a sessão no Firebase
      await signOut(auth);

      setSaindo(false);
      setConfirmVisible(false);

      // Vai para o Login e limpa o histórico (o botão voltar não traz o painel de volta)
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Erro ao sair:", error);
      setSaindo(false);
    }
  };

  return (
    <View style={styles.logoutContainer}>
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Sair</Text>
            <Text style={styles.confirmMessage}>
              Deseja realmente sair da sua conta?
            </Text>

            <View style={styles.confirmButtons}>
              <Pressable
                style={styles.confirmCancel}
                onPress={handleCancel}
                disabled={saindo}
              >
                <Text style={styles.confirmCancelText}>CANCELAR</Text>
              </Pressable>

              <Pressable
                style={styles.confirmExit}
                onPress={handleLogout}
                disabled={saindo}
              >
                <Text style={styles.confirmExitText}>
                  {saindo ? "SAINDO..." : "SAIR"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =====================================================
// DASHBOARD (tela principal após o login)
// =====================================================

export default function RestaurantDashboardScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#F58427",
          tabBarInactiveTintColor: "#666666",
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

            if (route.name === "Cardapio") iconName = "restaurant-outline";
            else if (route.name === "Pedidos") iconName = "receipt-outline";
            else if (route.name === "Home") iconName = "home-outline";
            else if (route.name === "ListarApi") iconName = "cloud-outline";
            else if (route.name === "Sair") iconName = "log-out-outline";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Cardapio"
          component={Cardapio}
          options={{ tabBarLabel: "Cardápio" }}
        />
        <Tab.Screen
          name="Pedidos"
          component={PedidosScreen}
          options={{ tabBarLabel: "Pedidos" }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: "Home" }}
        />
        <Tab.Screen
          name="ListarApi"
          component={ListarApiScreen}
          options={{ tabBarLabel: "API" }}
        />
        <Tab.Screen
          name="Sair"
          component={SairScreen}
          options={{ tabBarLabel: "Sair" }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080808" },
  tabBar: {
    backgroundColor: "#111111",
    borderTopWidth: 1,
    borderTopColor: "#242424",
    height: 65,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },

  // HOME
  homeContainer: { flex: 1, backgroundColor: "#080808" },
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 8 },
  logo: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#FFFFFF",
    marginBottom: 30,
  },
  logoOrange: { color: "#F58427" },
  title: { color: "#FFFFFF", fontSize: 24, fontWeight: "800" },
  homeContent: { flex: 1, paddingHorizontal: 24, paddingTop: 30, gap: 16 },
  statusCard: {
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  statusIndicator: { width: 10, height: 10, borderRadius: 5 },
  statusIndicatorOpen: { backgroundColor: "#2E8B57" },
  statusIndicatorClosed: { backgroundColor: "#B83A3A" },
  statusLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  statusMessage: { color: "#858585", fontSize: 12, marginBottom: 18 },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#0D0D0D",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#242424",
    padding: 4,
    gap: 4,
  },
  toggleOption: {
    flex: 1,
    height: 42,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleOptionActiveOpen: {
    backgroundColor: "#101A14",
    borderWidth: 1,
    borderColor: "#2E8B57",
  },
  toggleOptionActiveClosed: {
    backgroundColor: "#1A1111",
    borderWidth: 1,
    borderColor: "#B83A3A",
  },
  toggleText: { color: "#666666", fontSize: 12, fontWeight: "800" },
  toggleTextActive: { color: "#FFFFFF" },
  summaryRow: { flexDirection: "row", gap: 14 },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
  },
  summaryNumber: { color: "#F58427", fontSize: 26, fontWeight: "900" },
  summaryLabel: {
    color: "#858585",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },

  // PLACEHOLDER (Pedidos)
  placeholderContainer: {
    flex: 1,
    backgroundColor: "#080808",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  placeholderText: { color: "#858585", fontSize: 13, marginTop: 6 },

  // API
  apiContainer: {
    flex: 1,
    backgroundColor: "#080808",
    padding: 24,
    paddingTop: 40,
  },
  apiTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },
  apiCard: {
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  apiEndpoint: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  apiStatus: {
    color: "#2E8B57",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },

  // SAIR
  logoutContainer: {
    flex: 1,
    backgroundColor: "#080808",
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },

  // SAIR - POPUP DE CONFIRMAÇÃO
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  confirmCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#181818",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 24,
  },
  confirmTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  confirmMessage: { color: "#8C8C8C", fontSize: 14, marginBottom: 24 },
  confirmButtons: { flexDirection: "row", gap: 10 },
  confirmCancel: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmCancelText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  confirmExit: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#8B1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmExitText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
