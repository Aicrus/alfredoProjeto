import { StyleSheet, ViewStyle, Platform } from 'react-native';
import { SPACING } from '@/constants/DesignSystem';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { ThemedView } from './ThemedView';

interface PageContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * PageContainer - Componente responsável por gerenciar TODOS os paddings da aplicação
 * 
 * COMO AJUSTAR OS PADDINGS:
 * 
 * 1. LATERAIS (paddingHorizontal):
 *    Ajuste na propriedade paddingHorizontal:
 *    - Desktop: SPACING.xxl (32px) - Altere o último valor
 *    - Tablet: SPACING.xl (24px) - Altere o valor do meio
 *    - Mobile: SPACING.md (16px) - Altere o primeiro valor
 * 
 * 2. SUPERIOR E INFERIOR PARA WEB (paddingVertical):
 *    Ajuste na propriedade paddingVertical:
 *    - Desktop: SPACING.xxl (32px) - Altere o último valor
 *    - Tablet: SPACING.xl (24px) - Altere o valor do meio
 *    - Mobile: SPACING.md (16px) - Altere o primeiro valor
 * 
 * 3. SUPERIOR ESPECÍFICO (paddingTop):
 *    Para Web - Ajuste no Platform.select > web:
 *    - Desktop: SPACING.xxl (32px) - Altere o último valor
 *    - Tablet: SPACING.xl (24px) - Altere o valor do meio
 *    - Mobile: SPACING.xl (24px) - Altere o primeiro valor
 * 
 *    Para Mobile Nativo - Ajuste no Platform.select > default:
 *    - Valor fixo: 50px - Altere este valor para ajustar
 * 
 * 4. INFERIOR ESPECÍFICO (paddingBottom):
 *    Para Web - Ajuste no Platform.select > web:
 *    - Desktop: SPACING.xxl (32px) - Altere o último valor
 *    - Tablet: SPACING.xl (24px) - Altere o valor do meio
 *    - Mobile: SPACING.md (16px) - Altere o primeiro valor
 * 
 *    Para Mobile Nativo - Ajuste no Platform.select > default:
 *    - Valor fixo: 75px - Altere este valor para ajustar
 * 
 * VALORES DO SPACING:
 * - SPACING.xxl = 32px
 * - SPACING.xl = 24px
 * - SPACING.lg = 20px
 * - SPACING.md = 16px
 * - SPACING.sm = 8px
 * - SPACING.xs = 4px
 */
export function PageContainer({ children, style }: PageContainerProps) {
  const { isMobile, isTablet, isDesktop } = useBreakpoints();

  return (
    <ThemedView style={[
      styles.container,
      {
        // Largura máxima do conteúdo por breakpoint
        maxWidth: isDesktop ? 1200 : 800,

        // LATERAIS - Ajuste aqui o padding das laterais para cada breakpoint
        // Mobile: SPACING.md (16px) | Tablet: SPACING.xl (24px) | Desktop: SPACING.xxl (32px)
        paddingHorizontal: isMobile ? SPACING.md : isTablet ? SPACING.xl : SPACING.xxl,

        // SUPERIOR E INFERIOR BASE - Ajuste aqui o padding vertical base para cada breakpoint
        // Mobile: SPACING.md (16px) | Tablet: SPACING.xl (24px) | Desktop: SPACING.xxl (32px)
        paddingVertical: isMobile ? SPACING.md : isTablet ? SPACING.xl : SPACING.xl,

        // SUPERIOR ESPECÍFICO - Ajuste aqui o padding superior específico
        // Web (Mobile/Tablet/Desktop) - Responsivo
        // Mobile Nativo - Valor fixo para status bar
        paddingTop: Platform.select({
          web: isMobile ? SPACING.xl : isTablet ? SPACING.xl : SPACING.xl,
          default: 50 // Mobile nativo: fixo para status bar
        }),

        // INFERIOR ESPECÍFICO - Ajuste aqui o padding inferior específico
        // Web (Mobile/Tablet/Desktop) - Responsivo
        // Mobile Nativo - Valor fixo para navigation bar
        paddingBottom: Platform.select({
          web: isMobile ? SPACING.md : isTablet ? SPACING.xl : SPACING.xxl,
          default: 75 // Mobile nativo: fixo para navigation bar
        }),
      },
      style
    ]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
  },
}); 