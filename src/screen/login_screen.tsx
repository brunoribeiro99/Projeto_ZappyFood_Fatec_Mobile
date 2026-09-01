import React, { useEffect, useRef } from "react";

import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SplashScreen({ navigation }: any) {
  // =====================================================
  // ANIMAÇÕES
  // =====================================================

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(25)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Entrada da logo e do nome
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Entrada dos botões
    Animated.sequence([
      Animated.delay(350),

      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(buttonsTranslate, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Limpeza
    return () => {
      opacity.stopAnimation();
      translateY.stopAnimation();
      buttonsOpacity.stopAnimation();
      buttonsTranslate.stopAnimation();
    };
  }, []);

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <View style={styles.container}>
      {/* Pequeno detalhe laranja no topo */}

      <View style={styles.topAccent} />

      {/* =================================================
          CONTEÚDO PRINCIPAL
          ================================================= */}

      <Animated.View
        style={[
          styles.mainContent,
          {
            opacity,
            transform: [
              {
                translateY,
              },
            ],
          },
        ]}
      >
        {/* Logo */}

        <Image
          source={require("../../assets/imagens/zappyfood_logo.png")}
          style={styles.logo}
        />

        {/* Nome */}

        <Text style={styles.title}>
          Zappy<Text style={styles.titleOrange}>Food</Text>
        </Text>

        {/* Slogan */}

        <Text style={styles.slogan}>Seu pedido na palma da mão.</Text>
      </Animated.View>

      {/* =================================================
          BOTÕES
          ================================================= */}

      <Animated.View
        style={[
          styles.buttonsContainer,
          {
            opacity: buttonsOpacity,
            transform: [
              {
                translateY: buttonsTranslate,
              },
            ],
          },
        ]}
      >
        {/* ENTRAR */}

        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>ENTRAR</Text>
        </TouchableOpacity>

        {/* CADASTRAR */}

        <TouchableOpacity
          style={styles.registerButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={styles.registerText}>CADASTRAR</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* =================================================
          RODAPÉ
          ================================================= */}

      <Text style={styles.footer}>ZAPPY FOOD</Text>
    </View>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  // ===================================================
  // FUNDO
  // ===================================================

  container: {
    flex: 1,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  // ===================================================
  // DETALHE SUPERIOR
  // ===================================================

  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#F58427",
  },

  // ===================================================
  // CONTEÚDO
  // ===================================================

  mainContent: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 65,
  },

  // ===================================================
  // LOGO
  // ===================================================

  logo: {
    width: 190,
    height: 190,
    resizeMode: "contain",
  },

  // ===================================================
  // NOME
  // ===================================================

  title: {
    marginTop: 8,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1,
    color: "#FFFFFF",
  },

  titleOrange: {
    color: "#F58427",
  },

  // ===================================================
  // SLOGAN
  // ===================================================

  slogan: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#9A9A9A",
    letterSpacing: 0.3,
  },

  // ===================================================
  // BOTÕES
  // ===================================================

  buttonsContainer: {
    width: "100%",
    maxWidth: 360,
  },

  // ===================================================
  // BOTÃO ENTRAR
  // ===================================================

  loginButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#F58427",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#F58427",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 5,
  },

  loginText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  // ===================================================
  // BOTÃO CADASTRAR
  // ===================================================

  registerButton: {
    height: 54,
    marginTop: 12,
    borderRadius: 12,

    backgroundColor: "transparent",

    borderWidth: 1.5,
    borderColor: "#F58427",

    alignItems: "center",
    justifyContent: "center",
  },

  registerText: {
    color: "#F58427",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // ===================================================
  // RODAPÉ
  // ===================================================

  footer: {
    position: "absolute",
    bottom: 28,

    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 3,

    color: "#555555",
  },
});
