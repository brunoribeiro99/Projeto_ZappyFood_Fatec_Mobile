import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
export default function RestaurantWelcome() {
  const [status, setStatus] = useState<"open" | "closed" | null>(null);
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const date = dateTime.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = dateTime.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const isOpen = status === "open";
  const isClosed = status === "closed";
  return (
    <SafeAreaView style={styles.container}>
      {" "}
      <StatusBar barStyle="light-content" backgroundColor="#080808" />{" "}
      <View style={styles.content}>
        {" "}
        <View style={styles.header}>
          {" "}
          <Text style={styles.logo}>
            ZAPPY<Text style={styles.logoOrange}>FOOD</Text>
          </Text>{" "}
          <Text style={styles.welcome}>Bem-vindo! 👋</Text>{" "}
          <Text style={styles.date}>{date}</Text>{" "}
          <Text style={styles.time}>{time}</Text>{" "}
        </View>{" "}
        <View style={styles.questionArea}>
          {" "}
          <Text style={styles.question}>Como está seu restaurante?</Text>{" "}
          <Text style={styles.subtitle}>
            {" "}
            Defina a disponibilidade para seus clientes.{" "}
          </Text>{" "}
        </View>{" "}
        <View style={styles.options}>
          {" "}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setStatus("open")}
            style={[
              styles.option,
              styles.openOption,
              isOpen && styles.selectedOpen,
            ]}
          >
            {" "}
            <View style={styles.iconCircle}>
              {" "}
              <View style={styles.greenDot} />{" "}
            </View>{" "}
            <View style={styles.optionText}>
              {" "}
              <Text style={styles.optionTitle}>ABERTO</Text>{" "}
              <Text style={styles.optionDescription}>
                {" "}
                Receber pedidos{" "}
              </Text>{" "}
            </View>{" "}
            {isOpen && (
              <View style={styles.check}>
                {" "}
                <Text style={styles.checkText}>✓</Text>{" "}
              </View>
            )}{" "}
          </TouchableOpacity>{" "}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setStatus("closed")}
            style={[
              styles.option,
              styles.closedOption,
              isClosed && styles.selectedClosed,
            ]}
          >
            {" "}
            <View style={styles.iconCircle}>
              {" "}
              <View style={styles.redDot} />{" "}
            </View>{" "}
            <View style={styles.optionText}>
              {" "}
              <Text style={styles.optionTitle}>FECHADO</Text>{" "}
              <Text style={styles.optionDescription}>
                {" "}
                Não receber pedidos{" "}
              </Text>{" "}
            </View>{" "}
            {isClosed && (
              <View style={styles.check}>
                {" "}
                <Text style={styles.checkText}>✓</Text>{" "}
              </View>
            )}{" "}
          </TouchableOpacity>{" "}
        </View>{" "}
        {isOpen && (
          <View style={styles.statusCardOpen}>
            {" "}
            <View style={styles.statusIndicatorOpen} />{" "}
            <View style={styles.statusContent}>
              {" "}
              <Text style={styles.statusTitle}>Restaurante aberto</Text>{" "}
              <Text style={styles.statusMessage}>
                {" "}
                Você está aberto para receber pedidos.{" "}
              </Text>{" "}
              <Text style={styles.statusDetail}>
                {" "}
                Seus clientes podem realizar pedidos normalmente pelo
                ZappyFood.{" "}
              </Text>{" "}
            </View>{" "}
          </View>
        )}{" "}
        {isClosed && (
          <View style={styles.statusCardClosed}>
            {" "}
            <View style={styles.statusIndicatorClosed} />{" "}
            <View style={styles.statusContent}>
              {" "}
              <Text style={styles.statusTitle}>Restaurante fechado</Text>{" "}
              <Text style={styles.statusMessage}>
                {" "}
                Você está fechado e não receberá pedidos.{" "}
              </Text>{" "}
              <Text style={styles.statusDetail}>
                {" "}
                Seu restaurante não está disponível para novos pedidos no
                momento.{" "}
              </Text>{" "}
            </View>{" "}
          </View>
        )}{" "}
        {!status && (
          <View style={styles.emptyState}>
            {" "}
            <Text style={styles.emptyText}>
              {" "}
              Selecione uma opção para definir o status do restaurante.{" "}
            </Text>{" "}
          </View>
        )}{" "}
      </View>{" "}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080808" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },
  header: { alignItems: "center" },
  logo: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#FFFFFF",
    marginBottom: 36,
  },
  logoOrange: { color: "#F58427" },
  welcome: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  date: { color: "#A7A7A7", fontSize: 15, textTransform: "capitalize" },
  time: { color: "#F58427", fontSize: 20, fontWeight: "700", marginTop: 4 },
  questionArea: { marginTop: 48, marginBottom: 20 },
  question: { color: "#FFFFFF", fontSize: 21, fontWeight: "700" },
  subtitle: { color: "#777777", fontSize: 14, marginTop: 7 },
  options: { gap: 12 },
  option: {
    minHeight: 82,
    borderRadius: 20,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  openOption: { backgroundColor: "#111111", borderColor: "#242424" },
  selectedOpen: { backgroundColor: "#101A14", borderColor: "#2E8B57" },
  closedOption: { backgroundColor: "#111111", borderColor: "#242424" },
  selectedClosed: { backgroundColor: "#1A1111", borderColor: "#B83A3A" },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#191919",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  greenDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#36D879",
  },
  redDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#FF4D4D",
  },
  optionText: { flex: 1 },
  optionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
  optionDescription: { color: "#858585", fontSize: 13, marginTop: 4 },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F58427",
    justifyContent: "center",
    alignItems: "center",
  },
  checkText: { color: "#FFFFFF", fontSize: 17, fontWeight: "900" },
  statusCardOpen: {
    marginTop: 22,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#0E1913",
    borderWidth: 1,
    borderColor: "#245D3D",
    flexDirection: "row",
  },
  statusCardClosed: {
    marginTop: 22,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#1A1010",
    borderWidth: 1,
    borderColor: "#632C2C",
    flexDirection: "row",
  },
  statusIndicatorOpen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#36D879",
    marginTop: 5,
    marginRight: 12,
  },
  statusIndicatorClosed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF4D4D",
    marginTop: 5,
    marginRight: 12,
  },
  statusContent: { flex: 1 },
  statusTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  statusMessage: {
    color: "#D0D0D0",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  statusDetail: {
    color: "#777777",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },
  emptyState: { marginTop: 24, alignItems: "center" },
  emptyText: { color: "#555555", fontSize: 12, textAlign: "center" },
});
