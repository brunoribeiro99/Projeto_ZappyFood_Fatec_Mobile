import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// =====================================================
// CATEGORIAS DE COMIDA (POR PAÍS)
// =====================================================

interface Categoria {
  id: string;
  nome: string;
  flagCode: string; // código ISO do país (flagcdn.com)
}

const CATEGORIAS: Categoria[] = [
  { id: "japonesa", nome: "Japonesa", flagCode: "jp" },
  { id: "brasileira", nome: "Brasileira", flagCode: "br" },
  { id: "italiana", nome: "Italiana", flagCode: "it" },
  { id: "americana", nome: "Americana", flagCode: "us" },
  { id: "mexicana", nome: "Mexicana", flagCode: "mx" },
  { id: "coreana", nome: "Coreana", flagCode: "kr" },
  { id: "chinesa", nome: "Chinesa", flagCode: "cn" },
  { id: "francesa", nome: "Francesa", flagCode: "fr" },
];

// =====================================================
// RESTAURANTES FICTÍCIOS (SÓ PRA TESTE)
// =====================================================

const RESTAURANTES_FICTICIOS: Record<string, string[]> = {
  japonesa: ["Sakura Sushi", "Osaka House", "Koi Ramen Bar"],
  brasileira: ["Boteco do Zé", "Sabor Caseiro", "Fogo de Chão Express"],
  italiana: ["Bella Napoli", "Trattoria Romano", "Pasta & Cia"],
  americana: ["Smokey Burger", "Route 66 Diner", "Big Apple Grill"],
  mexicana: ["El Sombrero", "Taco Loco", "Casa Azteca"],
  coreana: ["Seoul Garden", "K-Bap House", "Gangnam Grill"],
  chinesa: ["Dragão Dourado", "Panda Wok", "Muralha Chinesa"],
  francesa: ["Le Petit Bistrô", "Château Gourmet", "Café Paris"],
};

// =====================================================
// ÚLTIMOS VISITADOS (SÓ PRA TESTE)
// =====================================================

const ULTIMOS_VISITADOS = ["Sakura Sushi", "Boteco do Zé", "Taco Loco"];

export default function ClientHome({ navigation }: any) {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<Categoria | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  // =====================================================
  // ABRIR MENU DA CATEGORIA
  // =====================================================

  const abrirCategoria = (categoria: Categoria) => {
    setCategoriaSelecionada(categoria);
    setModalVisible(true);
  };

  const restaurantesDaCategoria = categoriaSelecionada
    ? RESTAURANTES_FICTICIOS[categoriaSelecionada.id] ?? []
    : [];

  // =====================================================
  // CARD DE CATEGORIA (BANDEIRA)
  // =====================================================

  const renderCategoria = ({ item }: { item: Categoria }) => (
    <Pressable
      style={({ pressed }) => [
        styles.categoriaItem,
        pressed && styles.categoriaItemPressed,
      ]}
      onPress={() => abrirCategoria(item)}
    >
      <View style={styles.flagCircle}>
        <Image
          source={{ uri: `https://flagcdn.com/w160/${item.flagCode}.png` }}
          style={styles.flagImage}
        />
      </View>

      <Text style={styles.categoriaNome}>{item.nome}</Text>
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

        <Text style={styles.title}>Fome de quê hoje?</Text>
      </View>

      {/* =================================================
      CARROSSEL DE CATEGORIAS
      ================================================= */}

      <FlatList
        data={CATEGORIAS}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoria}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriasList}
        style={styles.categoriasWrapper}
      />

      {/* =================================================
      ÚLTIMOS VISITADOS
      ================================================= */}

      <View style={styles.ultimosCard}>
        <Text style={styles.ultimosTitle}>Últimos visitados</Text>

        <View style={styles.ultimosList}>
          {ULTIMOS_VISITADOS.map((nome) => (
            <Pressable
              key={nome}
              style={({ pressed }) => [
                styles.ultimoItem,
                pressed && styles.ultimoItemPressed,
              ]}
            >
              <View style={styles.ultimoIcon}>
                <Text style={styles.ultimoIconText}>🍽️</Text>
              </View>

              <Text style={styles.ultimoNome} numberOfLines={1}>
                {nome}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* =====================================================
      MODAL: RESTAURANTES DA CATEGORIA
      ===================================================== */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              {categoriaSelecionada && (
                <Image
                  source={{
                    uri: `https://flagcdn.com/w160/${categoriaSelecionada.flagCode}.png`,
                  }}
                  style={styles.modalFlag}
                />
              )}

              <Text style={styles.modalTitle}>
                {categoriaSelecionada?.nome}
              </Text>
            </View>

            <FlatList
              data={restaurantesDaCategoria}
              keyExtractor={(item) => item}
              style={styles.modalList}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.restauranteCard,
                    pressed && styles.restauranteCardPressed,
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <View style={styles.restauranteIcon}>
                    <Text style={styles.restauranteIconText}>🍽️</Text>
                  </View>

                  <View style={styles.restauranteInfo}>
                    <Text style={styles.restauranteNome}>{item}</Text>
                    <Text style={styles.restauranteSubtitle}>
                      Toque para ver o cardápio
                    </Text>
                  </View>

                  <Text style={styles.restauranteArrow}>›</Text>
                </Pressable>
              )}
            />

            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>FECHAR</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080808" },

  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 16 },

  logo: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#FFFFFF",
    marginBottom: 20,
  },

  logoOrange: { color: "#F58427" },

  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },

  // ===================================================
  // CATEGORIAS
  // ===================================================

  categoriasWrapper: { flexGrow: 0, marginBottom: 22 },

  categoriasList: { paddingHorizontal: 24, gap: 16 },

  categoriaItem: { alignItems: "center", width: 64 },

  categoriaItemPressed: { opacity: 0.75 },

  flagCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },

  flagImage: { width: "100%", height: "100%" },

  categoriaNome: {
    marginTop: 7,
    fontSize: 10,
    fontWeight: "700",
    color: "#858585",
    textAlign: "center",
  },

  // ===================================================
  // ÚLTIMOS VISITADOS
  // ===================================================

  ultimosCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
  },

  ultimosTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 14,
  },

  ultimosList: { flexDirection: "row", gap: 14 },

  ultimoItem: { alignItems: "center", width: 68 },

  ultimoItemPressed: { opacity: 0.75 },

  ultimoIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  ultimoIconText: { fontSize: 20 },

  ultimoNome: {
    color: "#A7A7A7",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },

  // ===================================================
  // MODAL
  // ===================================================

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    width: "100%",
    maxWidth: 380,
    maxHeight: "75%",
    backgroundColor: "#181818",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 22,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  modalFlag: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  modalTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },

  modalList: { marginBottom: 10 },

  restauranteCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 68,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
    marginBottom: 10,
  },

  restauranteCardPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },

  restauranteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  restauranteIconText: { fontSize: 17 },

  restauranteInfo: { flex: 1 },

  restauranteNome: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },

  restauranteSubtitle: { color: "#858585", fontSize: 11, marginTop: 3 },

  restauranteArrow: { color: "#555555", fontSize: 22, fontWeight: "300" },

  modalCloseButton: {
    height: 48,
    borderRadius: 11,
    backgroundColor: "#F58427",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCloseText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
