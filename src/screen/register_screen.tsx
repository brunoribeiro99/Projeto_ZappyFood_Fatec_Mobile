import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  DimensionValue,
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

import { userService } from "./services/userService";

export default function CadastroScreen({ navigation, route }: any) {
  // =====================================================
  // TIPO DE CADASTRO (VEM DA TELA DE LOGIN)
  // =====================================================

  const isCompany = route?.params?.accountType === "company";

  // =====================================================
  // ESTADOS
  // =====================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Somente restaurante
  const [restaurantName, setRestaurantName] = useState("");
  const [cnpj, setCnpj] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Somente restaurante
  const [restaurantNameError, setRestaurantNameError] = useState("");
  const [cnpjError, setCnpjError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =====================================================
  // MODAL
  // =====================================================

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | "warning">(
    "success",
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
  // REGRAS DA SENHA
  // =====================================================

  const hasEightCharacters = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z\d]/.test(password);

  const passwordScore = [
    hasEightCharacters,
    hasUppercase,
    hasNumber,
    hasSymbol,
  ].filter(Boolean).length;

  const getPasswordStrength = () => {
    if (!password) {
      return {
        level: 0,
        text: "",
        color: "#333333",
        width: "0%" as DimensionValue,
      };
    }

    if (passwordScore <= 1) {
      return {
        level: 1,
        text: "Senha fraca",
        color: "#E53935",
        width: "33%" as DimensionValue,
      };
    }

    if (passwordScore <= 3) {
      return {
        level: 2,
        text: "Senha média",
        color: "#F58427",
        width: "66%" as DimensionValue,
      };
    }

    return {
      level: 3,
      text: "Senha forte",
      color: "#43A047",
      width: "100%" as DimensionValue,
    };
  };

  const passwordStrength = getPasswordStrength();

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
  // ALTERAÇÃO DO NOME
  // =====================================================

  const handleNameChange = (text: string) => {
    setName(text);

    if (nameError) {
      setNameError("");
    }
  };

  // =====================================================
  // ALTERAÇÃO DO NOME DO RESTAURANTE
  // =====================================================

  const handleRestaurantNameChange = (text: string) => {
    setRestaurantName(text);

    if (restaurantNameError) {
      setRestaurantNameError("");
    }
  };

  // =====================================================
  // MÁSCARA DO CNPJ
  // =====================================================

  const handleCnpjChange = (text: string) => {
    const digits = text.replace(/\D/g, "").substring(0, 14);

    let value = digits;

    if (digits.length > 12) {
      value = `${digits.substring(0, 2)}.${digits.substring(
        2,
        5,
      )}.${digits.substring(5, 8)}/${digits.substring(
        8,
        12,
      )}-${digits.substring(12)}`;
    } else if (digits.length > 8) {
      value = `${digits.substring(0, 2)}.${digits.substring(
        2,
        5,
      )}.${digits.substring(5, 8)}/${digits.substring(8)}`;
    } else if (digits.length > 5) {
      value = `${digits.substring(0, 2)}.${digits.substring(
        2,
        5,
      )}.${digits.substring(5)}`;
    } else if (digits.length > 2) {
      value = `${digits.substring(0, 2)}.${digits.substring(2)}`;
    }

    setCnpj(value);

    if (cnpjError) {
      setCnpjError("");
    }
  };

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
  // MÁSCARA DO CELULAR
  // =====================================================

  const handlePhoneChange = (text: string) => {
    let value = text.replace(/\D/g, "");

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length <= 2) {
      value = value;
    } else if (value.length <= 7) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else {
      value = `(${value.substring(0, 2)}) ${value.substring(
        2,
        7,
      )}-${value.substring(7)}`;
    }

    setPhone(value);

    if (phoneError) {
      setPhoneError("");
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

    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem.");
    } else if (confirmPassword && text === confirmPassword) {
      setConfirmPasswordError("");
    }
  };

  // =====================================================
  // ALTERAÇÃO DA CONFIRMAÇÃO DA SENHA
  // =====================================================

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);

    if (!text) {
      setConfirmPasswordError("");
      return;
    }

    if (text !== password) {
      setConfirmPasswordError("As senhas não coincidem.");
    } else {
      setConfirmPasswordError("");
    }
  };

  // =====================================================
  // VALIDAÇÃO DO NOME
  // =====================================================

  const validateName = () => {
    if (!name.trim()) {
      setNameError(
        isCompany ? "Informe o nome do responsável." : "Informe seu nome.",
      );
      return false;
    }

    if (name.trim().length < 3) {
      setNameError(
        isCompany
          ? "Digite o nome completo do responsável."
          : "Digite seu nome completo.",
      );
      return false;
    }

    setNameError("");
    return true;
  };

  // =====================================================
  // VALIDAÇÃO DO NOME DO RESTAURANTE
  // =====================================================

  const validateRestaurantName = () => {
    if (!restaurantName.trim()) {
      setRestaurantNameError("Informe o nome do restaurante.");
      return false;
    }

    if (restaurantName.trim().length < 2) {
      setRestaurantNameError("Digite o nome do restaurante.");
      return false;
    }

    setRestaurantNameError("");
    return true;
  };

  // =====================================================
  // VALIDAÇÃO DO CNPJ
  // =====================================================

  const validateCnpj = () => {
    const numbersOnly = cnpj.replace(/\D/g, "");

    if (!numbersOnly) {
      setCnpjError("Informe o CNPJ.");
      return false;
    }

    if (numbersOnly.length !== 14) {
      setCnpjError("O CNPJ deve ter 14 números.");
      return false;
    }

    setCnpjError("");
    return true;
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

    if (!emailRegex.test(email)) {
      setEmailError("Digite um e-mail válido.");
      return false;
    }

    setEmailError("");
    return true;
  };

  // =====================================================
  // VALIDAÇÃO DO CELULAR
  // =====================================================

  const validatePhone = () => {
    if (!phone.trim()) {
      setPhoneError("Informe seu celular.");
      return false;
    }

    const numbersOnly = phone.replace(/\D/g, "");

    if (numbersOnly.length !== 10 && numbersOnly.length !== 11) {
      setPhoneError("Digite um celular válido.");
      return false;
    }

    setPhoneError("");
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

    if (!hasEightCharacters) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres.");
      return false;
    }

    if (!hasUppercase) {
      setPasswordError("A senha deve conter pelo menos uma letra maiúscula.");
      return false;
    }

    if (!hasNumber) {
      setPasswordError("A senha deve conter pelo menos um número.");
      return false;
    }

    if (!hasSymbol) {
      setPasswordError("A senha deve conter pelo menos um símbolo.");
      return false;
    }

    setPasswordError("");
    return true;
  };

  // =====================================================
  // VALIDAÇÃO DA CONFIRMAÇÃO
  // =====================================================

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Confirme sua senha.");
      return false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem.");
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };

  // =====================================================
  // CADASTRAR (CLIENTE OU RESTAURANTE)
  // =====================================================

  const cadastrarUsuario = async () => {
    const nameIsValid = validateName();
    const restaurantNameIsValid = isCompany ? validateRestaurantName() : true;
    const cnpjIsValid = isCompany ? validateCnpj() : true;
    const emailIsValid = validateEmail();
    const phoneIsValid = validatePhone();
    const passwordIsValid = validatePassword();
    const confirmPasswordIsValid = validateConfirmPassword();

    // ===================================================
    // VALIDAÇÕES
    // ===================================================

    if (
      !nameIsValid ||
      !restaurantNameIsValid ||
      !cnpjIsValid ||
      !emailIsValid ||
      !phoneIsValid ||
      !passwordIsValid ||
      !confirmPasswordIsValid
    ) {
      showModal(
        "warning",
        "Atenção",
        "Por favor, verifique os dados informados.",
      );

      return;
    }

    // ===================================================
    // CADASTRO NO FIREBASE
    // ===================================================

    try {
      if (isCompany) {
        await userService.cadastrarRestaurante(
          restaurantName.trim(),
          name.trim(),
          cnpj.replace(/\D/g, ""),
          phone.trim(),
          email.trim(),
          password,
        );
      } else {
        await userService.cadastrarUsuario(
          name.trim(),
          phone.trim(),
          email.trim(),
          password,
        );
      }

      // =================================================
      // SUCESSO
      // =================================================

      showModal(
        "success",
        "Cadastro realizado!",
        isCompany
          ? "A conta do seu restaurante foi criada com sucesso."
          : "Sua conta foi criada com sucesso.",
      );
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);

      if (error?.code === "auth/email-already-in-use") {
        showModal("error", "Erro no cadastro", "Usuario ja cadastrado.");
        return;
      }

      showModal(
        "error",
        "Erro no cadastro",
        "Não foi possível concluir o cadastro. Tente novamente.",
      );
    }
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

  // =====================================================
  // COR DO MODAL
  // =====================================================

  const getModalColor = () => {
    if (modalType === "success") {
      return "#43A047";
    }

    if (modalType === "warning") {
      return "#F58427";
    }

    return "#E05A47";
  };

  // =====================================================
  // AÇÃO DO BOTÃO DO MODAL
  // =====================================================

  const handleModalButton = () => {
    setModalVisible(false);

    if (modalType === "success") {
      navigation.navigate("Login");
    }
  };

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
          CONTROLE DO TECLADO
          ================================================= */}

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

            <Text style={styles.title}>
              {isCompany ? "Cadastre seu restaurante" : "Crie sua conta"}
            </Text>

            <Text style={styles.subtitle}>
              {isCompany
                ? "Crie a conta do seu restaurante no Zappy Food."
                : "Cadastre-se para começar a usar o Zappy Food."}
            </Text>

            {/* =================================================
                FORMULÁRIO
                ================================================= */}

            <View style={styles.form}>
              {/* =================================================
                  NOME DO RESTAURANTE (SOMENTE RESTAURANTE)
                  ================================================= */}

              {isCompany && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>NOME DO RESTAURANTE</Text>

                  <TextInput
                    style={[
                      styles.input,
                      restaurantNameError && styles.inputError,
                    ]}
                    placeholder="Digite o nome do restaurante"
                    placeholderTextColor="#666666"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={restaurantName}
                    onChangeText={handleRestaurantNameChange}
                  />

                  {restaurantNameError !== "" && (
                    <Text style={styles.errorText}>{restaurantNameError}</Text>
                  )}
                </View>
              )}

              {/* =================================================
                  NOME
                  ================================================= */}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {isCompany ? "NOME DO RESPONSÁVEL" : "NOME"}
                </Text>

                <TextInput
                  style={[styles.input, nameError && styles.inputError]}
                  placeholder={
                    isCompany
                      ? "Digite o nome do responsável"
                      : "Digite seu nome"
                  }
                  placeholderTextColor="#666666"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={name}
                  onChangeText={handleNameChange}
                />

                {nameError !== "" && (
                  <Text style={styles.errorText}>{nameError}</Text>
                )}
              </View>

              {/* =================================================
                  CNPJ (SOMENTE RESTAURANTE)
                  ================================================= */}

              {isCompany && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>CNPJ</Text>

                  <TextInput
                    style={[styles.input, cnpjError && styles.inputError]}
                    placeholder="00.000.000/0000-00"
                    placeholderTextColor="#666666"
                    keyboardType="number-pad"
                    value={cnpj}
                    onChangeText={handleCnpjChange}
                    maxLength={18}
                  />

                  {cnpjError !== "" && (
                    <Text style={styles.errorText}>{cnpjError}</Text>
                  )}
                </View>
              )}

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
                  CELULAR
                  ================================================= */}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>CELULAR</Text>

                <TextInput
                  style={[styles.input, phoneError && styles.inputError]}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#666666"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={handlePhoneChange}
                  maxLength={15}
                />

                {phoneError !== "" && (
                  <Text style={styles.errorText}>{phoneError}</Text>
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
                    placeholder="Crie uma senha"
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

                {/* =================================================
                    BARRA DE FORÇA DA SENHA
                    ================================================= */}

                {password !== "" && (
                  <View style={styles.passwordStrengthContainer}>
                    <View style={styles.passwordBarBackground}>
                      <View
                        style={[
                          styles.passwordBar,
                          {
                            width: passwordStrength.width,
                            backgroundColor: passwordStrength.color,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.passwordStrengthText,
                        {
                          color: passwordStrength.color,
                        },
                      ]}
                    >
                      {passwordStrength.text}
                    </Text>
                  </View>
                )}

                {passwordError !== "" && (
                  <Text style={styles.errorText}>{passwordError}</Text>
                )}
              </View>

              {/* =================================================
                  CONFIRMAR SENHA
                  ================================================= */}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>CONFIRMAR SENHA</Text>

                <View
                  style={[
                    styles.passwordContainer,

                    confirmPasswordError && styles.passwordContainerError,

                    confirmPassword &&
                      !confirmPasswordError &&
                      styles.passwordContainerSuccess,
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Digite sua senha novamente"
                    placeholderTextColor="#666666"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                  />

                  <Pressable
                    style={styles.showPasswordButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text style={styles.showPasswordText}>
                      {showConfirmPassword ? "OCULTAR" : "VER"}
                    </Text>
                  </Pressable>
                </View>

                {confirmPassword && !confirmPasswordError && (
                  <Text style={styles.passwordMatch}>✓ Senhas iguais</Text>
                )}

                {confirmPasswordError !== "" && (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                )}
              </View>

              {/* =================================================
                  BOTÃO CADASTRAR
                  ================================================= */}

              <Pressable
                style={({ pressed }) => [
                  styles.registerButton,
                  pressed && styles.registerButtonPressed,
                ]}
                onPress={cadastrarUsuario}
              >
                <Text style={styles.registerButtonText}>
                  {isCompany ? "CADASTRAR RESTAURANTE" : "CRIAR CONTA"}
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
                  VOLTAR PARA LOGIN
                  ================================================= */}

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Já possui uma conta?</Text>

                <Pressable onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Entrar</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* =================================================
          RODAPÉ
          ================================================= */}

      <Text style={styles.footer}>ZAPPY FOOD</Text>

      {/* =================================================
          MODAL
          ================================================= */}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* =================================================
                ÍCONE
                ================================================= */}

            <View
              style={[
                styles.modalIcon,
                {
                  backgroundColor: getModalColor(),
                },
              ]}
            >
              <Text style={styles.modalIconText}>{getModalIcon()}</Text>
            </View>

            {/* =================================================
                TÍTULO
                ================================================= */}

            <Text style={styles.modalTitle}>{modalTitle}</Text>

            {/* =================================================
                MENSAGEM
                ================================================= */}

            <Text style={styles.modalMessage}>{modalMessage}</Text>

            {/* =================================================
                BOTÃO
                ================================================= */}

            <Pressable
              style={({ pressed }) => [
                styles.modalButton,
                {
                  backgroundColor: getModalColor(),
                },
                pressed && styles.modalButtonPressed,
              ]}
              onPress={handleModalButton}
            >
              <Text style={styles.modalButtonText}>
                {modalType === "success" ? "CONTINUAR" : "ENTENDI"}
              </Text>
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
  // CONTROLE DO TECLADO
  // ===================================================

  keyboardContainer: {
    flex: 1,
    width: "100%",
  },

  // ===================================================
  // SCROLL
  // ===================================================

  scrollContent: {
    flexGrow: 1,
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
    zIndex: 2,
  },

  // ===================================================
  // CONTEÚDO
  // ===================================================

  content: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    marginTop: 35,
    paddingBottom: 90,
  },

  // ===================================================
  // LOGO
  // ===================================================

  logo: {
    width: 82,
    height: 82,
    resizeMode: "contain",
  },

  // ===================================================
  // TÍTULO
  // ===================================================

  title: {
    marginTop: 8,
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },

  // ===================================================
  // SUBTÍTULO
  // ===================================================

  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: "#858585",
    fontWeight: "500",
    textAlign: "center",
  },

  // ===================================================
  // FORMULÁRIO
  // ===================================================

  form: {
    width: "100%",
    marginTop: 22,
  },

  // ===================================================
  // INPUT
  // ===================================================

  inputContainer: {
    marginBottom: 13,
  },

  label: {
    marginBottom: 7,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#F58427",
  },

  input: {
    width: "100%",
    height: 50,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#181818",
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#FFFFFF",
  },

  // ===================================================
  // INPUT COM ERRO
  // ===================================================

  inputError: {
    borderColor: "#E05A47",
  },

  errorText: {
    marginTop: 5,
    fontSize: 10,
    color: "#E05A47",
    fontWeight: "600",
  },

  // ===================================================
  // SENHA
  // ===================================================

  passwordContainer: {
    width: "100%",
    height: 50,
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

  passwordContainerSuccess: {
    borderColor: "#43A047",
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
    paddingVertical: 14,
  },

  showPasswordText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#777777",
  },

  // ===================================================
  // BARRA DE FORÇA DA SENHA
  // ===================================================

  passwordStrengthContainer: {
    marginTop: 8,
  },

  passwordBarBackground: {
    width: "100%",
    height: 5,
    backgroundColor: "#292929",
    borderRadius: 10,
    overflow: "hidden",
  },

  passwordBar: {
    height: "100%",
    borderRadius: 10,
  },

  passwordStrengthText: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: "700",
  },

  // ===================================================
  // CONFIRMAÇÃO DA SENHA
  // ===================================================

  passwordMatch: {
    marginTop: 5,
    fontSize: 10,
    color: "#43A047",
    fontWeight: "700",
  },

  // ===================================================
  // BOTÃO CADASTRAR
  // ===================================================

  registerButton: {
    width: "100%",
    height: 52,
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

  registerButtonPressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  registerButtonText: {
    color: "#111111",
    fontSize: 14,
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
    marginTop: 20,
    marginBottom: 18,
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
  // LOGIN
  // ===================================================

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    fontSize: 12,
    color: "#777777",
  },

  loginLink: {
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

  // ===================================================
  // MODAL — FUNDO
  // ===================================================

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  // ===================================================
  // MODAL — CARD
  // ===================================================

  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#181818",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#333333",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },

  // ===================================================
  // MODAL — ÍCONE
  // ===================================================

  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  modalIconText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },

  // ===================================================
  // MODAL — TÍTULO
  // ===================================================

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },

  // ===================================================
  // MODAL — MENSAGEM
  // ===================================================

  modalMessage: {
    color: "#999999",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },

  // ===================================================
  // MODAL — BOTÃO
  // ===================================================

  modalButton: {
    width: "100%",
    height: 48,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
