import axios from 'axios';
import { JSONBinResponse, Product } from '../models/cardapio';
import { URL, API_KEY } from '../constants/Config';
 
export const getProduct = async (): Promise<Product[]> => {
  try {
    console.log('Buscando produto na API...');
 
    const response = await axios.get<JSONBinResponse>(URL, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });
 
    console.log('Resposta completa:', JSON.stringify(response.data, null, 2));
 
    if (!response.data || !response.data.record) {
      throw new Error('Resposta inválida da API');
    }
 
    return response.data.record.record; 
  } catch (error: any) {
    console.log('ERRO DETALHADO:', error.response?.data || error.message);
    throw new Error('Erro ao buscar produto');
  }
};