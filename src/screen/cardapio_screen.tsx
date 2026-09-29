import React, { useEffect, useState } from "react";

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

import { PratoModel } from "./models/PratoModel";
import { PratoService } from "./services/pratoService";

export default function CardapioScreen() {
  // =====================================================
  // LISTA DE PRATOS
  // =====================================================

  const [pratos, setPratos] = useState<PratoModel[]>([]);

  // =====================================================
  // CONTROLE DO MODAL
  // =====================================================

  const [modalVisible, setModalVisible] = useState(false);

  // =====================================================
  // CAMPOS DO FORMULÁRIO
  // =====================================================

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [tempoPreparo, setTempoPreparo] = useState("");
  const [disponivel, setDisponivel] = useState<boolean | null>(null);

  // =====================================================
  // CONTROLE DE EDIÇÃO
  // =====================================================

  const [editandoId, setEditandoId] = useState<string | null>(null);

  // =====================================================
  // ERRO
  // =====================================================

  const [erro, setErro] = useState("");

  // =====================================================
  // CARREGAR PRATOS DO FIREBASE
  // =====================================================

  useEffect(() => {
    carregarPratos();
  }, []);

  const carregarPratos = async () => {
    try {
      const lista = await PratoService.listarTodas();

      setPratos(lista);
    } catch (error) {
      console.error("Erro ao carregar pratos:", error);

      setErro(
        error instanceof Error ? error.message : "Erro ao carregar os pratos.",
      );
    }
  };

  // =====================================================
  // LIMPAR FORMULÁRIO
  // =====================================================

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

  // =====================================================
  // ABRIR POPUP PARA NOVO PRATO
  // =====================================================

  const abrirNovoPrato = () => {
    limparFormulario();

    setModalVisible(true);
  };

  // =====================================================
  // ABRIR POPUP PARA EDITAR PRATO
  // =====================================================

  const abrirPratoExistente = (prato: PratoModel) => {
    setNome(prato.nome);
    setCategoria(prato.categoria);
    setDescricao(prato.descricao);
    setPreco(prato.preco);
    setTempoPreparo(prato.tempoPreparo);
    setDisponivel(prato.disponivel);

    setEditandoId(prato.id ?? null);

    setErro("");

    setModalVisible(true);
  };

  // =====================================================
  // FECHAR POPUP
  // =====================================================

  const fecharModal = () => {
    setModalVisible(false);

    limparFormulario();
  };

  // =====================================================
  // SALVAR / ALTERAR PRATO
  // =====================================================

  const salvarPrato = async () => {
    setErro("");

    // ---------------------------------------------
    // MONTA O OBJETO DO PRATO
    // ---------------------------------------------

    const dados: PratoModel = {
      id: editandoId ?? undefined,

      nome: nome.trim(),

      categoria: categoria.trim(),

      descricao: descricao.trim(),

      preco: preco.trim(),

      tempoPreparo: tempoPreparo.trim(),

      disponivel: disponivel ?? false,
    };

    // ---------------------------------------------
    // VALIDAÇÃO
    // ---------------------------------------------

    const validacao = PratoService.validarCampos(dados);

    if (!validacao.valido) {
      const primeiroErro = Object.values(validacao.erros)[0];

      setErro(primeiroErro ?? "Preencha todos os campos.");

      return;
    }

    // ---------------------------------------------
    // VALIDAÇÃO DO HORÁRIO
    // ---------------------------------------------

    const horaValida = /^\d{2}:\d{2}$/.test(tempoPreparo);

    if (!horaValida) {
      setErro("Informe o tempo de preparo no formato 00:30.");

      return;
    }

    try {
      // =========================================
      // EDITANDO
      // =========================================

      if (editandoId) {
        await PratoService.atualizar(editandoId, dados);
      }

      // =========================================
      // NOVO PRATO
      // =========================================
      else {
        await PratoService.criar(dados);
      }

      // -----------------------------------------
      // ATUALIZA A LISTA COM O FIREBASE
      // -----------------------------------------

      await carregarPratos();

      // -----------------------------------------
      // FECHA POPUP
      // -----------------------------------------

      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar prato:", error);

      setErro(
        error instanceof Error ? error.message : "Erro ao salvar o prato.",
      );
    }
  };

  // =====================================================
  // EXCLUIR PRATO
  // =====================================================

  const excluirPrato = async () => {
    if (!editandoId) {
      return;
    }

    try {
      await PratoService.eliminar(editandoId);

      // -----------------------------------------
      // ATUALIZA LISTA
      // -----------------------------------------

      await carregarPratos();

      // -----------------------------------------
      // FECHA POPUP
      // -----------------------------------------

      fecharModal();
    } catch (error) {
      console.error("Erro ao excluir prato:", error);

      setErro(
        error instanceof Error ? error.message : "Erro ao excluir o prato.",
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      {/* =========================================
                LISTA DE PRATOS
            ========================================= */}

      <FlatList
        data={pratos}
        keyExtractor={(item) => item.id ?? Math.random().toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => abrirPratoExistente(item)}
          >
            <View style={styles.cardCabecalho}>
              <Text style={styles.nomePrato}>{item.nome}</Text>

              <Text style={styles.preco}>{item.preco}</Text>
            </View>

            <Text style={styles.categoria}>{item.categoria}</Text>

            <Text style={styles.descricao}>{item.descricao}</Text>

            <Text style={styles.tempo}>Preparo: {item.tempoPreparo}</Text>

            <Text
              style={[
                styles.status,
                {
                  color: item.disponivel ? "#27F5B4" : "#FF4444",
                },
              ]}
            >
              {item.disponivel ? "Disponível" : "Indisponível"}
            </Text>
          </Pressable>
        )}
      />

      {/* =========================================
                BOTÃO NOVO PRATO
            ========================================= */}

      <Pressable style={styles.botaoAdicionar} onPress={abrirNovoPrato}>
        <Text style={styles.textoBotaoAdicionar}>+ Adicionar prato</Text>
      </Pressable>

      {/* =========================================
                MODAL
            ========================================= */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={fecharModal}
      >
        <KeyboardAvoidingView
          style={styles.modalFundo}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.tituloModal}>
              {editandoId ? "Editar prato" : "Novo prato"}
            </Text>

            {/* =========================
                            NOME
                        ========================= */}

            <TextInput
              style={styles.input}
              placeholder="Nome do prato"
              placeholderTextColor="#777"
              value={nome}
              onChangeText={setNome}
            />

            {/* =========================
                            CATEGORIA
                        ========================= */}

            <TextInput
              style={styles.input}
              placeholder="Categoria"
              placeholderTextColor="#777"
              value={categoria}
              onChangeText={setCategoria}
            />

            {/* =========================
                            DESCRIÇÃO
                        ========================= */}

            <TextInput
              style={[styles.input, styles.inputDescricao]}
              placeholder="Descrição"
              placeholderTextColor="#777"
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />

            {/* =========================
                            PREÇO
                        ========================= */}

            <TextInput
              style={styles.input}
              placeholder="Preço"
              placeholderTextColor="#777"
              value={preco}
              onChangeText={(texto) =>
                setPreco(PratoService.aplicarMascaraPreco(texto))
              }
              keyboardType="numeric"
            />

            {/* =========================
                            TEMPO
                        ========================= */}

            <TextInput
              style={styles.input}
              placeholder="Tempo de preparo (00:30)"
              placeholderTextColor="#777"
              value={tempoPreparo}
              onChangeText={(texto) =>
                setTempoPreparo(PratoService.aplicarMascaraHora(texto))
              }
              keyboardType="numeric"
              maxLength={5}
            />

            {/* =========================
                            DISPONIBILIDADE
                        ========================= */}

            <View style={styles.disponibilidadeContainer}>
              <Text style={styles.label}>Disponibilidade</Text>

              <View style={styles.opcoesDisponibilidade}>
                <Pressable
                  style={[
                    styles.botaoDisponibilidade,
                    disponivel === true &&
                      styles.botaoDisponibilidadeSelecionado,
                  ]}
                  onPress={() => setDisponivel(true)}
                >
                  <Text style={styles.textoDisponibilidade}>Disponível</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.botaoDisponibilidade,
                    disponivel === false && styles.botaoIndisponivelSelecionado,
                  ]}
                  onPress={() => setDisponivel(false)}
                >
                  <Text style={styles.textoDisponibilidade}>Indisponível</Text>
                </Pressable>
              </View>
            </View>

            {/* =========================
                            ERRO
                        ========================= */}

            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

            {/* =========================
                            BOTÕES
                        ========================= */}

            <View style={styles.botoes}>
              <Pressable style={styles.botaoCancelar} onPress={fecharModal}>
                <Text style={styles.textoBotao}>Cancelar</Text>
              </Pressable>

              {editandoId && (
                <Pressable style={styles.botaoExcluir} onPress={excluirPrato}>
                  <Text style={styles.textoBotao}>Excluir</Text>
                </Pressable>
              )}

              <Pressable style={styles.botaoSalvar} onPress={salvarPrato}>
                <Text style={styles.textoBotao}>
                  {editandoId ? "Alterar" : "Salvar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },

  lista: {
    padding: 16,
    paddingBottom: 100,
  },

  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  cardCabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nomePrato: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },

  preco: {
    color: "#F58427",
    fontSize: 16,
    fontWeight: "bold",
  },

  categoria: {
    color: "#F58427",
    marginTop: 6,
  },

  descricao: {
    color: "#bbb",
    marginTop: 8,
  },

  tempo: {
    color: "#888",
    marginTop: 8,
  },

  status: {
    marginTop: 8,
    fontWeight: "bold",
  },

  botaoAdicionar: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#F58427",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  textoBotaoAdicionar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#111",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  tituloModal: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
  },

  input: {
    backgroundColor: "#080808",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 13,
    color: "#fff",
    marginBottom: 12,
  },

  inputDescricao: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  disponibilidadeContainer: {
    marginBottom: 12,
  },

  label: {
    color: "#fff",
    marginBottom: 8,
  },

  opcoesDisponibilidade: {
    flexDirection: "row",
    gap: 10,
  },

  botaoDisponibilidade: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },

  botaoDisponibilidadeSelecionado: {
    backgroundColor: "#145c46",
    borderColor: "#27F5B4",
  },

  botaoIndisponivelSelecionado: {
    backgroundColor: "#641f1f",
    borderColor: "#FF4444",
  },

  textoDisponibilidade: {
    color: "#fff",
  },

  erro: {
    color: "#FF4444",
    marginBottom: 12,
    textAlign: "center",
  },

  botoes: {
    flexDirection: "row",
    gap: 8,
  },

  botaoCancelar: {
    flex: 1,
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  botaoExcluir: {
    flex: 1,
    backgroundColor: "#8B1E1E",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  botaoSalvar: {
    flex: 1,
    backgroundColor: "#F58427",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
});
