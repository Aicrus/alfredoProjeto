import { TextStyle } from 'react-native';

// Breakpoints do Sistema
export const BREAKPOINTS = {
  mobile: 0,    // De 0 até 742px
  tablet: 742,  // De 742px até 1024px
  desktop: 1024 // 1024px ou mais
} as const;

// Cores do Sistema
export const COLORS = {
  light: {
    // Brand Colors - Cores principais da marca
    primary: '#10509C',    // Azul sofisticado
    secondary: '#22D3EE',  // Azul claro moderno
    tertiary: '#D3545D',   // Vermelho refinado
    alternate: '#E0E3E7',  // Cinza suave e elegante

    // Utility Colors - Cores utilitárias para texto e fundo
    primaryText: '#14181B',    // Cinza escuro para boa legibilidade
    secondaryText: '#57636C',  // Cinza médio suave
    primaryBackground: '#FFFFFF',   // Branco puro
    secondaryBackground: '#F7F9FC', // Cinza claro para fundo

    // System Colors - Cores do sistema
    icon: '#57636C',           // Cinza neutro
    tabIconDefault: '#57636C', // Mesmo tom do ícone
    tabIconSelected: '#4A6FA5',// Mesmo azul da cor primária
    divider: '#E0E3E7',        // Cinza claro suave
    hover: '#00000008',        // Hover suave

    // Accent Colors - Cores de destaque
    accent1: '#2E5C87',
    accent2: '#39B6D2',
    accent3: '#D3545D',
    accent4: '#E0E3E7',

    // Feedback Colors - Cores para mensagens e alertas
    success: '#4CAF50',
    info: '#2196F3',
    warning: '#FFC107',
    error: '#F44336',
  },
  dark: {
    // Brand Colors - Cores principais da marca no tema escuro
    primary: '#10509C',    // Azul sofisticado
    secondary: '#22D3EE',  // Azul claro moderno
    tertiary: '#D3545D',   // Vermelho refinado
    alternate: '#2E3A48',  // Cinza escuro clássico

    // Utility Colors - Cores utilitárias adaptadas para o tema escuro
    primaryText: '#FFFFFF',    // Branco puro
    secondaryText: '#95A1AC',  // Cinza claro para legibilidade
    primaryBackground: '#0F1417',   // Cinza quase preto
    secondaryBackground: '#21262D', // Cinza bem escuro, não preto puro

    // System Colors - Cores do sistema adaptadas para o tema escuro
    icon: '#95A1AC',           // Cinza neutro
    tabIconDefault: '#95A1AC', // Mesmo tom do ícone
    tabIconSelected: '#4A6FA5',// Mesmo azul da cor primária
    divider: '#2E3A48',        // Cinza escuro clássico
    hover: '#FFFFFF08',        // Hover suave

    // Accent Colors - Cores de destaque
    accent1: '#2E5C87',
    accent2: '#39B6D2',
    accent3: '#D3545D',
    accent4: '#2E3A48',

    // Feedback Colors - Cores para mensagens e alertas
    success: '#4CAF50',
    info: '#2196F3',
    warning: '#FFC107',
    error: '#F44336',
  },
} as const;

// Cores de Feedback - Usadas para mensagens e alertas
export const FEEDBACK_COLORS = {
  light: {
    success: {
      background: '#E7F7EE', // Fundo verde suave para sucesso
      text: '#1B4332',      // Texto verde escuro para contraste
      border: '#2D6A4F',    // Borda verde média para destaque
    },
    warning: {
      background: '#FEF3C7', // Fundo amarelo suave para avisos
      text: '#92400E',      // Texto laranja escuro para contraste
      border: '#D97706',    // Borda laranja para destaque
    },
    error: {
      background: '#FEE2E2', // Fundo vermelho suave para erros
      text: '#991B1B',      // Texto vermelho escuro para contraste
      border: '#DC2626',    // Borda vermelha para destaque
    },
    info: {
      background: '#E0F2FE', // Fundo azul suave para informações
      text: '#075985',      // Texto azul escuro para contraste
      border: '#0284C7',    // Borda azul para destaque
    },
  },
  dark: {
    success: {
      background: '#064E3B', // Fundo verde escuro para sucesso
      text: '#ECFDF5',      // Texto verde claro para contraste
      border: '#059669',    // Borda verde média para destaque
    },
    warning: {
      background: '#451A03', // Fundo laranja escuro para avisos
      text: '#FEF3C7',      // Texto amarelo claro para contraste
      border: '#D97706',    // Borda laranja para destaque
    },
    error: {
      background: '#450A0A', // Fundo vermelho escuro para erros
      text: '#FEE2E2',      // Texto vermelho claro para contraste
      border: '#DC2626',    // Borda vermelha para destaque
    },
    info: {
      background: '#082F49', // Fundo azul escuro para informações
      text: '#E0F2FE',      // Texto azul claro para contraste
      border: '#0284C7',    // Borda azul para destaque
    },
  },
};

