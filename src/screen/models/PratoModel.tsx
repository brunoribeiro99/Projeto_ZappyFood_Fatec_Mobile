export interface PratoModel {
  id?: string;

  restauranteId: string;

  nome: string;

  categoria: string;

  descricao: string;

  preco: string;

  tempoPreparo: string;

  disponivel: boolean;
}
