import { useEffect, useState } from "react";

import {
  adicionarCardapio,
  atualizarCardapio,
  excluirCardapio,
  getCardapio,
} from "../services/api";

import { Cardapio } from "../models/Cardapio";
import { auth } from "../services/firebaseConfig";

export function useCardapio() {
  const [pratos, setPratos] = useState<Cardapio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const restauranteId = auth.currentUser?.uid;

  const load = async () => {
    try {
      setError(null);

      if (!restauranteId) {
        throw new Error("Restaurante não identificado");
      }

      const data = await getCardapio();

      const pratosRestaurante = data.filter(
        (item) => item.restauranteId === restauranteId,
      );

      setPratos(pratosRestaurante);
    } catch {
      setError("Erro ao carregar cardápio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [restauranteId]);

  const adicionarPrato = async (prato: Cardapio) => {
    await adicionarCardapio(prato);
    await load();
  };

  const atualizarPrato = async (prato: Cardapio) => {
    await atualizarCardapio(prato);
    await load();
  };

  const excluirPrato = async (id: string) => {
    await excluirCardapio(id);
    await load();
  };

  return {
    pratos,
    loading,
    error,
    atualizarLista: load,
    adicionarPrato,
    atualizarPrato,
    excluirPrato,
  };
}
