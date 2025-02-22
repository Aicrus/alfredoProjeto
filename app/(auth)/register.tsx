import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ActivityIndicator, Platform, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, BREAKPOINTS } from '@/constants/DesignSystem';
import { useTheme } from '@/hooks/ThemeContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useWindowDimensions } from 'react-native';
import { getTypographyForBreakpoint } from '@/constants/DesignSystem';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/useToast';
import { Eye, EyeOff } from 'lucide-react-native';
import { AuthImage } from '@/components/AuthImage';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const { currentTheme } = useTheme();
  const { width } = useWindowDimensions();
  const typography = getTypographyForBreakpoint(width);
  const { signUp, isLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const inputStyle = [
    styles.input,
    { 
      backgroundColor: COLORS[currentTheme].primaryBackground,
      color: COLORS[currentTheme].primaryText,
      borderColor: COLORS[currentTheme].divider,
      ...(Platform.OS === 'web' ? { outline: 'none' } : {}),
    }
  ];

  const handleRegister = async () => {
    try {
      // Validações
      if (!nome || !email || !senha || !confirmarSenha) {
        showToast({
          type: 'warning',
          message: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos.',
        });
        return;
      }

      if (senha !== confirmarSenha) {
        showToast({
          type: 'error',
          message: 'Senhas diferentes',
          description: 'As senhas não coincidem.',
        });
        return;
      }

      if (senha.length < 6) {
        showToast({
          type: 'warning',
          message: 'Senha muito curta',
          description: 'A senha deve ter pelo menos 6 caracteres.',
        });
        return;
      }

      await signUp({ email, password: senha, name: nome });
      showToast({
        type: 'success',
        message: 'Cadastro realizado!',
        description: 'Sua conta foi criada com sucesso. Faça login para continuar.',
      });
      
      // Navega para a tela de login após um pequeno delay para o usuário ver a mensagem de sucesso
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch (error: any) {
      // Log detalhado do erro para debug
      console.error('Erro detalhado no cadastro:', {
        message: error.message,
        code: error.code,
        details: error.details,
        status: error.status,
        name: error.name,
        error: error
      });

      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        showToast({
          type: 'info',
          message: 'Email já cadastrado',
          description: 'Uma conta com este email já existe. Por favor, faça login para acessar.',
        });
        
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
        return;
      }

      // Tratamento específico para erros do Supabase
      if (error?.message?.toLowerCase().includes('invalid email') || 
          error?.message?.toLowerCase().includes('email format is invalid')) {
        showToast({
          type: 'error',
          message: 'Email inválido',
          description: 'Por favor, insira um endereço de email válido.',
        });
        return;
      }

      if (error?.message?.toLowerCase().includes('password') && 
          error?.message?.toLowerCase().includes('characters')) {
        showToast({
          type: 'error',
          message: 'Senha inválida',
          description: 'A senha deve ter pelo menos 6 caracteres.',
        });
        return;
      }

      if (error?.message?.toLowerCase().includes('network') || 
          error?.message?.toLowerCase().includes('connection') ||
          error?.code === 'NETWORK_ERROR') {
        showToast({
          type: 'error',
          message: 'Erro de conexão',
          description: 'Verifique sua conexão com a internet e tente novamente.',
        });
        return;
      }

      if (error?.message?.toLowerCase().includes('timeout')) {
        showToast({
          type: 'error',
          message: 'Tempo excedido',
          description: 'O servidor demorou para responder. Por favor, tente novamente.',
        });
        return;
      }

      if (error?.message?.toLowerCase().includes('rate limit') || 
          error?.status === 429) {
        showToast({
          type: 'error',
          message: 'Muitas tentativas',
          description: 'Por favor, aguarde alguns minutos antes de tentar novamente.',
        });
        return;
      }

      // Se chegou aqui, é um erro não mapeado
      showToast({
        type: 'error',
        message: 'Não foi possível criar sua conta',
        description: 'Por favor, verifique seus dados e tente novamente.',
      });
    }
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web' && e.key === 'Enter') {
      handleRegister();
    }
  };

  const handlePressOutside = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  const isDesktopOrTablet = width >= BREAKPOINTS.tablet;

  return (
    <ThemedView 
      style={[
        styles.container, 
        { backgroundColor: COLORS[currentTheme].primaryBackground }
      ]} 
      onTouchStart={handlePressOutside}
    >
      <ThemedView style={styles.contentContainer}>
        {isDesktopOrTablet && (
          <ThemedView style={styles.imageContainer}>
            <AuthImage type="register" />
          </ThemedView>
        )}

        <ThemedView style={[styles.formContainer, isDesktopOrTablet && styles.formContainerDesktop]}>
          <ThemedText style={[typography.title, styles.title]}>
            Crie sua conta
          </ThemedText>
          
          <ThemedText style={[typography.body, styles.subtitle]}>
            Preencha seus dados para começar
          </ThemedText>

          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={inputStyle}
              placeholder="Nome completo"
              placeholderTextColor={COLORS[currentTheme].icon}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              editable={!isLoading}
              onKeyPress={handleKeyPress}
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={inputStyle}
              placeholder="E-mail"
              placeholderTextColor={COLORS[currentTheme].icon}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
              onKeyPress={handleKeyPress}
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={inputStyle}
              placeholder="Senha"
              placeholderTextColor={COLORS[currentTheme].icon}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showPassword}
              editable={!isLoading}
              onKeyPress={handleKeyPress}
              textContentType="newPassword"
              passwordRules="minlength: 6;"
              autoComplete="new-password"
            />
            <Pressable 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff size={20} color={COLORS[currentTheme].icon} />
              ) : (
                <Eye size={20} color={COLORS[currentTheme].icon} />
              )}
            </Pressable>
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={inputStyle}
              placeholder="Confirmar senha"
              placeholderTextColor={COLORS[currentTheme].icon}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
              onKeyPress={handleKeyPress}
              textContentType="newPassword"
              passwordRules="minlength: 6;"
              autoComplete="new-password"
            />
            <Pressable 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={COLORS[currentTheme].icon} />
              ) : (
                <Eye size={20} color={COLORS[currentTheme].icon} />
              )}
            </Pressable>
          </ThemedView>

          <Pressable
            style={[
              styles.button,
              { 
                backgroundColor: COLORS[currentTheme].primary,
                opacity: isLoading ? 0.7 : isHovered ? 0.8 : 1,
              }
            ]}
            onPress={handleRegister}
            disabled={isLoading}
            onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)}
            onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={[typography.bodySemiBold, styles.buttonText]}>
                Criar conta
              </ThemedText>
            )}
          </Pressable>

          <ThemedView style={styles.footer}>
            <ThemedText style={typography.body}>
              Já tem uma conta?{' '}
            </ThemedText>
            <Link href="/login" asChild>
              <Pressable 
                disabled={isLoading}
                onHoverIn={() => Platform.OS === 'web' && setIsLinkHovered(true)}
                onHoverOut={() => Platform.OS === 'web' && setIsLinkHovered(false)}
              >
                <ThemedText 
                  style={[
                    typography.bodySemiBold, 
                    { 
                      color: COLORS[currentTheme].primary,
                      opacity: isLinkHovered ? 0.8 : 1,
                      ...(Platform.OS === 'web' ? {
                        transition: 'all 0.2s ease-in-out',
                      } : {}),
                    }
                  ]}
                >
                  Faça login
                </ThemedText>
              </Pressable>
            </Link>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  formContainerDesktop: {
    maxWidth: '50%',
  },
  imageContainer: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 400,
    marginBottom: SPACING.md,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.md,
    top: 12,
    padding: SPACING.xs,
  },
  button: {
    width: '100%',
    maxWidth: 400,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    } : {}),
  },
  buttonText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
}); 