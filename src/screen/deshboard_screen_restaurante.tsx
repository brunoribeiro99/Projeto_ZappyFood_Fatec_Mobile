import React, { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

type StatusRestaurante = "aberto" | "fechado" | null;

export default function RestaurantHome() {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [status, setStatus] = useState<StatusRestaurante>(null);
  const [mesasReservadas, setMesasReservadas] = useState(0);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [mesasModalVisible, setMesasModalVisible] = useState(false);

  // =====================================================
  // DEFINIR STATUS
  // =====================================================

  const selecionarStatus = (novoStatus: StatusRestaurante) => {
    setStatus(novoStatus);
    setStatusModalVisible(false);
  };

  // =====================================================
  // AJUSTAR MESAS RESERVADAS
  // =====================================================

  const alterarMesas = (delta: number) => {
    setMesasReservadas((atual) => Math.max(0, atual + delta));
  };

  const isAberto = status === "aberto";
  const isFechado = status === "fechado";

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

        {/* BOTÃO: MESAS RESERVADAS */}

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

          <Text style={styles.bigButtonTitle}>MESAS RESERVADAS</Text>

          <Text style={styles.bigButtonSubtitle}>
            {mesasReservadas === 0
              ? "Nenhuma mesa reservada"
              : `${mesasReservadas} ${mesasReservadas === 1 ? "mesa reservada" : "mesas reservadas"}`}
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
      MODAL: MESAS RESERVADAS
      ===================================================== */}

      <Modal
        visible={mesasModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMesasModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Mesas reservadas</Text>

            <Text style={styles.modalMessage}>
              Ajuste o número de mesas reservadas no momento.
            </Text>

            <View style={styles.counterRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.counterButton,
                  pressed && styles.counterButtonPressed,
                ]}
                onPress={() => alterarMesas(-1)}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </Pressable>

              <Text style={styles.counterValue}>{mesasReservadas}</Text>

              <Pressable
                style={({ pressed }) => [
                  styles.counterButton,
                  pressed && styles.counterButtonPressed,
                ]}
                onPress={() => alterarMesas(1)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </Pressable>
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
    gap: 16,
  },

  bigButton: {
    minHeight: 150,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 22,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
  },

  bigButtonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  bigButtonIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  iconOpen: { backgroundColor: "#101A14" },
  iconClosed: { backgroundColor: "#1A1111" },

  bigButtonEmoji: { fontSize: 24 },

  bigButtonTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },

  bigButtonSubtitle: { color: "#858585", fontSize: 13, marginTop: 6 },

  // ===================================================
  // MODAL
  // ===================================================

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#181818",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 26,
    alignItems: "center",
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

  modalCancel: { marginTop: 4, paddingVertical: 8 },

  modalCancelText: { color: "#777777", fontSize: 13, fontWeight: "600" },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginBottom: 22,
  },

  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },

  counterButtonPressed: { opacity: 0.75, transform: [{ scale: 0.95 }] },

  counterButtonText: { color: "#F58427", fontSize: 22, fontWeight: "900" },

  counterValue: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    minWidth: 40,
    textAlign: "center",
  },

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
