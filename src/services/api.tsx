import axios from "axios";

import { Cardapio, JSONBinResponse } from "../models/Cardapio";

import { API_KEY, URL } from "../constants/Config";
import { auth } from "./firebaseConfig";

export const getCardapio = async (): Promise<Cardapio[]> => {
  try {
    console.log("Buscando pratos na API...");

    const response = await axios.get<JSONBinResponse>(URL, {
      headers: {
        "X-Master-Key": API_KEY,
      },
    });

    if (!response.data || !Array.isArray(response.data.record)) {
      throw new Error("Resposta inválida da API");
    }

    return response.data.record;
  } catch (error: any) {
    console.log("ERRO DETALHADO:", error.response?.data || error.message);
    throw new Error("Erro ao buscar cardápio");
  }
};

const salvarCardapio = async (pratos: Cardapio[]) => {
  const URL_ATUALIZACAO = URL.replace("/latest", "");

  await axios.put(URL_ATUALIZACAO, pratos, {
    headers: {
      "X-Master-Key": API_KEY,
      "Content-Type": "application/json",
    },
  });
};

export const adicionarCardapio = async (prato: Cardapio) => {
  const restauranteId = auth.currentUser?.uid;

  if (!restauranteId) {
    throw new Error("Restaurante não identificado");
  }

  const pratos = await getCardapio();

  const novoPrato: Cardapio = {
    ...prato,
    id: Date.now().toString(),
    restauranteId: restauranteId,
  };

  pratos.push(novoPrato);

  await salvarCardapio(pratos);
};

export const atualizarCardapio = async (prato: Cardapio) => {
  const restauranteId = auth.currentUser?.uid;

  if (!restauranteId) {
    throw new Error("Restaurante não identificado");
  }

  const pratos = await getCardapio();

  const indice = pratos.findIndex(
    (item) => item.id === prato.id && item.restauranteId === restauranteId,
  );

  if (indice === -1) {
    throw new Error("Prato não encontrado ou não pertence ao restaurante");
  }

  const pratoAtual = pratos[indice];

  pratos[indice] = {
    ...prato,
    restauranteId: restauranteId,
    createdAt: pratoAtual.createdAt,
  };

  await salvarCardapio(pratos);
};

export const excluirCardapio = async (id: string) => {
  const restauranteId = auth.currentUser?.uid;

  if (!restauranteId) {
    throw new Error("Restaurante não identificado");
  }

  const pratos = await getCardapio();

  const pratoExiste = pratos.some(
    (item) => item.id === id && item.restauranteId === restauranteId,
  );

  if (!pratoExiste) {
    throw new Error("Prato não encontrado ou não pertence ao restaurante");
  }

  const listaAtualizada = pratos.filter((item) => item.id !== id);

  await salvarCardapio(listaAtualizada);
};
