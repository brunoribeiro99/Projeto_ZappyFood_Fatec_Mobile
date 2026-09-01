import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  // ==============================
  // ANIMAÇÕES
  // ==============================

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  const translateY = useRef(new Animated.Value(30)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // ==============================
    // ENTRADA DA LOGO
    // ==============================

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

    // ==============================
    // PULSAÇÃO DA LOGO
    // ==============================

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

    // ==============================
    // LIMPEZA DAS ANIMAÇÕES
    // ==============================

    return () => {
      fadeAnim.stopAnimation();
      scaleAnim.stopAnimation();
      translateY.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, [fadeAnim, scaleAnim, translateY, pulseAnim]);

  // ==============================
  // INTERFACE
  // ==============================

  return (
    <View style={styles.container}>
      {/* Círculo decorativo superior */}
      <View style={styles.circleTop} />

      {/* Círculo decorativo inferior */}
      <View style={styles.circleBottom} />

      {/* ==========================
          LOGO EM MARCA D'ÁGUA
          ========================== */}

      <Image
        source={require("../../assets/imagens/zappyfood_logo.png")}
        style={styles.watermark}
      />

      {/* ==========================
          CONTEÚDO PRINCIPAL
          ========================== */}

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,

            transform: [
              {
                scale: scaleAnim,
              },
              {
                translateY: translateY,
              },
            ],
          },
        ]}
      >
        {/* Logo principal */}
        <Animated.Image
          source={require("../../assets/imagens/zappyfood_logo.png")}
          style={[
            styles.logo,
            {
              transform: [
                {
                  scale: pulseAnim,
                },
              ],
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

      {/* ==========================
          CARREGAMENTO
          ========================== */}

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

      {/* ==========================
          RODAPÉ
          ========================== */}

      <Text style={styles.footer}>Sua experiência começa aqui</Text>
    </View>
  );
}

// ==============================
// ESTILOS
// ==============================

const styles = StyleSheet.create({
  // ============================
  // CONTAINER
  // ============================

  container: {
    flex: 1,

    backgroundColor: "#F8F8F8",

    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",
  },

  // ============================
  // ELEMENTOS DECORATIVOS
  // ============================

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

  // ============================
  // MARCA D'ÁGUA
  // ============================

  watermark: {
    position: "absolute",

    width: 500,

    height: 500,

    resizeMode: "contain",

    opacity: 0.035,
  },

  // ============================
  // CONTEÚDO
  // ============================

  content: {
    alignItems: "center",

    justifyContent: "center",
  },

  // ============================
  // LOGO
  // ============================

  logo: {
    width: 190,

    height: 190,

    resizeMode: "contain",
  },

  // ============================
  // TÍTULO
  // ============================

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

  // ============================
  // SLOGAN
  // ============================

  slogan: {
    marginTop: 8,

    fontSize: 17,

    fontWeight: "600",

    letterSpacing: 0.5,

    color: "#444444",
  },

  // ============================
  // LOADING
  // ============================

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

  // ============================
  // RODAPÉ
  // ============================

  footer: {
    position: "absolute",

    bottom: 35,

    fontSize: 11,

    color: "#AAAAAA",

    letterSpacing: 0.5,
  },
});
