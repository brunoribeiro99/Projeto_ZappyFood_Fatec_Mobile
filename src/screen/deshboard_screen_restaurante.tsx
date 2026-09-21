import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

type StatusRestaurante = "aberto" | "fechado" | null;

// =====================================================
// MESAS (SÓ PRA TESTE)
// =====================================================

const TOTAL_MESAS = 12;

// =====================================================
// PRATOS DO CARDÁPIO (SÓ PRA TESTE)
// =====================================================

interface Prato {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
}

const PRATOS: Prato[] = [
  {
    id: "1",
    nome: "Risoto de Camarão",
    descricao: "Arroz arbóreo, camarões e toque de limão siciliano",
    preco: "R$ 58,90",
  },
  {
    id: "2",
    nome: "Filé ao Molho Madeira",
    descricao: "Filé mignon grelhado com molho madeira e batatas rústicas",
    preco: "R$ 64,90",
  },
  {
    id: "3",
    nome: "Salada Caesar",
    descricao: "Alface romana, croutons, parmesão e molho caesar",
    preco: "R$ 32,00",
  },
  {
    id: "4",
    nome: "Massa ao Pesto",
    descricao: "Talharine, manjericão fresco, pinoli e parmesão",
    preco: "R$ 45,00",
  },
  {
    id: "5",
    nome: "Petit Gâteau",
    descricao: "Bolo quente de chocolate com sorvete de creme",
    preco: "R$ 24,00",
  },
];

