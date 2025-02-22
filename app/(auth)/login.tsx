import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ActivityIndicator, Platform, Keyboard } from 'react-native';
import { Link } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, BREAKPOINTS } from '@/constants/DesignSystem';
import { useTheme } from '@/hooks/ThemeContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useWindowDimensions } from 'react-native';
import { getTypographyForBreakpoint } from '@/constants/DesignSystem';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/useToast';
import { Eye, EyeOff } from 'lucide-react-native';
import { AuthImage } from '@/components/AuthImage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const { currentTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isDesktopOrTablet = width >= BREAKPOINTS.tablet;
  const typography = getTypographyForBreakpoint(width);
  const { signIn, isLoading } = useAuth();
  const { showToast } = useToast();

  const inputStyle = [
    styles.input,
    { 
      backgroundColor: COLORS[currentTheme].primaryBackground,
      color: COLORS[currentTheme].primaryText,
      borderColor: COLORS[currentTheme].divider,
      ...(Platform.OS === 'web' ? { outline: 'none' } : {}),
    }
  ];

  const handleLogin = async () => {
    try {
      // Validação dos campos obrigatórios
      if (!email || !senha) {
        showToast({
          type: 'warning',
          message: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos.',
        });
        return;
      }

      await signIn({ email, password: senha });
    } catch (error) {
      // Removido o console.error para não mostrar o erro adicional
    }
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web' && e.key === 'Enter') {
      handleLogin();
    }
  };

  const handlePressOutside = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  return (
    <ThemedView 
      style={[
        styles.container, 
        { backgroundColor: COLORS[currentTheme].primaryBackground }
      ]} 
      onTouchStart={handlePressOutside}
    >
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={[styles.formContainer, isDesktopOrTablet && styles.formContainerDesktop]}>
          <ThemedText style={[typography.title, styles.title]}>
            Bem-vindo de volta!
          </ThemedText>
          
          <ThemedText style={[typography.body, styles.subtitle]}>
            Entre com suas credenciais para acessar sua conta
          </ThemedText>

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
              textContentType="password"
              autoComplete="current-password"
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

          <Pressable
            style={[
              styles.button,
              { 
                backgroundColor: COLORS[currentTheme].primary,
                opacity: isLoading ? 0.7 : isHovered ? 0.8 : 1,
              }
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)}
            onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={[typography.bodySemiBold, styles.buttonText]}>
                Entrar
              </ThemedText>
            )}
          </Pressable>

          <ThemedView style={styles.footer}>
            <ThemedText style={typography.body}>
              Ainda não tem uma conta?{' '}
            </ThemedText>
            <Link href="/register" asChild>
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
                  Cadastre-se
                </ThemedText>
              </Pressable>
            </Link>
          </ThemedView>
        </ThemedView>

        {isDesktopOrTablet && (
          <ThemedView style={styles.imageContainer}>
            <AuthImage type="login" />
          </ThemedView>
        )}
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