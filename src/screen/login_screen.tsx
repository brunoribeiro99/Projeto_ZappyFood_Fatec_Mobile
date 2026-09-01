import React, { useEffect, useRef, useState } from "react";

import {
    Animated,
    Easing,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen({ navigation }: any) {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);

  // =====================================================
  // ANIMAÇÕES
  // =====================================================

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(25)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;

  // =====================================================
  // ANIMAÇÃO INICIAL
  // =====================================================

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      fadeAnim.stopAnimation();
      translateY.stopAnimation();
      logoScale.stopAnimation();
    };
  }, []);

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <View style={styles.container}>
      {/* =================================================
          DETALHE LARANJA SUPERIOR
          ================================================= */}

      <View style={styles.topAccent} />

      {/* =================================================
          CONTEÚDO
          ================================================= */}

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: translateY,
              },
            ],
          },
        ]}
      >
        {/* =================================================
            LOGO
            ================================================= */}

        <Animated.View
          style={{
            transform: [
              {
                scale: logoScale,
              },
            ],
          }}
        >
          <Image
            source={require("../../assets/imagens/zappyfood_logo.png")}
            style={styles.logo}
          />
        </Animated.View>

        {/* =================================================
            TÍTULO
            ================================================= */}

        <Text style={styles.title}>Bem-vindo de volta!</Text>

        <Text style={styles.subtitle}>Entre na sua conta para continuar.</Text>

        {/* =================================================
            FORMULÁRIO
            ================================================= */}

        <View style={styles.form}>
          {/* E-MAIL */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-MAIL</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#666666"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* SENHA */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>SENHA</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha"
                placeholderTextColor="#666666"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.showPasswordButton}
                activeOpacity={0.7}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? "OCULTAR" : "VER"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ESQUECI A SENHA */}

          <TouchableOpacity style={styles.forgotButton} activeOpacity={0.7}>
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          {/* =================================================
              BOTÃO ENTRAR
              ================================================= */}

          <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>ENTRAR</Text>
          </TouchableOpacity>

          {/* =================================================
              SEPARADOR
              ================================================= */}

          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />

            <Text style={styles.separatorText}>ou</Text>

            <View style={styles.separatorLine} />
          </View>

          {/* =================================================
              CADASTRO
              ================================================= */}

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta?</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Cadastro")}
            >
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: 28,
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

  content: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    marginTop: 55,
  },

  // ===================================================
  // LOGO
  // ===================================================

  logo: {
    width: 105,
    height: 105,
    resizeMode: "contain",
  },

  // ===================================================
  // TÍTULO
  // ===================================================

  title: {
    marginTop: 12,
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },

  // ===================================================
  // SUBTÍTULO
  // ===================================================

  subtitle: {
    marginTop: 7,
    fontSize: 13,
    color: "#858585",
    fontWeight: "500",
  },

  // ===================================================
  // FORMULÁRIO
  // ===================================================

  form: {
    width: "100%",
    marginTop: 32,
  },

  // ===================================================
  // INPUT
  // ===================================================

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#F58427",
  },

  input: {
    width: "100%",
    height: 54,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#181818",
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#FFFFFF",
  },

  // ===================================================
  // SENHA
  // ===================================================

  passwordContainer: {
    width: "100%",
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#181818",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#FFFFFF",
  },

  showPasswordButton: {
    paddingHorizontal: 15,
  },

  showPasswordText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#777777",
  },

  // ===================================================
  // ESQUECI SENHA
  // ===================================================

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -5,
    marginBottom: 22,
  },

  forgotText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#F58427",
  },

  // ===================================================
  // BOTÃO ENTRAR
  // ===================================================

  loginButton: {
    width: "100%",
    height: 54,
    borderRadius: 11,
    backgroundColor: "#F58427",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#F58427",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },

  loginButtonText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  // ===================================================
  // SEPARADOR
  // ===================================================

  separatorContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 22,
  },

  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#292929",
  },

  separatorText: {
    marginHorizontal: 13,
    fontSize: 11,
    color: "#555555",
  },

  // ===================================================
  // CADASTRO
  // ===================================================

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
    fontSize: 12,
    color: "#777777",
  },

  registerLink: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "800",
    color: "#F58427",
  },

  // ===================================================
  // RODAPÉ
  // ===================================================

  footer: {
    position: "absolute",
    bottom: 27,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#444444",
  },
});