export default function RestaurantHome() {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [status, setStatus] = useState<StatusRestaurante>(null);

  const [mesas, setMesas] = useState<boolean[]>(Array(TOTAL_MESAS).fill(false));

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [mesasModalVisible, setMesasModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);

  // =====================================================
  // DEFINIR STATUS
  // =====================================================

  const selecionarStatus = (novoStatus: StatusRestaurante) => {
    setStatus(novoStatus);
    setStatusModalVisible(false);
  };

  // =====================================================
  // ALTERNAR MESA (RESERVADA / LIVRE)
  // =====================================================

  const alternarMesa = (index: number) => {
    setMesas((atual) =>
      atual.map((reservada, i) => (i === index ? !reservada : reservada)),
    );
  };

  const isAberto = status === "aberto";
  const isFechado = status === "fechado";

  const mesasReservadas = mesas.filter(Boolean).length;

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      {/* =================================================
      HEADER
      ================================================= */}

      <View style={styles.header}>
        <Text style={styles.logo}>
          ZAPPY<Text style={styles.logoOrange}>FOOD</Text>
        </Text>

        <Text style={styles.title}>Painel do restaurante</Text>
      </View>

      {/* =================================================
      BOTÕES PRINCIPAIS
      ================================================= */}

      <View style={styles.options}>
        {/* BOTÃO: STATUS */}

        <Pressable
          style={({ pressed }) => [
            styles.bigButton,
            pressed && styles.bigButtonPressed,
          ]}
          onPress={() => setStatusModalVisible(true)}
        >
          <View
            style={[
              styles.bigButtonIcon,
              isAberto && styles.iconOpen,
              isFechado && styles.iconClosed,
            ]}
          >
            <Text style={styles.bigButtonEmoji}>
              {isAberto ? "🟢" : isFechado ? "🔴" : "🕒"}
            </Text>
          </View>

          <Text style={styles.bigButtonTitle}>STATUS DO RESTAURANTE</Text>

          <Text style={styles.bigButtonSubtitle}>
            {isAberto
              ? "Aberto — recebendo pedidos"
              : isFechado
                ? "Fechado — não recebendo pedidos"
                : "Toque para definir"}
          </Text>
        </Pressable>

        {/* BOTÃO: MESAS */}

        <Pressable
          style={({ pressed }) => [
            styles.bigButton,
            pressed && styles.bigButtonPressed,
          ]}
          onPress={() => setMesasModalVisible(true)}
        >
          <View style={styles.bigButtonIcon}>
            <Text style={styles.bigButtonEmoji}>🪑</Text>
          </View>

          <Text style={styles.bigButtonTitle}>MESAS</Text>

          <Text style={styles.bigButtonSubtitle}>
            {mesasReservadas === 0
              ? `Nenhuma mesa reservada de ${TOTAL_MESAS}`
              : `${mesasReservadas} de ${TOTAL_MESAS} mesas reservadas`}
          </Text>
        </Pressable>

        {/* BOTÃO: MENU */}

        <Pressable
          style={({ pressed }) => [
            styles.bigButton,
            pressed && styles.bigButtonPressed,
          ]}
          onPress={() => setMenuModalVisible(true)}
        >
          <View style={styles.bigButtonIcon}>
            <Text style={styles.bigButtonEmoji}>📖</Text>
          </View>

          <Text style={styles.bigButtonTitle}>MENU</Text>

          <Text style={styles.bigButtonSubtitle}>
            {PRATOS.length} pratos no cardápio
          </Text>
        </Pressable>
      </View>

      {/* =====================================================
      MODAL: STATUS
      ===================================================== */}

      <Modal
        visible={statusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Definir status</Text>

            <Text style={styles.modalMessage}>
              Escolha se o restaurante está aberto ou fechado para novos
              pedidos.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.modalOption,
                styles.modalOptionOpen,
                pressed && styles.modalOptionPressed,
              ]}
              onPress={() => selecionarStatus("aberto")}
            >
              <Text style={styles.modalOptionEmoji}>🟢</Text>
              <Text style={styles.modalOptionText}>RESTAURANTE ABERTO</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modalOption,
                styles.modalOptionClosed,
                pressed && styles.modalOptionPressed,
              ]}
              onPress={() => selecionarStatus("fechado")}
            >
              <Text style={styles.modalOptionEmoji}>🔴</Text>
              <Text style={styles.modalOptionText}>RESTAURANTE FECHADO</Text>
            </Pressable>

            <Pressable
              style={styles.modalCancel}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* =====================================================
      MODAL: MESAS
      ===================================================== */}

      <Modal
        visible={mesasModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMesasModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Mesas</Text>

            <Text style={styles.modalMessage}>
              Toque em uma mesa para marcar como reservada ou livre.
            </Text>

            <View style={styles.mesasGrid}>
              {mesas.map((reservada, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.mesaItem,
                    reservada ? styles.mesaReservada : styles.mesaLivre,
                    pressed && styles.mesaItemPressed,
                  ]}
                  onPress={() => alternarMesa(index)}
                >
                  <Text style={styles.mesaNumero}>{index + 1}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.legendaRow}>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaDot, styles.mesaLivre]} />
                <Text style={styles.legendaText}>Livre</Text>
              </View>

              <View style={styles.legendaItem}>
                <View style={[styles.legendaDot, styles.mesaReservada]} />
                <Text style={styles.legendaText}>Reservada</Text>
              </View>
            </View>

            <Pressable
              style={styles.modalButton}
              onPress={() => setMesasModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>CONCLUÍDO</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* =====================================================
      MODAL: MENU
      ===================================================== */}

      <Modal
        visible={menuModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Menu</Text>

            <Text style={styles.modalMessage}>Pratos do cardápio.</Text>

            <FlatList
              data={PRATOS}
              keyExtractor={(item) => item.id}
              style={styles.pratosList}
              renderItem={({ item }) => (
                <View style={styles.pratoCard}>
                  <View style={styles.pratoInfo}>
                    <Text style={styles.pratoNome}>{item.nome}</Text>
                    <Text style={styles.pratoDescricao} numberOfLines={2}>
                      {item.descricao}
                    </Text>
                  </View>

                  <Text style={styles.pratoPreco}>{item.preco}</Text>
                </View>
              )}
            />

            <Pressable
              style={styles.modalButton}
              onPress={() => setMenuModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>FECHAR</Text>
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

  options: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    gap: 14,
  },

  bigButton: {
    minHeight: 120,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
  },

  bigButtonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  bigButtonIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  iconOpen: { backgroundColor: "#101A14" },
  iconClosed: { backgroundColor: "#1A1111" },

  bigButtonEmoji: { fontSize: 21 },

  bigButtonTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },

  bigButtonSubtitle: { color: "#858585", fontSize: 12, marginTop: 5 },

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
    maxHeight: "80%",
    backgroundColor: "#181818",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 26,
    borderWidth: 1,
    borderColor: "#292929",
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },

  modalMessage: {
    color: "#999999",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 20,
  },

  modalOption: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 54,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
  },

  modalOptionOpen: { backgroundColor: "#101A14", borderColor: "#2E8B57" },
  modalOptionClosed: { backgroundColor: "#1A1111", borderColor: "#B83A3A" },

  modalOptionPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },

  modalOptionEmoji: { fontSize: 16 },

  modalOptionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  modalCancel: { marginTop: 4, paddingVertical: 8, alignSelf: "center" },

  modalCancelText: { color: "#777777", fontSize: 13, fontWeight: "600" },

  // ===================================================
  // MESAS
  // ===================================================

  mesasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginBottom: 18,
  },

  mesaItem: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  mesaItemPressed: { opacity: 0.75, transform: [{ scale: 0.95 }] },

  mesaLivre: { backgroundColor: "#101A14", borderColor: "#2E8B57" },
  mesaReservada: { backgroundColor: "#1A1111", borderColor: "#B83A3A" },

  mesaNumero: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },

  legendaRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },

  legendaItem: { flexDirection: "row", alignItems: "center", gap: 6 },

  legendaDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1 },

  legendaText: { color: "#999999", fontSize: 12, fontWeight: "600" },

  // ===================================================
  // MENU / PRATOS
  // ===================================================

  pratosList: { marginBottom: 12 },

  pratoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
    marginBottom: 10,
  },

  pratoInfo: { flex: 1, marginRight: 10 },

  pratoNome: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },

  pratoDescricao: {
    color: "#858585",
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },

  pratoPreco: { color: "#F58427", fontSize: 13, fontWeight: "800" },

  modalButton: {
    width: "100%",
    height: 48,
    borderRadius: 11,
    backgroundColor: "#F58427",
    alignItems: "center",
    justifyContent: "center",
  },

  modalButtonText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
