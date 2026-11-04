import React from "react";

import { Image, StyleSheet, Text, View } from "react-native";

import { Cardapio } from "../models/Cardapio";

interface Props {
  prato: Cardapio | null;
}

export default function CardapioCard({ prato }: Props) {
  if (!prato) {
    return <Text>Prato inválido</Text>;
  }

  return (
    <View style={styles.card}>
      <Image source={{ uri: prato.imagem || "" }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.categoria}>
          {prato.categoria || "Sem categoria"}
        </Text>

        <Text style={styles.nome}>{prato.nome || "Sem nome"}</Text>

        <Text numberOfLines={2} style={styles.descricao}>
          {prato.descricao || "Sem descrição"}
        </Text>

        <Text style={styles.preco}>
          {Number(prato.preco.replace(",", ".")).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>

        <Text style={styles.tempo}>Tempo de preparo: {prato.tempoPreparo}</Text>

        <Text style={styles.disponibilidade}>
          {prato.disponivel ? "Disponível" : "Indisponível"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    margin: 16,
    overflow: "hidden",
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 200,
  },

  infoContainer: {
    padding: 16,
  },

  categoria: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },

  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },

  descricao: {
    fontSize: 14,
    color: "#555",
    marginVertical: 8,
  },

  preco: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F58427",
  },

  tempo: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },

  disponibilidade: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
});
