import React from "react";

import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import CardapioCard from "../components/cardapio_card";
import { useCardapio } from "../hooks/Cardapio";

export default function ListarCardapioScreen() {
  const { pratos, loading, error } = useCardapio();

  const handleAdd = () => {
    console.log("Adicionar prato");
  };

  const handleEdit = (item: any) => {
    console.log("Editar:", item);
  };

  const handleDelete = (item: any) => {
    console.log("Excluir:", item);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F58427" />
        <Text>Carregando cardápio...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* BOTÃO ADICIONAR */}
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Ionicons name="add-circle" size={24} color="#FFF" />
        <Text style={styles.addText}>Novo Prato</Text>
      </TouchableOpacity>

      <FlatList
        data={pratos}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <View>
            <CardapioCard prato={item} />

            {/* AÇÕES */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEdit(item)}
              >
                <Ionicons name="create-outline" size={24} color="#F58427" />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDelete(item)}
              >
                <Ionicons name="trash-outline" size={24} color="red" />
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    color: "red",
    fontSize: 16,
  },

  addButton: {
    flexDirection: "row",
    backgroundColor: "#F58427",
    padding: 12,
    margin: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  addText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
    gap: 20,
    marginBottom: 10,
  },

  actionButton: {
    alignItems: "center",
  },

  actionText: {
    fontSize: 12,
    marginTop: 4,
  },
});
