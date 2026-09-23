import React, { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface Prato {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  preco: string;
  tempoPreparo: string;
  disponivel: boolean;
}

// =====================================================
// MÁSCARAS
// =====================================================

function aplicarMascaraPreco(texto: string): string {
  const digitos = texto.replace(/\D/g, "");
  if (!digitos) return "";

  const semZerosEsquerda = digitos.replace(/^0+(?=\d)/, "");
  const valor = semZerosEsquerda.padStart(3, "0");

  const centavos = valor.slice(-2);
  let reais = valor.slice(0, -2);
  reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `R$ ${reais},${centavos}`;
}

function aplicarMascaraHora(texto: string): string {
  const digitos = texto.replace(/\D/g, "").slice(0, 4);

  if (digitos.length <= 2) return digitos;
  return `${digitos.slice(0, 2)}:${digitos.slice(2)}`;
}

// =====================================================
// TELA
// =====================================================

export default function CardapioScreen() {
  const [pratos, setPratos] = useState<Prato[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [tempoPreparo, setTempoPreparo] = useState("");
  const [disponivel, setDisponivel] = useState<boolean | null>(null);

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  const limparFormulario = () => {
    setNome("");
    setCategoria("");
    setDescricao("");
    setPreco("");
    setTempoPreparo("");
    setDisponivel(null);
    setEditandoId(null);
    setErro("");
  };

  const abrirNovoPrato = () => {
    limparFormulario();
    setModalVisible(true);
  };

  const abrirPratoExistente = (prato: Prato) => {
    setEditandoId(prato.id);
    setNome(prato.nome);
    setCategoria(prato.categoria);
    setDescricao(prato.descricao);
    setPreco(prato.preco);
    setTempoPreparo(prato.tempoPreparo);
    setDisponivel(prato.disponivel);
    setErro("");
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    limparFormulario();
  };

  const horaValida = /^\d{2}:\d{2}$/.test(tempoPreparo);

  const salvarPrato = () => {
    if (
      !nome.trim() ||
      !categoria.trim() ||
      !descricao.trim() ||
      !preco.trim() ||
      !horaValida ||
      disponivel === null
    ) {
      setErro("Preencha todos os campos antes de salvar.");
      return;
    }

    setErro("");

    if (editandoId) {
      setPratos((atual) =>
        atual.map((p) =>
          p.id === editandoId
            ? {
                ...p,
                nome,
                categoria,
                descricao,
                preco,
                tempoPreparo,
                disponivel,
              }
            : p,
        ),
      );
    } else {
      setPratos((atual) => [
        ...atual,
        {
          id: Date.now().toString(),
          nome,
          categoria,
          descricao,
          preco,
          tempoPreparo,
          disponivel,
        },
      ]);
    }

    fecharModal();
  };

  const excluirPrato = () => {
    if (!editandoId) return;
    setPratos((atual) => atual.filter((p) => p.id !== editandoId));
    fecharModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      <View style={styles.header}>
        <Text style={styles.logo}>
          ZAPPY<Text style={styles.logoOrange}>FOOD</Text>
        </Text>
        <Text style={styles.title}>Cardápio</Text>
      </View>

      <View style={styles.content}>
        <Pressable style={styles.addButton} onPress={abrirNovoPrato}>
          <Text style={styles.addButtonText}>+ ADICIONAR PRATO</Text>
        </Pressable>

        <FlatList
          data={pratos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum prato cadastrado ainda.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.pratoCard,
                pressed && styles.pratoCardPressed,
              ]}
              onPress={() => abrirPratoExistente(item)}
            >
              <View style={styles.pratoInfo}>
                <View style={styles.pratoNomeRow}>
                  <Text style={styles.pratoNome}>{item.nome}</Text>

                  <View
                    style={[
                      styles.statusBadge,
                      item.disponivel
                        ? styles.statusBadgeDisponivel
                        : styles.statusBadgeIndisponivel,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>
                      {item.disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.pratoCategoria}>{item.categoria}</Text>
              </View>

              <Text style={styles.pratoPreco}>{item.preco}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* =====================================================
      MODAL: NOVO / EDITAR PRATO
      ===================================================== */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.formTitle}>
              {editandoId ? "Editar prato" : "Novo prato"}
            </Text>

            <FlatList
              data={[{ key: "form" }]}
              renderItem={() => (
                <View>
                  <Text style={styles.label}>Nome *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Risoto de Camarão"
                    placeholderTextColor="#666666"
                    value={nome}
                    onChangeText={setNome}
                  />

                  <Text style={styles.label}>Categoria *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Prato Principal"
                    placeholderTextColor="#666666"
                    value={categoria}
                    onChangeText={setCategoria}
                  />

                  <Text style={styles.label}>Descrição *</Text>
                  <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    placeholder="Ingredientes e detalhes do prato"
                    placeholderTextColor="#666666"
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    numberOfLines={3}
                  />

                  <Text style={styles.label}>Preço *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="R$ 0,00"
                    placeholderTextColor="#666666"
                    keyboardType="number-pad"
                    value={preco}
                    onChangeText={(texto) =>
                      setPreco(aplicarMascaraPreco(texto))
                    }
                  />

                  <Text style={styles.label}>Tempo de preparo *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="00:00"
                    placeholderTextColor="#666666"
                    keyboardType="number-pad"
                    value={tempoPreparo}
                    onChangeText={(texto) =>
                      setTempoPreparo(aplicarMascaraHora(texto))
                    }
                    maxLength={5}
                  />

                  <Text style={styles.label}>Disponibilidade *</Text>
                  <View style={styles.toggleRow}>
                    <Pressable
                      style={[
                        styles.toggleOption,
                        disponivel === true &&
                          styles.toggleOptionAtivaDisponivel,
                      ]}
                      onPress={() => setDisponivel(true)}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          disponivel === true && styles.toggleTextAtiva,
                        ]}
                      >
                        DISPONÍVEL
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.toggleOption,
                        disponivel === false &&
                          styles.toggleOptionAtivaIndisponivel,
                      ]}
                      onPress={() => setDisponivel(false)}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          disponivel === false && styles.toggleTextAtiva,
                        ]}
                      >
                        INDISPONÍVEL
                      </Text>
                    </Pressable>
                  </View>

                  {!!erro && <Text style={styles.erroText}>{erro}</Text>}
                </View>
              )}
            />

            <View style={styles.modalButtonsColumn}>
              <Pressable style={styles.saveButton} onPress={salvarPrato}>
                <Text style={styles.saveButtonText}>
                  {editandoId ? "SALVAR ALTERAÇÕES" : "ADICIONAR PRATO"}
                </Text>
              </Pressable>

              <View style={styles.formButtons}>
                {editandoId && (
                  <Pressable style={styles.deleteButton} onPress={excluirPrato}>
                    <Text style={styles.deleteButtonText}>EXCLUIR</Text>
                  </Pressable>
                )}

                <Pressable style={styles.cancelButton} onPress={fecharModal}>
                  <Text style={styles.cancelButtonText}>CANCELAR</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080808" },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
  logo: { fontSize: 18, fontWeight: "900", letterSpacing: 2, color: "#FFFFFF" },
  logoOrange: { color: "#F58427" },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginTop: 6 },

  content: { flex: 1, paddingHorizontal: 24, paddingTop: 18 },

  addButton: {
    height: 48,
    borderRadius: 11,
    backgroundColor: "#F58427",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },

  listContent: { paddingBottom: 40 },
  emptyText: {
    color: "#555555",
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
  },

  pratoCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
    marginBottom: 12,
  },
  pratoCardPressed: { opacity: 0.8 },
  pratoInfo: { flex: 1, marginRight: 10 },
  pratoNomeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  pratoNome: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    flexShrink: 1,
  },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusBadgeDisponivel: {
    backgroundColor: "#101A14",
    borderWidth: 1,
    borderColor: "#2E8B57",
  },
  statusBadgeIndisponivel: {
    backgroundColor: "#1A1111",
    borderWidth: 1,
    borderColor: "#B83A3A",
  },
  statusBadgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "800" },
  pratoCategoria: {
    color: "#F58427",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
  },
  pratoPreco: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },

  // MODAL
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
    maxHeight: "85%",
    backgroundColor: "#181818",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 22,
  },
  formTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
    textAlign: "center",
  },
  label: {
    color: "#858585",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 2,
  },
  input: {
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#242424",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 13,
    marginBottom: 12,
  },
  inputMultiline: { minHeight: 70, textAlignVertical: "top" },
  toggleRow: { flexDirection: "row", gap: 10, marginBottom: 6 },
  toggleOption: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#242424",
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleOptionAtivaDisponivel: {
    backgroundColor: "#101A14",
    borderColor: "#2E8B57",
  },
  toggleOptionAtivaIndisponivel: {
    backgroundColor: "#1A1111",
    borderColor: "#B83A3A",
  },
  toggleText: { color: "#666666", fontSize: 11, fontWeight: "800" },
  toggleTextAtiva: { color: "#FFFFFF" },
  erroText: {
    color: "#E05252",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 10,
  },

  modalButtonsColumn: { marginTop: 16, gap: 10 },
  saveButton: {
    height: 48,
    borderRadius: 11,
    backgroundColor: "#F58427",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  formButtons: { flexDirection: "row", gap: 10 },
  deleteButton: {
    flex: 1,
    height: 46,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#B83A3A",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: { color: "#B83A3A", fontSize: 12, fontWeight: "800" },
  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: { color: "#999999", fontSize: 12, fontWeight: "800" },
});
