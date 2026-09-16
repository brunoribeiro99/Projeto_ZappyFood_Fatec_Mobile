import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen({ navigation }: any) {
  // =====================================================
  // ESTADOS DE ANIMAÇÃO
  // =====================================================
  // Controla o Giro de Pião (0 a 1)
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Estados originais para o texto e detalhes
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(18)).current;
  const titleScale = useRef(new Animated.Value(0.96)).current;

  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const sloganY = useRef(new Animated.Value(10)).current;

  const accentScale = useRef(new Animated.Value(0)).current;

  // =====================================================
  // INTERPOLAÇÃO DO GIRO 3D (Eixo Y)
  // =====================================================
  const spinY = spinAnim.interpolate({
    inputRange: [0, 0.4, 0.8, 1],
    outputRange: ["0deg", "-360deg", "360deg", "0deg"],
  });

  useEffect(() => {
    // Sequência de animações cronometradas da sua Splash
    Animated.sequence([
      Animated.delay(200),

      // 1. EFEITO DO PIÃO (Gira para a esquerda e regressa para a direita)
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: true,
      }),

      // 2. ENTRADA DO NOME ZAPPYFOOD (Mantendo a sua lógica original)
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.spring(accentScale, {
          toValue: 1,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),

      // 3. ENTRADA DO SLOGAN
      Animated.parallel([
        Animated.timing(sloganOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sloganY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 4. REDIRECIONAMENTO NATIVO PARA O SEU LOGIN
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3500);

    return () => {
      clearTimeout(timer);
      spinAnim.stopAnimation();
      titleOpacity.stopAnimation();
      titleY.stopAnimation();
      titleScale.stopAnimation();
      sloganOpacity.stopAnimation();
      sloganY.stopAnimation();
      accentScale.stopAnimation();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGlow} />

      {/* ÁREA DA LOGO CORRIGIDA: Sem fatias, girando a imagem inteira uniformemente */}
      <View style={styles.logoArea}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ rotateY: spinY }],
            },
          ]}
        >
          <Image
            source={require("../../assets/imagens/zappyfood_logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Conteúdo de Texto e Detalhe Laranja */}
      <View style={styles.textContainer}>
        <Animated.View
          style={[
            styles.titleWrapper,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleY }, { scale: titleScale }],
            },
          ]}
        >
          <Text style={styles.titleText}>ZappyFood</Text>
          <Animated.View
            style={[styles.accentDot, { transform: [{ scale: accentScale }] }]}
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: sloganOpacity,
            transform: [{ translateY: sloganY }],
          }}
        >
          <Text style={styles.sloganText}>
            A sua comida favorita num estalar de dedos.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundGlow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#F58427",
    opacity: 0.035,
  },
  logoArea: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "visible", // Garante o suporte à perspetiva 3D no iOS e Android
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6600",
    marginLeft: 4,
  },
  sloganText: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
  },
});
