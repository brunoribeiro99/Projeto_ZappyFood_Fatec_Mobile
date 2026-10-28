import { createUserWithEmailAndPassword } from "firebase/auth";

import { ref, set } from "firebase/database";

import { auth, database } from "./firebaseConfig";

import { UserModel } from "../models/UserModel";

// dados do restaurante salvos em restaurantes/{uid}
export interface RestauranteModel {
  id: string;
  nomeRestaurante: string;
  responsavel: string;
  cnpj: string;
  celular: string;
  email: string;
  createdAt: string;
}

//cadastrar no database do firebase
class UserService {
  // ===================================================
  // CADASTRAR CLIENTE
  // ===================================================

  async cadastrarUsuario(
    nome: string,
    celular: string,
    email: string,
    senha: string,
  ): Promise<UserModel> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      senha,
    );

    //gera o id
    const uid = userCredential.user.uid;

    const usuario: UserModel = {
      id: uid,
      nome: nome,
      celular: celular,
      email: email,
      createdAt: new Date().toISOString(),
    };

    // cliente: o login usa este nó para saber que a conta é de cliente
    await set(ref(database, `clientes/${uid}`), usuario);

    // mantido como estava, para não quebrar telas que leiam usuarios/
    await set(ref(database, `usuarios/${uid}`), usuario);

    return usuario;
  }

  // ===================================================
  // CADASTRAR RESTAURANTE
  // ===================================================

  async cadastrarRestaurante(
    nomeRestaurante: string,
    responsavel: string,
    cnpj: string,
    celular: string,
    email: string,
    senha: string,
  ): Promise<RestauranteModel> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      senha,
    );

    //gera o id
    const uid = userCredential.user.uid;

    const restaurante: RestauranteModel = {
      id: uid,
      nomeRestaurante: nomeRestaurante,
      responsavel: responsavel,
      cnpj: cnpj,
      celular: celular,
      email: email,
      createdAt: new Date().toISOString(),
    };

    // restaurante: o login usa este nó para saber que a conta é de restaurante
    await set(ref(database, `restaurantes/${uid}`), restaurante);

    return restaurante;
  }
}

export const userService = new UserService();
