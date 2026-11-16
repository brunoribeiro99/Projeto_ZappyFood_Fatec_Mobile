import React, { useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
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

import { useCardapio } from "../hooks/Cardapio";
import { Cardapio } from "../models/Cardapio";
import { auth } from "../services/firebaseConfig";

const CATEGORIAS = [
  "Entrada",
  "Prato principal",
  "Acompanhamento",
  "Sobremesa",
  "Bebida",
];

export default function ListarCardapioScreen() {
  const {
    pratos,
    loading,
    error,
    adicionarPrato,
    atualizarPrato,
    excluirPrato,
  } = useCardapio();

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmacao, setConfirmacao] = useState<"excluir" | "alterar" | null>(
    null,
  );

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [tempoPreparo, setTempoPreparo] = useState("");
  const [imagem, setImagem] = useState("");
  const [disponivel, setDisponivel] = useState<boolean | null>(null);

  const [categoriaAberta, setCategoriaAberta] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const limparFormulario = () => {
    setNome("");
    setCategoria("");
    setDescricao("");
    setPreco("");
    setTempoPreparo("");
    setImagem("");
    setDisponivel(null);
    setCategoriaAberta(false);
    setEditandoId(null);
    setErro("");
  };

  const abrirNovoPrato = () => {
    limparFormulario();
    setModalVisible(true);
  };

  const abrirPratoExistente = (prato: Cardapio) => {
    setNome(prato.nome);
    setCategoria(prato.categoria);
    setDescricao(prato.descricao);
    setPreco(prato.preco);
    setTempoPreparo(prato.tempoPreparo);
    setImagem(prato.imagem);
    setDisponivel(prato.disponivel);
    setEditandoId(prato.id ?? null);
    setErro("");
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setConfirmacao(null);
    limparFormulario();
  };

  const aplicarMascaraPreco = (texto: string) => {
    const numeros = texto.replace(/\D/g, "");

    if (!numeros) return "";

    const valor = Number(numeros) / 100;

    return valor.toFixed(2).replace(".", ",");
  };

  const aplicarMascaraHora = (texto: string) => {
    const numeros = texto.replace(/\D/g, "").slice(0, 4);

    if (numeros.length <= 2) return numeros;

    return numeros.slice(0, 2) + ":" + numeros.slice(2);
  };

  const salvarPrato = async () => {
    setErro("");

    const restauranteId = auth.currentUser?.uid;

    if (!restauranteId) {
      setErro("Restaurante não identificado. Faça login novamente.");
      return;
    }

    if (
      !nome.trim() ||
      !categoria ||
      !descricao.trim() ||
      !preco.trim() ||
      !tempoPreparo.trim() ||
      !imagem.trim() ||
      disponivel === null
    ) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (!/^https?:\/\/.+/i.test(imagem.trim())) {
      setErro("Informe uma URL válida para a imagem.");
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(tempoPreparo)) {
      setErro("Informe o tempo no formato 00:30.");
      return;
    }

    const partesHora = tempoPreparo.split(":");

    if (Number(partesHora[0]) > 23 || Number(partesHora[1]) > 59) {
      setErro("Informe um tempo de preparo válido.");
      return;
    }

    const dados: Cardapio = {
      id: editandoId ?? undefined,
      restauranteId,
      nome: nome.trim(),
      categoria,
      descricao: descricao.trim(),
      preco: preco.trim(),
      tempoPreparo: tempoPreparo.trim(),
      disponivel,
      imagem: imagem.trim(),
      createdAt: editandoId
        ? (pratos.find((item) => item.id === editandoId)?.createdAt ??
          new Date().toISOString())
        : new Date().toISOString(),
    };

    try {
      setSalvando(true);

      if (editandoId) {
        await atualizarPrato(dados);
      } else {
        await adicionarPrato(dados);
      }

      fecharModal();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao salvar o prato.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const excluirPratoAtual = async () => {
    if (!editandoId) return;

    try {
      setSalvando(true);
      await excluirPrato(editandoId);
      fecharModal();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao excluir o prato.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const confirmarAcao = async () => {
    const acao = confirmacao;
    setConfirmacao(null);

    if (acao === "excluir") {
      await excluirPratoAtual();
    } else if (acao === "alterar") {
      await salvarPrato();
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F58427" />
        <Text style={styles.textoCarregando}>Carregando cardápio...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.erro}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      <FlatList
        data={pratos}
        keyExtractor={(item) => item.id ?? item.nome}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.listaVazia}>Nenhum prato cadastrado ainda.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => abrirPratoExistente(item)}
          >
            {item.imagem ? (
              <Image source={{ uri: item.imagem }} style={styles.imagemCard} />
            ) : null}

            <View style={styles.cardInfo}>
              <View style={styles.cardCabecalho}>
                <Text style={styles.nomePrato}>{item.nome}</Text>
                <Text style={styles.preco}>R$ {item.preco}</Text>
              </View>

              <Text style={styles.categoria}>{item.categoria}</Text>
              <Text style={styles.descricao}>{item.descricao}</Text>
              <Text style={styles.tempo}>Preparo: {item.tempoPreparo}</Text>

              <Text
                style={[
                  styles.status,
                  { color: item.disponivel ? "#27F5B4" : "#FF4444" },
                ]}
              >
                {item.disponivel ? "Disponível" : "Indisponível"}
              </Text>

              <Text style={styles.toqueEditar}>Toque para editar</Text>
            </View>
          </Pressable>
        )}
      />

      <Pressable style={styles.botaoAdicionar} onPress={abrirNovoPrato}>
        <Text style={styles.textoBotaoAdicionar}>+ Adicionar prato</Text>
      </Pressable>

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
            <FlatList
              data={[{ id: "formulario" }]}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={() => (
                <View>
                  <Text style={styles.tituloModal}>
                    {editandoId ? "Editar prato" : "Novo prato"}
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Nome do prato"
                    placeholderTextColor="#777"
                    value={nome}
                    onChangeText={setNome}
                  />

                  <Pressable
                    style={styles.dropdown}
                    onPress={() => setCategoriaAberta(!categoriaAberta)}
                  >
                    <Text
                      style={
                        categoria
                          ? styles.dropdownTexto
                          : styles.dropdownPlaceholder
                      }
                    >
                      {categoria || "Categoria"}
                    </Text>
                    <Text style={styles.dropdownSeta}>
                      {categoriaAberta ? "▲" : "▼"}
                    </Text>
                  </Pressable>

                  {categoriaAberta && (
                    <View style={styles.dropdownLista}>
                      {CATEGORIAS.map((opcao) => (
                        <Pressable
                          key={opcao}
                          style={[
                            styles.dropdownItem,
                            categoria === opcao &&
                              styles.dropdownItemSelecionado,
                          ]}
                          onPress={() => {
                            setCategoria(opcao);
                            setCategoriaAberta(false);
                          }}
                        >
                          <Text style={styles.dropdownTexto}>{opcao}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}

                  <TextInput
                    style={[styles.input, styles.inputDescricao]}
                    placeholder="Descrição"
                    placeholderTextColor="#777"
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Preço"
                    placeholderTextColor="#777"
                    value={preco}
                    onChangeText={(texto) =>
                      setPreco(aplicarMascaraPreco(texto))
                    }
                    keyboardType="numeric"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Tempo de preparo (00:30)"
                    placeholderTextColor="#777"
                    value={tempoPreparo}
                    onChangeText={(texto) =>
                      setTempoPreparo(aplicarMascaraHora(texto))
                    }
                    keyboardType="numeric"
                    maxLength={5}
                  />

                  <Text style={styles.label}>URL da imagem</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="https://..."
                    placeholderTextColor="#777"
                    value={imagem}
                    onChangeText={setImagem}
                    autoCapitalize="none"
                    keyboardType="url"
                  />

                  {imagem.trim() !== "" &&
                    /^https?:\/\/.+/i.test(imagem.trim()) && (
                      <Image
                        source={{ uri: imagem.trim() }}
                        style={styles.previaImagem}
                        resizeMode="cover"
                      />
                    )}

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
                        <Text style={styles.textoDisponibilidade}>
                          Disponível
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[
                          styles.botaoDisponibilidade,
                          disponivel === false &&
                            styles.botaoIndisponivelSelecionado,
                        ]}
                        onPress={() => setDisponivel(false)}
                      >
                        <Text style={styles.textoDisponibilidade}>
                          Indisponível
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

                  <View style={styles.botoes}>
                    <Pressable
                      style={styles.botaoCancelar}
                      onPress={fecharModal}
                      disabled={salvando}
                    >
                      <Text style={styles.textoBotao}>Cancelar</Text>
                    </Pressable>

                    {editandoId && (
                      <Pressable
                        style={styles.botaoExcluir}
                        onPress={() => setConfirmacao("excluir")}
                        disabled={salvando}
                      >
                        <Text style={styles.textoBotao}>Excluir</Text>
                      </Pressable>
                    )}

                    <Pressable
                      style={styles.botaoSalvar}
                      onPress={() =>
                        editandoId ? setConfirmacao("alterar") : salvarPrato()
                      }
                      disabled={salvando}
                    >
                      <Text style={styles.textoBotao}>
                        {salvando
                          ? "Salvando..."
                          : editandoId
                            ? "Alterar"
                            : "Salvar"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            />
          </View>

          {confirmacao !== null && (
            <View style={styles.confirmacaoFundo}>
              <View style={styles.confirmacaoCaixa}>
                <Text style={styles.confirmacaoTitulo}>
                  {confirmacao === "excluir"
                    ? "Excluir prato"
                    : "Alterar prato"}
                </Text>

                <Text style={styles.confirmacaoMensagem}>
                  {confirmacao === "excluir"
                    ? "Deseja realmente excluir esse prato do seu cardápio?"
                    : "Deseja realmente alterar esse prato do seu cardápio?"}
                </Text>

                <View style={styles.botoes}>
                  <Pressable
                    style={styles.botaoCancelar}
                    onPress={() => setConfirmacao(null)}
                    disabled={salvando}
                  >
                    <Text style={styles.textoBotao}>Cancelar</Text>
                  </Pressable>

                  <Pressable
                    style={
                      confirmacao === "excluir"
                        ? styles.botaoExcluir
                        : styles.botaoSalvar
                    }
                    onPress={confirmarAcao}
                    disabled={salvando}
                  >
                    <Text style={styles.textoBotao}>
                      {confirmacao === "excluir" ? "Excluir" : "Alterar"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
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
  center: {
    flex: 1,
    backgroundColor: "#080808",
    justifyContent: "center",
    alignItems: "center",
  },
  textoCarregando: {
    color: "#fff",
    marginTop: 10,
  },
  lista: {
    padding: 16,
    paddingBottom: 100,
  },
  listaVazia: {
    color: "#888",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
  },
  imagemCard: {
    width: "100%",
    height: 190,
  },
  cardInfo: {
    padding: 16,
  },
  cardCabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
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
  toqueEditar: {
    color: "#777",
    fontSize: 12,
    marginTop: 12,
    textAlign: "right",
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
    maxHeight: "92%",
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
  label: {
    color: "#fff",
    marginBottom: 8,
  },
  previaImagem: {
    width: "100%",
    height: 170,
    borderRadius: 10,
    marginBottom: 12,
  },
  dropdown: {
    backgroundColor: "#080808",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 13,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownTexto: {
    color: "#fff",
  },
  dropdownPlaceholder: {
    color: "#777",
  },
  dropdownSeta: {
    color: "#777",
    fontSize: 12,
  },
  dropdownLista: {
    backgroundColor: "#080808",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#1c1c1c",
  },
  dropdownItemSelecionado: {
    backgroundColor: "#2a1a0a",
  },
  disponibilidadeContainer: {
    marginBottom: 12,
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
    marginTop: 4,
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
  confirmacaoFundo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  confirmacaoCaixa: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#111",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
    padding: 20,
  },
  confirmacaoTitulo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confirmacaoMensagem: {
    color: "#bbb",
    fontSize: 15,
    marginBottom: 20,
  },
});
