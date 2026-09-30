import { child, get, push, ref, remove, update } from "firebase/database";
import { PratoModel } from "../models/PratoModel";
import { database } from "./firebaseConfig";

// Tipo para mapear os erros de validação de cada campo do formulário
export type ErrosPrato = Partial<Record<keyof PratoModel, string>>;

export class PratoService {
  // =====================================================
  // MÁSCARA DE PREÇO
  // =====================================================

  static aplicarMascaraPreco(texto: string): string {
    const digitos = texto.replace(/\D/g, "");

    if (!digitos) return "";

    const semZerosEsquerda = digitos.replace(/^0+(?=\d)/, "");

    const valor = semZerosEsquerda.padStart(3, "0");

    const centavos = valor.slice(-2);

    let reais = valor.slice(0, -2);

    reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `R$ ${reais},${centavos}`;
  }

  // =====================================================
  // MÁSCARA DE TEMPO DE PREPARO
  // =====================================================

  static aplicarMascaraHora(texto: string): string {
    const digitos = texto.replace(/\D/g, "").slice(0, 4);

    if (digitos.length <= 2) return digitos;

    return `${digitos.slice(0, 2)}:${digitos.slice(2)}`;
  }

  // =====================================================
  // VALIDAÇÃO DOS CAMPOS
  // =====================================================

  static validarCampos(dados: PratoModel): {
    valido: boolean;
    erros: ErrosPrato;
  } {
    const erros: ErrosPrato = {};

    if (!dados.nome || !dados.nome.trim()) {
      erros.nome = "Campo obrigatório.";
    }

    if (!dados.categoria || !dados.categoria.trim()) {
      erros.categoria = "Campo obrigatório.";
    }

    if (!dados.descricao || !dados.descricao.trim()) {
      erros.descricao = "Campo obrigatório.";
    }

    if (!dados.preco || !dados.preco.trim()) {
      erros.preco = "Campo obrigatório.";
    }

    if (!dados.tempoPreparo || !dados.tempoPreparo.trim()) {
      erros.tempoPreparo = "Campo obrigatório.";
    }

    if (dados.disponivel === undefined || dados.disponivel === null) {
      erros.disponivel = "Informe a disponibilidade do prato.";
    }

    return {
      valido: Object.keys(erros).length === 0,
      erros,
    };
  }

  // =====================================================
  // VERIFICAR DUPLICIDADE
  // =====================================================

  static async verificarDuplicidade(
    nome: string,
    categoria: string,
    idAtual?: string,
  ): Promise<{
    mesmoNome: boolean;
    mesmaCategoria: boolean;
  }> {
    try {
      const dbRef = ref(database);

      const snapshot = await get(child(dbRef, "pratos"));

      if (!snapshot.exists()) {
        return {
          mesmoNome: false,
          mesmaCategoria: false,
        };
      }

      const data = snapshot.val();

      let mesmoNome = false;
      let mesmaCategoria = false;

      Object.keys(data).forEach((key) => {
        // Durante a edição, ignora o próprio prato
        if (idAtual && key === idAtual) {
          return;
        }

        const prato = data[key];

        const nomeIgual =
          prato.nome?.trim().toLowerCase() === nome.trim().toLowerCase();

        if (nomeIgual) {
          mesmoNome = true;

          const categoriaIgual =
            prato.categoria?.trim().toLowerCase() ===
            categoria.trim().toLowerCase();

          if (categoriaIgual) {
            mesmaCategoria = true;
          }
        }
      });

      return {
        mesmoNome,
        mesmaCategoria,
      };
    } catch (error) {
      console.error("Erro ao verificar duplicidade do prato:", error);

      throw new Error("Falha ao verificar se o prato já está cadastrado.");
    }
  }

  // =====================================================
  // CRIAR PRATO
  // =====================================================

  static async criar(dados: PratoModel): Promise<PratoModel> {
    try {
      const duplicidade = await PratoService.verificarDuplicidade(
        dados.nome,
        dados.categoria,
      );

      // Não permite mesmo nome + mesma categoria
      if (duplicidade.mesmaCategoria) {
        throw new Error("Este prato já está cadastrado nesta categoria.");
      }

      const pratosRef = ref(database, "pratos");

      // Gera uma chave/ID única no nó "pratos"
      const novoPratoRef = push(pratosRef);

      const novoId = novoPratoRef.key;

      if (!novoId) {
        throw new Error("Não foi possível gerar um ID único no Firebase.");
      }

      const novoPrato: PratoModel = {
        ...dados,
        id: novoId,
      };

      // Guarda os dados na referência criada
      await update(novoPratoRef, novoPrato);

      return novoPrato;
    } catch (error) {
      console.error("Erro ao criar prato no Firebase:", error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Falha ao registrar o prato no banco de dados.");
    }
  }

  // =====================================================
  // LISTAR TODOS OS PRATOS
  // =====================================================

  static async listarTodas(): Promise<PratoModel[]> {
    try {
      const dbRef = ref(database);

      const snapshot = await get(child(dbRef, "pratos"));

      if (snapshot.exists()) {
        const data = snapshot.val();

        // Transforma o objeto retornado do Firebase
        // em um array de PratoModel
        return Object.keys(data).map((key) => ({
          id: key,

          ...data[key],
        }));
      }

      return [];
    } catch (error) {
      console.error("Erro ao listar pratos do Firebase:", error);

      throw new Error("Falha ao carregar os pratos.");
    }
  }

  // =====================================================
  // OBTER PRATO POR ID
  // =====================================================

  static async obterPorId(id: string): Promise<PratoModel | null> {
    try {
      const dbRef = ref(database);

      const snapshot = await get(child(dbRef, `pratos/${id}`));

      if (snapshot.exists()) {
        return {
          id,

          ...snapshot.val(),
        };
      }

      return null;
    } catch (error) {
      console.error(`Erro ao buscar prato com ID ${id}:`, error);

      throw new Error("Falha ao obter os dados do prato.");
    }
  }

  // =====================================================
  // ATUALIZAR PRATO
  // =====================================================

  static async atualizar(id: string, dados: PratoModel): Promise<boolean> {
    try {
      const duplicidade = await PratoService.verificarDuplicidade(
        dados.nome,
        dados.categoria,
        id,
      );

      // Não permite outro prato com mesmo nome + categoria
      if (duplicidade.mesmaCategoria) {
        throw new Error("Já existe outro prato com este nome nesta categoria.");
      }

      const pratoRef = ref(database, `pratos/${id}`);

      const dadosAtualizados: PratoModel = {
        ...dados,

        id,
      };

      await update(pratoRef, dadosAtualizados);

      return true;
    } catch (error) {
      console.error(`Erro ao atualizar prato com ID ${id}:`, error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Falha ao atualizar o prato.");
    }
  }

  // =====================================================
  // EXCLUIR PRATO
  // =====================================================

  static async eliminar(id: string): Promise<boolean> {
    try {
      const pratoRef = ref(database, `pratos/${id}`);

      await remove(pratoRef);

      return true;
    } catch (error) {
      console.error(`Erro ao eliminar prato com ID ${id}:`, error);

      throw new Error("Falha ao remover o prato.");
    }
  }
}
