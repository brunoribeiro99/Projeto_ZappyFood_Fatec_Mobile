import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { get, ref } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, database as db } from "./services/firebaseConfig";

type AccountType = "client" | "company";

export default function LoginScreen({ navigation }: any) {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // =====================================================
  // TIPO DE ACESSO (CLIENTE OU RESTAURANTE)
  // =====================================================

  const [accountType, setAccountType] = useState<AccountType>("client");

  const isCompany = accountType === "company";

  // =====================================================
  // ESTADOS DO MODAL
  // =====================================================

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | "warning">(
    "error",
  );
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // =====================================================
  // FUNÇÃO DO MODAL
  // =====================================================

  const showModal = (
    type: "success" | "error" | "warning",
    title: string,
    message: string,
  ) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

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
  // ALTERAÇÃO DO E-MAIL
  // =====================================================

  const handleEmailChange = (text: string) => {
    const value = text.replace(/\s/g, "").toLowerCase();

    setEmail(value);

    if (emailError) {
      setEmailError("");
    }
  };

  // =====================================================
  // ALTERAÇÃO DA SENHA
  // =====================================================

  const handlePasswordChange = (text: string) => {
    setPassword(text);

    if (passwordError) {
      setPasswordError("");
    }
  };

  // =====================================================
  // VALIDAÇÃO DO E-MAIL
  // =====================================================

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Informe seu e-mail.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setEmailError("Digite um e-mail válido.");
      return false;
    }

    setEmailError("");
    return true;
  };

  // =====================================================
  // VALIDAÇÃO DA SENHA
  // =====================================================

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Informe sua senha.");
      return false;
    }

    setPasswordError("");
    return true;
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async () => {
    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();

    if (!emailIsValid || !passwordIsValid) {
      return;
    }

    try {
      console.log("Tentando autenticar no Firebase...");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      console.log("Login realizado:", userCredential.user.uid);

      // =====================================================
      // CONFERÊNCIA DO TIPO DE CONTA (REALTIME DATABASE)
      // =====================================================

      const uid = userCredential.user.uid;

      const [clientSnap, companySnap] = await Promise.all([
        get(ref(db, `clientes/${uid}`)),
        get(ref(db, `restaurantes/${uid}`)),
      ]);

      const savedType: AccountType | null = companySnap.exists()
        ? "company"
        : clientSnap.exists()
          ? "client"
          : null;

      if (savedType && savedType !== accountType) {
        await signOut(auth);
        showModal(
          "warning",
          "Tipo de conta diferente",
          savedType === "company"
            ? 'Essa conta é de restaurante. Escolha "Restaurante" para entrar.'
            : 'Essa conta é de cliente. Escolha "Cliente" para entrar.',
        );
        return;
      }

      // =====================================================
      // REDIRECIONAMENTO PARA O DASHBOARD CORRETO
      // =====================================================

      navigation.reset({
        index: 0,
        routes: [
          {
            name: isCompany ? "DashboardRestaurante" : "DashboardCliente",
          },
        ],
      });
    } catch (error: any) {
      console.log("Erro no login Firebase:", error);

      // =====================================================
      // QUALQUER ERRO DE CREDENCIAL
      // =====================================================

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-login-credentials" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        showModal(
          "error",
          "Não foi possível entrar",
          "E-mail ou senha incorretos.",
        );

        return;
      }

      // =====================================================
      // E-MAIL INVÁLIDO
      // =====================================================

      if (error.code === "auth/invalid-email") {
        showModal(
          "warning",
          "E-mail inválido",
          "Digite um endereço de e-mail válido para continuar.",
        );

        return;
      }

      // =====================================================
      // MUITAS TENTATIVAS
      // =====================================================

      if (error.code === "auth/too-many-requests") {
        showModal(
          "warning",
          "Muitas tentativas",
          "Foram detectadas muitas tentativas de login. Aguarde alguns minutos e tente novamente.",
        );

        return;
      }

      // =====================================================
      // ERRO DESCONHECIDO
      // =====================================================

      showModal(
        "error",
        "Erro ao entrar",
        "Não foi possível realizar o login. Tente novamente.",
      );
    }
  };

  // =====================================================
  // ESQUECI A SENHA
  // =====================================================

  const handleForgotPassword = () => {
    showModal(
      "warning",
      "Esqueci minha senha",
      "Informe seu e-mail para recuperar sua senha.",
    );
  };

  // =====================================================
  // ÍCONE DO MODAL
  // =====================================================

  const getModalIcon = () => {
    if (modalType === "success") {
      return "✓";
    }

    if (modalType === "warning") {
      return "!";
    }

    return "×";
  };

  const getModalIconColor = () => {
    if (modalType === "success") {
      return "#43A047";
    }

    if (modalType === "warning") {
      return "#F58427";
    }

    return "#E05A47";
  };

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <View style={styles.container}>
      <View style={styles.topAccent} />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

            <Text style={styles.subtitle}>
              {isCompany
                ? "Acesse o painel do seu restaurante."
                : "Entre na sua conta para continuar."}
            </Text>

            {/* =================================================
            SELETOR: CLIENTE OU RESTAURANTE
            ================================================= */}

            <View style={styles.selectorWrapper}>
              <Text style={styles.label}>ENTRAR COMO</Text>

              <View style={styles.selectorRow}>
                {/* CLIENTE */}
                <Pressable
                  onPress={() => setAccountType("client")}
                  style={({ pressed }) => [
                    styles.typeCard,
                    !isCompany && styles.typeCardSelected,
                    pressed && styles.typeCardPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.typeIconCircle,
                      !isCompany && styles.typeIconCircleSelected,
                    ]}
                  >
                    <Text style={styles.typeIcon}>🍽️</Text>
                  </View>

                  <Text
                    style={[
                      styles.typeTitle,
                      !isCompany && styles.typeTitleSelected,
                    ]}
                  >
                    CLIENTE
                  </Text>

                  <Text style={styles.typeDescription}>
                    Reserve mesas e faça pedidos
                  </Text>

                  {!isCompany && (
                    <View style={styles.typeCheck}>
                      <Text style={styles.typeCheckText}>✓</Text>
                    </View>
                  )}
                </Pressable>

                {/* RESTAURANTE */}
                <Pressable
                  onPress={() => setAccountType("company")}
                  style={({ pressed }) => [
                    styles.typeCard,
                    isCompany && styles.typeCardSelected,
                    pressed && styles.typeCardPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.typeIconCircle,
                      isCompany && styles.typeIconCircleSelected,
                    ]}
                  >
                    <Text style={styles.typeIcon}>🏪</Text>
                  </View>

                  <Text
                    style={[
                      styles.typeTitle,
                      isCompany && styles.typeTitleSelected,
                    ]}
                  >
                    RESTAURANTE
                  </Text>

                  <Text style={styles.typeDescription}>
                    Gerencie pedidos e o salão
                  </Text>

                  {isCompany && (
                    <View style={styles.typeCheck}>
                      <Text style={styles.typeCheckText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            {/* =================================================
            FORMULÁRIO
            ================================================= */}

            <View style={styles.form}>
              {/* =================================================
              E-MAIL
              ================================================= */}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>E-MAIL</Text>

                <TextInput
                  style={[styles.input, emailError && styles.inputError]}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#666666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  value={email}
                  onChangeText={handleEmailChange}
                />

                {emailError !== "" && (
                  <Text style={styles.errorText}>{emailError}</Text>
                )}
              </View>

              {/* =================================================
              SENHA
              ================================================= */}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>SENHA</Text>

                <View
                  style={[
                    styles.passwordContainer,
                    passwordError && styles.passwordContainerError,
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#666666"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={password}
                    onChangeText={handlePasswordChange}
                  />

                  <Pressable
                    style={styles.showPasswordButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.showPasswordText}>
                      {showPassword ? "OCULTAR" : "VER"}
                    </Text>
                  </Pressable>
                </View>

                {passwordError !== "" && (
                  <Text style={styles.errorText}>{passwordError}</Text>
                )}
              </View>

              {/* =================================================
              ESQUECI A SENHA
              ================================================= */}

              <Pressable
                style={styles.forgotButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </Pressable>

              {/* =================================================
              BOTÃO ENTRAR
              ================================================= */}

              <Pressable
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed && styles.loginButtonPressed,
                ]}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>
                  {isCompany
                    ? "ENTRAR COMO RESTAURANTE"
                    : "ENTRAR COMO CLIENTE"}
                </Text>
              </Pressable>

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

                <Pressable
                  onPress={() =>
                    navigation.navigate("Register", { accountType })
                  }
                >
                  <Text style={styles.registerLink}>Cadastre-se</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* =================================================
          RODAPÉ
          ================================================= */}

          <Text style={styles.footer}>ZAPPY FOOD</Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* =====================================================
      MODAL
      ===================================================== */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalIcon,
                {
                  backgroundColor: `${getModalIconColor()}18`,
                },
              ]}
            >
              <Text
                style={[
                  styles.modalIconText,
                  {
                    color: getModalIconColor(),
                  },
                ]}
              >
                {getModalIcon()}
              </Text>
            </View>

            <Text style={styles.modalTitle}>{modalTitle}</Text>

            <Text style={styles.modalMessage}>{modalMessage}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.modalButton,
                pressed && styles.modalButtonPressed,
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>ENTENDI</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    alignItems: "center",
  },

  keyboardContainer: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
  },

  topAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#F58427",
    zIndex: 10,
  },

  content: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 55,
  },

  logo: {
    width: 105,
    height: 105,
    resizeMode: "contain",
  },

  title: {
    marginTop: 12,
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 7,
    fontSize: 13,
    color: "#858585",
    fontWeight: "500",
    textAlign: "center",
  },

  selectorWrapper: {
    width: "100%",
    marginTop: 28,
  },

  selectorRow: {
    flexDirection: "row",
    gap: 12,
  },

  typeCard: {
    flex: 1,
    minHeight: 138,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: "#181818",
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  typeCardSelected: {
    borderColor: "#F58427",
    backgroundColor: "#1F1710",
  },

  typeCardPressed: {
    opacity: 0.8,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  typeIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  typeIconCircleSelected: {
    backgroundColor: "#2B1D10",
  },

  typeIcon: {
    fontSize: 22,
  },

  typeTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#A7A7A7",
  },

  typeTitleSelected: {
    color: "#FFFFFF",
  },

  typeDescription: {
    marginTop: 5,
    fontSize: 10,
    lineHeight: 14,
    textAlign: "center",
    color: "#6E6E6E",
  },

  typeCheck: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F58427",
    alignItems: "center",
    justifyContent: "center",
  },

  typeCheckText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
  },

  form: {
    width: "100%",
    marginTop: 24,
  },

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

  inputError: {
    borderColor: "#E05A47",
  },

  errorText: {
    marginTop: 6,
    fontSize: 10,
    color: "#E05A47",
    fontWeight: "600",
    lineHeight: 14,
  },

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

  passwordContainerError: {
    borderColor: "#E05A47",
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
    paddingVertical: 15,
  },

  showPasswordText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#777777",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 2,
    marginBottom: 22,
  },

  forgotText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#F58427",
  },

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

  loginButtonPressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  loginButtonText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },

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

  footer: {
    marginTop: 35,
    marginBottom: 27,
    alignSelf: "center",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#444444",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#181818",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#292929",
    paddingHorizontal: 25,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: "center",
  },

  modalIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },

  modalIconText: {
    fontSize: 30,
    fontWeight: "900",
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 9,
  },

  modalMessage: {
    color: "#8C8C8C",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 23,
  },

  modalButton: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    backgroundColor: "#F58427",
    alignItems: "center",
    justifyContent: "center",
  },

  modalButtonPressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  modalButtonText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
