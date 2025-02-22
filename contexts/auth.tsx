import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/useToast';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/DesignSystem';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
type AuthContextData = {
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  signUp: (data: { email: string; password: string; name: string }) => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

// Criação do contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const { showToast } = useToast();

  // Função para verificar e atualizar a sessão
  const checkAndUpdateSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        setSession(null);
        return;
      }

      // Se a sessão mudou, atualiza
      if (JSON.stringify(currentSession) !== JSON.stringify(session)) {
        setSession(currentSession);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      setSession(null);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  // Efeito para verificação inicial da sessão e navegação
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        // Mantém o loading até ter certeza do estado
        setIsLoading(true);

        // Verifica a sessão antes de qualquer coisa
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error('Erro ao verificar sessão:', error);
          setSession(null);
        } else {
          setSession(currentSession);
        }

        // Marca como inicializado antes de remover o loading
        setIsInitialized(true);

        // Pequeno delay antes de remover o loading para garantir que tudo está pronto
        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, 100);

      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        if (isMounted) {
          setSession(null);
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Efeito para navegação baseada no estado da sessão
  useEffect(() => {
    // Só executa quando já estiver inicializado e não estiver carregando
    if (!isInitialized || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const shouldBeInAuth = !session;

    // Se está na rota errada, navega
    if (shouldBeInAuth && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (!shouldBeInAuth && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isInitialized, isLoading, session, segments]);

  // Efeito para monitorar mudanças na sessão
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {      
      if (event === 'SIGNED_IN') {
        setSession(newSession);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(newSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    // Verifica a existência da conta a cada 5 minutos
    const checkInterval = setInterval(async () => {
      try {
        const { data: user, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.error('Erro ao verificar usuário:', error);
          showToast({
            type: 'info',
            message: 'Conta não encontrada',
            description: 'Sua conta foi excluída. Você será desconectado.',
          });
          
          await signOut();
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => {
      clearInterval(checkInterval);
    };
  }, [session]);

  const signUp = async ({ email, password, name }: { email: string; password: string; name: string }) => {
    try {
      setIsLoading(true);
      
      // Validação dos campos
      if (!email || !password || !name) {
        showToast({
          type: 'warning',
          message: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos.',
        });
        return;
      }

      if (password.length < 6) {
        showToast({
          type: 'warning',
          message: 'Senha muito curta',
          description: 'A senha deve ter pelo menos 6 caracteres.',
        });
        return;
      }
      
      const emailLowerCase = email.toLowerCase().trim();

      // Verifica se o usuário já existe
      const { error: checkError } = await supabase.auth.signInWithPassword({
        email: emailLowerCase,
        password: 'dummy-password-for-check',
      });

      if (!checkError || !checkError.message.includes('Invalid login credentials')) {
        showToast({
          type: 'info',
          message: 'Email já cadastrado',
          description: 'Uma conta com este email já existe. Por favor, faça login.',
        });
        
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 1500);
        return;
      }

      // Tenta criar o usuário
      const { data, error } = await supabase.auth.signUp({
        email: emailLowerCase,
        password,
        options: {
          data: {
            name,
            display_name: name,
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);

        if (error.message?.toLowerCase().includes('password')) {
          showToast({
            type: 'error',
            message: 'Senha inválida',
            description: 'A senha deve ter pelo menos 6 caracteres.',
          });
          return;
        }

        if (error.message?.toLowerCase().includes('email')) {
          showToast({
            type: 'error',
            message: 'Email inválido',
            description: 'Por favor, insira um email válido.',
          });
          return;
        }

        showToast({
          type: 'error',
          message: 'Erro no cadastro',
          description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        });
        return;
      }

      if (!data.user) {
        showToast({
          type: 'error',
          message: 'Erro no cadastro',
          description: 'Não foi possível criar sua conta. Por favor, tente novamente.',
        });
        return;
      }

      showToast({
        type: 'success',
        message: 'Conta criada com sucesso!',
        description: 'Redirecionando para o login...',
      });

      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);

    } catch (error) {
      showToast({
        type: 'error',
        message: 'Erro no sistema',
        description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      setIsLoading(true);

      // Validação dos campos
      if (!email || !password) {
        showToast({
          type: 'warning',
          message: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos.',
        });
        return;
      }
      
      const emailLowerCase = email.toLowerCase().trim();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLowerCase,
        password,
      });

      if (error) {
        if (error.message?.toLowerCase().includes('invalid login credentials')) {
          showToast({
            type: 'error',
            message: 'Credenciais inválidas',
            description: 'Email ou senha incorretos.',
          });
          return;
        }

        showToast({
          type: 'error',
          message: 'Erro no login',
          description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        });
        return;
      }

      if (!data?.session) {
        showToast({
          type: 'error',
          message: 'Erro no login',
          description: 'Não foi possível iniciar sua sessão. Por favor, tente novamente.',
        });
        return;
      }

      setSession(data.session);

      showToast({
        type: 'success',
        message: 'Login realizado com sucesso!',
        description: 'Bem-vindo de volta!',
      });

      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 100);

    } catch (error) {
      showToast({
        type: 'error',
        message: 'Erro no sistema',
        description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('🔑 Iniciando processo de logout...');

      // Lista de todas as chaves que precisamos limpar
      const storageKeys = [
        'supabase.auth.token',
        'supabase.auth.refreshToken',
        'supabase.auth.session',
        'sb-' + process.env.EXPO_PUBLIC_SUPABASE_URL + '-auth-token',
        'supabase.auth.expires_at',
        'supabase.auth.provider_token',
        'supabase.auth.provider_refresh_token'
      ];

      // Limpa o storage primeiro
      console.log('🔑 Iniciando limpeza do storage...');
      if (Platform.OS === 'web') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.auth') || key.startsWith('sb-')) {
            try {
              localStorage.removeItem(key);
              console.log(`✅ Storage web: ${key} removido`);
            } catch (e) {
              console.log(`⚠️ Erro ao remover ${key}:`, e);
            }
          }
        });
      } else {
        await Promise.all(
          storageKeys.map(async (key) => {
            try {
              await AsyncStorage.removeItem(key);
              console.log(`✅ Storage nativo: ${key} removido`);
            } catch (e) {
              console.log(`⚠️ Erro ao remover ${key}:`, e);
            }
          })
        );
      }

      try {
        await supabase.auth.signOut();
      } catch (error: any) {
        console.log('⚠️ Erro no signOut do Supabase:', error);
      }

      // Limpa o estado local
      setSession(null);

      showToast({
        type: 'success',
        message: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });

      // Adiciona um pequeno delay antes de navegar
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 100);

    } catch (error) {
      showToast({
        type: 'error',
        message: 'Erro no sistema',
        description: 'Ocorreu um erro inesperado, mas você foi desconectado.',
      });
      setSession(null);
      
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading screen
  if (!isInitialized || isLoading) {
    return (
      <View 
        style={{ 
          flex: 1, 
          backgroundColor: COLORS.light.primaryBackground,
          justifyContent: 'center',
          alignItems: 'center'
        }} 
      >
        <ActivityIndicator size="large" color={COLORS.light.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isInitialized,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 