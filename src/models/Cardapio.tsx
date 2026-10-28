export interface Cardapio {
  id?: string;
  restauranteId: string;
  nome: string;
  categoria: string;
  descricao: string;
  preco: string;
  tempoPreparo: string;
  disponivel: boolean;
  imagem: string;
  createdAt: string;
}

export interface JSONBinResponse {
  record: {
    record: Cardapio[];
  };
  metadata: any;
}