// Tipografia Responsiva
export const TYPOGRAPHY: {
  mobile: { [key: string]: TextStyle };
  tablet: { [key: string]: TextStyle };
  desktop: { [key: string]: TextStyle };
} = {
  mobile: {
    // Display - Títulos grandes e impactantes
    displayLarge: {
      fontSize: 48,
      lineHeight: 56,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    displayMedium: {
      fontSize: 40,
      lineHeight: 48,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    displaySmall: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    // Headings - Títulos de seção
    headlineLarge: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    headlineMedium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    headlineSmall: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    // Títulos existentes (mantidos para compatibilidade)
    title: {
      fontSize: 28,
      lineHeight: 32,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    subtitle: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    // Labels - Textos de destaque
    labelLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
    },
    labelMedium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
    },
    labelSmall: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
    },
    // Body - Textos de conteúdo
    body: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'Inter_400Regular',
      letterSpacing: 0.1,
    },
    bodySemiBold: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
      letterSpacing: 0.1,
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
      fontFamily: 'Inter_400Regular',
      letterSpacing: 0.1,
    },
    link: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'Inter_400Regular',
      textDecorationLine: 'underline',
    },
  },
  tablet: {
    // Display - Títulos grandes e impactantes
    displayLarge: {
      fontSize: 56,
      lineHeight: 64,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    displayMedium: {
      fontSize: 48,
      lineHeight: 56,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    displaySmall: {
      fontSize: 40,
      lineHeight: 48,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    // Headings - Títulos de seção
    headlineLarge: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    headlineMedium: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    headlineSmall: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    // Títulos existentes (mantidos para compatibilidade)
    title: {
      fontSize: 32,
      lineHeight: 36,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    subtitle: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    // Labels - Textos de destaque
    labelLarge: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
    },
    labelMedium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
    },
    labelSmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
    },
    // Body - Textos de conteúdo
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      fontFamily: 'Inter_400Regular',
      letterSpacing: 0.1,
    },
    bodySemiBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
      letterSpacing: 0.1,
    },
    small: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'Inter_400Regular',
      letterSpacing: 0.1,
    },
    link: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      fontFamily: 'Inter_400Regular',
      textDecorationLine: 'underline',
    },
  },
  desktop: {
    // Display - Títulos grandes e impactantes
    displayLarge: {
      fontSize: 64,
      lineHeight: 72,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    displayMedium: {
      fontSize: 56,
      lineHeight: 64,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    displaySmall: {
      fontSize: 48,
      lineHeight: 56,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    // Headings - Títulos de seção
    headlineLarge: {
      fontSize: 40,
      lineHeight: 48,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    headlineMedium: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    headlineSmall: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    // Títulos existentes (mantidos para compatibilidade)
    title: {
      fontSize: 36,
      lineHeight: 40,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    subtitle: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700',
      fontFamily: 'Inter_700Bold',
    },
    // Labels - Textos de destaque
    labelLarge: {
      fontSize: 20,
      lineHeight: 32,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
    },
    labelMedium: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
    },
    labelSmall: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
    },
    // Body - Textos de conteúdo
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      fontFamily: 'Inter_400Regular',
      letterSpacing: 0.1,
    },
    bodySemiBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
      fontFamily: 'Inter_600SemiBold',
      letterSpacing: 0.1,
    },
    small: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      fontFamily: 'Inter_400Regular',
      letterSpacing: 0.1,
    },
    link: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      fontFamily: 'Inter_400Regular',
      textDecorationLine: 'underline',
    },
  },
};

// Espaçamento
export const SPACING = {
  none: 0,    // Sem espaçamento
  xs: 4,      // Espaçamento extra pequeno
  sm: 8,      // Espaçamento pequeno
  md: 16,     // Espaçamento médio
  lg: 24,     // Espaçamento grande
  xl: 32,     // Espaçamento extra grande
  xxl: 48,    // Espaçamento 2x extra grande
  xxxl: 64,   // Espaçamento 3x extra grande
  max: 72,    // Espaçamento máximo
} as const;

// Exemplos de uso do sistema de espaçamento:
/*
  // React Native
  import { StyleSheet } from 'react-native';
  import { SPACING } from '@constants/DesignSystem';

  const styles = StyleSheet.create({
    container: {
      padding: SPACING.md,
      gap: SPACING.sm,
      marginBottom: SPACING.lg,
    },
    card: {
      margin: SPACING.md,
      padding: SPACING.lg,
      gap: SPACING.sm,
    },
    section: {
      paddingVertical: SPACING.xl,
      paddingHorizontal: SPACING.md,
    },
  });

  // Tailwind/NativeWind
  const Component = () => (
    <View className={`p-[${SPACING.md}px] gap-[${SPACING.sm}px]`}>
      <Text>Conteúdo</Text>
    </View>
  );
*/

// Bordas
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
};

// Sombras
export const SHADOWS = {
  light: {
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
    '2xl': {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 16,
    },
    '3xl': {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.3,
      shadowRadius: 32,
      elevation: 24,
    },
    overlay: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.4,
      shadowRadius: 48,
      elevation: 32,
    },
  },
  dark: {
    xs: {
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 12,
    },
    '2xl': {
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 16,
    },
    '3xl': {
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.24,
      shadowRadius: 32,
      elevation: 24,
    },
    overlay: {
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.32,
      shadowRadius: 48,
      elevation: 32,
    },
  },
};

// Sistema de Ícones
export const ICONS = {
  // Ícones do Lucide React
  // Para Web: import { Home } from 'lucide-react';
  // Para Native: import { Home } from 'lucide-react-native';
  // Exemplo Web/Native: <Home size={ICONS.sizes.md} color={COLORS[currentTheme].text} />
  types: {
    navigation: {
      home: 'LayoutDashboard',
      explore: 'Compass',
      profile: 'User',
      designSystem: 'Palette',
    },
    interface: {
      chevronDown: 'ChevronDown',
      chevronRight: 'ChevronRight',
      close: 'X',
      menu: 'Menu',
    },
    feedback: {
      success: 'CheckCircle',
      warning: 'AlertTriangle',
      error: 'XCircle',
      info: 'Info',
    },
  },
  sizes: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
  },
} as const;

// Helpers para responsividade
export function getTypographyForBreakpoint(width: number) {
  if (width >= BREAKPOINTS.desktop) {
    return TYPOGRAPHY.desktop;
  } else if (width >= BREAKPOINTS.tablet) {
    return TYPOGRAPHY.tablet;
  }
  return TYPOGRAPHY.mobile;
} 