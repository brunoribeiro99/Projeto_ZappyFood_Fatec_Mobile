import React, { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { database as db } from "./services/firebaseConfig";

// =====================================================
// TIPO DE RESTAURANTE (LEITURA SIMPLES DO REALTIME DATABASE)
// =====================================================

interface Restaurante {
  id: string;
  nomeRestaurante: string;
}

export default function ClientHome({ navigation }: any) {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // BUSCAR RESTAURANTES NO FIREBASE
  // =====================================================

  useEffect(() => {
    const carregarRestaurantes = async () => {
      try {
        const snapshot = await get(ref(db, "restaurantes"));

        if (!snapshot.exists()) {
          setRestaurantes([]);
          return;
        }

        const dados = snapshot.val();

        const lista: Restaurante[] = Object.keys(dados).map((uid) => ({
          id: uid,
          nomeRestaurante: dados[uid].nomeRestaurante,
        }));

        setRestaurantes(lista);
      } catch (error) {
        console.error("Erro ao carregar restaurantes:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarRestaurantes();
  }, []);

  // =====================================================
  // CARD DE RESTAURANTE
  // =====================================================

  const renderRestaurante = ({ item }: { item: Restaurante }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() =>
        navigation.navigate("Restaurante", { restaurantId: item.id })
      }
    >
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>🍽️</Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.nomeRestaurante}</Text>
        <Text style={styles.cardSubtitle}>Toque para ver o cardápio</Text>
      </View>

      <Text style={styles.cardArrow}>›</Text>
    </Pressable>
  );

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      <View style={styles.header}>
        <Text style={styles.logo}>
          ZAPPY<Text style={styles.logoOrange}>FOOD</Text>
        </Text>

        <Text style={styles.title}>Escolha um restaurante</Text>
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator color="#F58427" size="large" />
        </View>
      )}

      {!loading && restaurantes.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            Nenhum restaurante disponível no momento.
          </Text>
        </View>
      )}

      {!loading && restaurantes.length > 0 && (
        <FlatList
          data={restaurantes}
          keyExtractor={(item) => item.id}
          renderItem={renderRestaurante}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080808" },

  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },

  logo: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#FFFFFF",
    marginBottom: 20,
  },

  logoOrange: { color: "#F58427" },

  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },

  list: { paddingHorizontal: 24, paddingBottom: 24, gap: 12 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 78,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
  },

  cardPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },

  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  cardIconText: { fontSize: 20 },

  cardInfo: { flex: 1 },

  cardName: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },

  cardSubtitle: { color: "#858585", fontSize: 12, marginTop: 4 },

  cardArrow: { color: "#555555", fontSize: 24, fontWeight: "300" },

  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  emptyText: {
    color: "#555555",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
