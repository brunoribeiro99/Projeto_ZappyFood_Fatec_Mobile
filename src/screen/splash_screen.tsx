import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen({ navigation }: any) {
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrada da logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Pequeno efeito de pulsação na logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Vai para Login depois de 2 segundos
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Círculos decorativos */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      {/* Logo em marca d'água */}
      <Image
        source={require("../assents/imagens/zappyfood_logo.png")}
        style={styles.watermark}
      />

      {/* Conteúdo principal */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: translateY }],
          },
        ]}
      >
        {/* Logo */}
        <Animated.Image
          source={require("../assents/imagens/zappyfood_logo.png")}
          style={[
            styles.logo,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Nome do aplicativo */}
        <Text style={styles.title}>
          Zappy <Text style={styles.titleGreen}>Food</Text>
        </Text>

        {/* Slogan */}
        <Text style={styles.slogan}>Chegue. Peça. Aproveite.</Text>
      </Animated.View>

      {/* Carregamento */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingTrack}>
          <Animated.View
            style={[
              styles.loadingBar,
              {
                opacity: fadeAnim,
              },
            ]}
          />
        </View>

        <Text style={styles.loadingText}>Preparando seu pedido...</Text>
      </View>

      {/* Rodapé */}
      <Text style={styles.footer}>Sua experiência começa aqui</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  /* -------------------------
     ELEMENTOS DECORATIVOS
  -------------------------- */

  circleTop: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#27F5B4",
    opacity: 0.08,
    top: -130,
    right: -100,
  },

  circleBottom: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#F58427",
    opacity: 0.07,
    bottom: -180,
    left: -150,
  },

  /* -------------------------
     MARCA D'ÁGUA
  -------------------------- */

  watermark: {
    position: "absolute",
    width: 500,
    height: 500,
    resizeMode: "contain",
    opacity: 0.035,
  },

  /* -------------------------
     CONTEÚDO
  -------------------------- */

  content: {
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 190,
    height: 190,
    resizeMode: "contain",
  },

  title: {
    marginTop: 15,
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#F58427",
  },

  titleGreen: {
    color: "#27CFA0",
  },

  slogan: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#444444",
  },

  /* -------------------------
     LOADING
  -------------------------- */

  loadingContainer: {
    position: "absolute",
    bottom: 95,
    alignItems: "center",
  },

  loadingTrack: {
    width: 160,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#E6E6E6",
    overflow: "hidden",
  },

  loadingBar: {
    width: "65%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#27F5B4",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: "#888888",
    letterSpacing: 0.3,
  },

  /* -------------------------
     RODAPÉ
  -------------------------- */

  footer: {
    position: "absolute",
    bottom: 35,
    fontSize: 11,
    color: "#AAAAAA",
    letterSpacing: 0.5,
  },
});
