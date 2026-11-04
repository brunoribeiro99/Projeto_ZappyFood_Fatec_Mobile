import { useEffect, useState } from "react";

import { getCardapio } from "../services/api";

import { Cardapio } from "../models/Cardapio";

export function useCardapio() {
  const [pratos, setPratos] = useState<Cardapio[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getCardapio();
      setPratos(data);
    } catch {
      setError("Erro ao carregar cardápio");
    } finally {
      setLoading(false);
    }
  };

  return { pratos, loading, error };
}
