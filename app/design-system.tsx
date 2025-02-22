import React, { useRef } from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, Platform, Pressable, Animated } from 'react-native';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useTheme } from '@/hooks/ThemeContext';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import Sidebar2 from '@/components/Sidebar2';
import { COLORS, FEEDBACK_COLORS, SPACING, SHADOWS, ICONS, BORDER_RADIUS, BREAKPOINTS } from '@/constants/DesignSystem';
import { Home, Search, User } from 'lucide-react-native';
import { useToast } from '@/hooks/useToast';
import { PageContainer } from '@/components/PageContainer';
import { Header } from '@/components/Header';

export default function DesignSystemScreen() {
  const { currentTheme } = useTheme();
  const breakpoints = useBreakpoints();
  const { width } = useWindowDimensions();
  const { showToast } = useToast();
  const sidebarWidth = useRef(new Animated.Value(0)).current;

  const testToasts = [
    {
      type: 'success',
      message: 'Operação finalizada com sucesso!',
      description: 'Tudo ocorreu conforme esperado.',
      position: 'top',
      color: FEEDBACK_COLORS[currentTheme].success.background,
      borderColor: FEEDBACK_COLORS[currentTheme].success.border,
      textColor: FEEDBACK_COLORS[currentTheme].success.text,
    },
    {
      type: 'warning',
      message: 'Atenção necessária',
      description: 'Verifique algumas pendências.',
      position: 'bottom',
      color: FEEDBACK_COLORS[currentTheme].warning.background,
      borderColor: FEEDBACK_COLORS[currentTheme].warning.border,
      textColor: FEEDBACK_COLORS[currentTheme].warning.text,
    },
    {
      type: 'error',
      message: 'Erro encontrado',
      description: 'Algo deu errado na operação.',
      position: 'top-right',
      color: FEEDBACK_COLORS[currentTheme].error.background,
      borderColor: FEEDBACK_COLORS[currentTheme].error.border,
      textColor: FEEDBACK_COLORS[currentTheme].error.text,
    },
    {
      type: 'info',
      message: 'Informação importante',
      description: 'Aqui está uma informação relevante.',
      position: 'bottom-left',
      color: FEEDBACK_COLORS[currentTheme].info.background,
      borderColor: FEEDBACK_COLORS[currentTheme].info.border,
      textColor: FEEDBACK_COLORS[currentTheme].info.text,
    },
  ] as const;

  const ColorBox = ({ color, name }: { color: string; name: string }) => (
    <ThemedView style={[styles.colorBox, SHADOWS[currentTheme].sm]}>
      <View style={[styles.colorSquare, { backgroundColor: color }]} />
      <ThemedText style={styles.colorName}>{name}</ThemedText>
      <ThemedText style={styles.colorHex}>{color}</ThemedText>
    </ThemedView>
  );

  const ComponentShowcase = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <ThemedView style={[styles.componentShowcase, SHADOWS[currentTheme].sm]}>
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      <ThemedView style={styles.componentDemo}>
        {children}
      </ThemedView>
    </ThemedView>
  );

  const SpacingBox = ({ size, value }: { size: string; value: number }) => (
    <ThemedView style={[styles.spacingBox, SHADOWS[currentTheme].sm]}>
      <View style={[styles.spacingVisual, { width: value, height: value }]} />
      <ThemedText style={styles.spacingLabel}>{size}: {value}px</ThemedText>
    </ThemedView>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <ThemedView style={styles.sectionTitle}>
      <ThemedView style={styles.sectionTitleAccent} />
      <ThemedText type="subtitle">{children}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
      <Header 
        sidebarWidth={sidebarWidth}
        currentPath="/design-system"
      />
      <ScrollView
        style={[styles.scrollView, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 80 }
        ]}
        showsVerticalScrollIndicator={false}>
        <PageContainer>
          {/* Guia de Cores */}
          <ThemedView style={[styles.section, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
            <SectionTitle>Guia de Cores</SectionTitle>
            <ThemedText style={styles.sectionDescription}>
              Cores principais do sistema que definem a identidade visual da aplicação
            </ThemedText>

            <ThemedView style={[styles.colorSection, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
              <ThemedText type="defaultSemiBold" style={styles.colorSectionTitle}>Cores da Marca</ThemedText>
              <ThemedText style={styles.colorSectionDescription}>
                Cores principais que definem a identidade visual da marca
              </ThemedText>
              <View style={[styles.colorsGrid, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
                <ColorBox color={COLORS[currentTheme].primary} name="Primary" />
                <ColorBox color={COLORS[currentTheme].secondary} name="Secondary" />
                <ColorBox color={COLORS[currentTheme].tertiary} name="Tertiary" />
                <ColorBox color={COLORS[currentTheme].alternate} name="Alternate" />
              </View>
            </ThemedView>

            <ThemedView style={[styles.colorSection, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
              <ThemedText type="defaultSemiBold" style={styles.colorSectionTitle}>Cores Utilitárias</ThemedText>
              <ThemedText style={styles.colorSectionDescription}>
                Cores fundamentais para textos e fundos da aplicação
              </ThemedText>
              <View style={[styles.colorsGrid, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
                <ColorBox color={COLORS[currentTheme].primaryText} name="Primary Text" />
                <ColorBox color={COLORS[currentTheme].secondaryText} name="Secondary Text" />
                <ColorBox color={COLORS[currentTheme].primaryBackground} name="Primary Background" />
                <ColorBox color={COLORS[currentTheme].secondaryBackground} name="Secondary Background" />
              </View>
            </ThemedView>

            <ThemedView style={[styles.colorSection, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
              <ThemedText type="defaultSemiBold" style={styles.colorSectionTitle}>Cores do Sistema</ThemedText>
              <ThemedText style={styles.colorSectionDescription}>
                Cores utilizadas em elementos de interface e interação
              </ThemedText>
              <View style={[styles.colorsGrid, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
                <ColorBox color={COLORS[currentTheme].icon} name="Icon" />
                <ColorBox color={COLORS[currentTheme].tabIconDefault} name="Tab Icon Default" />
                <ColorBox color={COLORS[currentTheme].tabIconSelected} name="Tab Icon Selected" />
                <ColorBox color={COLORS[currentTheme].divider} name="Divider" />
              </View>
            </ThemedView>

            <ThemedText style={[styles.componentDescription, { textAlign: 'left', marginTop: 16 }]}>
              💡 Para modificar as cores, edite o arquivo:
              <ThemedText style={{ fontFamily: 'SpaceMono' }}> constants/DesignSystem.ts</ThemedText>
            </ThemedText>
          </ThemedView>

          {/* Tipografia */}
          <ThemedView style={[styles.section, styles.typographySection, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
            <SectionTitle>Tipografia</SectionTitle>
            <ThemedText style={styles.sectionDescription}>
              Sistema de textos responsivo que se adapta ao tamanho da tela, utilizando a fonte Inter
            </ThemedText>
            
            <ThemedView style={[styles.typographyContainer, SHADOWS[currentTheme].sm, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
              {/* Display */}
              <ThemedText type="subtitle" style={styles.typographyGroupTitle}>Display</ThemedText>
              <View style={styles.typographyItem}>
                <ThemedText type="displayLarge">Display Large</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '48px' : width < BREAKPOINTS.desktop ? '56px' : '64px'} • Inter Bold
                </ThemedText>
              </View>
              <View style={styles.typographyItem}>
                <ThemedText type="displayMedium">Display Medium</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '40px' : width < BREAKPOINTS.desktop ? '48px' : '56px'} • Inter Bold
                </ThemedText>
              </View>
              <View style={styles.typographyItem}>
                <ThemedText type="displaySmall">Display Small</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '36px' : width < BREAKPOINTS.desktop ? '40px' : '48px'} • Inter Bold
                </ThemedText>
              </View>

              {/* Headline */}
              <ThemedText type="subtitle" style={[styles.typographyGroupTitle, { marginTop: SPACING.xl }]}>Headline</ThemedText>
              <View style={styles.typographyItem}>
                <ThemedText type="headlineLarge">Headline Large</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '32px' : width < BREAKPOINTS.desktop ? '36px' : '40px'} • Inter Bold
                </ThemedText>
              </View>
              <View style={styles.typographyItem}>
                <ThemedText type="headlineMedium">Headline Medium</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '28px' : width < BREAKPOINTS.desktop ? '32px' : '36px'} • Inter Bold
                </ThemedText>
              </View>
              <View style={styles.typographyItem}>
                <ThemedText type="headlineSmall">Headline Small</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '24px' : width < BREAKPOINTS.desktop ? '28px' : '32px'} • Inter Bold
                </ThemedText>
              </View>

              {/* Labels */}
              <ThemedText type="subtitle" style={[styles.typographyGroupTitle, { marginTop: SPACING.xl }]}>Label</ThemedText>
              <View style={styles.typographyItem}>
                <ThemedText type="labelLarge">Label Large</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '16px' : width < BREAKPOINTS.desktop ? '18px' : '20px'} • Inter SemiBold
                </ThemedText>
              </View>
              <View style={styles.typographyItem}>
                <ThemedText type="labelMedium">Label Medium</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '14px' : width < BREAKPOINTS.desktop ? '16px' : '18px'} • Inter SemiBold
                </ThemedText>
              </View>
              <View style={styles.typographyItem}>
                <ThemedText type="labelSmall">Label Small</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '12px' : width < BREAKPOINTS.desktop ? '14px' : '16px'} • Inter SemiBold
                </ThemedText>
              </View>

              {/* Body */}
              <ThemedText type="subtitle" style={[styles.typographyGroupTitle, { marginTop: SPACING.xl }]}>Body</ThemedText>
              <View style={styles.typographyItem}>
                <ThemedText type="bodySemiBold">Body Semi-Bold</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '14px' : '16px'} • Inter SemiBold
                </ThemedText>
              </View>
              <View style={styles.typographyItem}>
                <ThemedText>Body Regular</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '14px' : '16px'} • Inter Regular
                </ThemedText>
              </View>
              <View style={styles.typographyItem}>
                <ThemedText type="small">Small</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '12px' : '14px'} • Inter Regular
                </ThemedText>
              </View>
              <View style={styles.typographyItem}>
                <ThemedText type="link">Link</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  {width < BREAKPOINTS.tablet ? '14px' : '16px'} • Inter Regular • Underline
                </ThemedText>
              </View>
              <View style={styles.typographyItem}>
                <ThemedText style={{ fontFamily: 'SpaceMono' }}>SpaceMono Font</ThemedText>
                <ThemedText type="small" style={styles.typographyInfo}>
                  Fonte especial para código
                </ThemedText>
              </View>
            </ThemedView>

            <ThemedText style={[styles.componentDescription, { textAlign: 'left', marginTop: 16 }]}>
              💡 Para modificar a tipografia, edite o arquivo:
              <ThemedText style={{ fontFamily: 'SpaceMono' }}> constants/DesignSystem.ts</ThemedText>
            </ThemedText>
          </ThemedView>

          {/* Breakpoints */}
          <ThemedView style={[styles.section, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
            <SectionTitle>Breakpoints</SectionTitle>
            <ThemedText style={styles.sectionDescription}>
              Pontos de quebra que definem a adaptação do layout em diferentes tamanhos de tela
            </ThemedText>
            <View style={styles.breakpointsContainer}>
              <ThemedView style={[styles.breakpointBox, SHADOWS[currentTheme].sm, breakpoints.isMobile && styles.activeBreakpoint]}>
                <ThemedText>Mobile</ThemedText>
                <ThemedText style={styles.breakpointValue}>{`0-${BREAKPOINTS.tablet-1}px`}</ThemedText>
                <ThemedText style={styles.currentWidth}>
                  Largura atual: {width}px
                </ThemedText>
                {breakpoints.isMobile && (
                  <ThemedText type="small" style={styles.activeLabel}>Ativo</ThemedText>
                )}
              </ThemedView>
              <ThemedView style={[styles.breakpointBox, SHADOWS[currentTheme].sm, breakpoints.isTablet && styles.activeBreakpoint]}>
                <ThemedText>Tablet</ThemedText>
                <ThemedText style={styles.breakpointValue}>{`${BREAKPOINTS.tablet}-${BREAKPOINTS.desktop-1}px`}</ThemedText>
                <ThemedText style={styles.currentWidth}>
                  Largura atual: {width}px
                </ThemedText>
                {breakpoints.isTablet && (
                  <ThemedText type="small" style={styles.activeLabel}>Ativo</ThemedText>
                )}
              </ThemedView>
              <ThemedView style={[styles.breakpointBox, SHADOWS[currentTheme].sm, breakpoints.isDesktop && styles.activeBreakpoint]}>
                <ThemedText>Desktop</ThemedText>
                <ThemedText style={styles.breakpointValue}>{`${BREAKPOINTS.desktop}px+`}</ThemedText>
                <ThemedText style={styles.currentWidth}>
                  Largura atual: {width}px
                </ThemedText>
                {breakpoints.isDesktop && (
                  <ThemedText type="small" style={styles.activeLabel}>Ativo</ThemedText>
                )}
              </ThemedView>
            </View>
          </ThemedView>

          {/* Feedback Visual */}
          <ThemedView style={[styles.section, { marginVertical: SPACING.xxl, backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
            <SectionTitle>Feedback Visual</SectionTitle>
            <ThemedText style={styles.sectionDescription}>
              Mensagens e alertas para comunicação com o usuário
            </ThemedText>
            <View style={[styles.feedbackContainer, { marginTop: SPACING.md }]}>
              <FeedbackMessage
                type="success"
                message="Operação realizada com sucesso!"
                description="Feedback positivo para ações bem-sucedidas"
              />
              <FeedbackMessage
                type="warning"
                message="Atenção necessária"
                description="Alertas para situações que requerem atenção do usuário"
              />
              <FeedbackMessage
                type="error"
                message="Erro encontrado"
                description="Mensagens de erro para problemas e falhas"
              />
              <FeedbackMessage
                type="info"
                message="Informação importante"
                description="Mensagens informativas e dicas para o usuário"
              />
            </View>
            <ThemedText style={[styles.componentDescription, { textAlign: 'left', marginTop: SPACING.md }]}>
              💡 Para usar as mensagens de feedback, importe FeedbackMessage de components/FeedbackMessage
            </ThemedText>
          </ThemedView>

          {/* Espaçamento */}
          <ThemedView style={[styles.section, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
            <SectionTitle>Sistema de Espaçamento</SectionTitle>
            <ThemedText style={styles.sectionDescription}>
              Escala de espaçamentos para manter consistência no layout
            </ThemedText>
            <View style={styles.spacingContainer}>
              {Object.entries(SPACING).map(([size, value]) => (
                <SpacingBox key={size} size={size} value={value} />
              ))}
            </View>
          </ThemedView>

          {/* Sombras */}
          <ThemedView style={[styles.section, { marginVertical: SPACING.xxl, backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
            <SectionTitle>Sistema de Elevação</SectionTitle>
            <ThemedText style={styles.sectionDescription}>
              Sombras para criar hierarquia visual e profundidade
            </ThemedText>
            <ThemedView style={[styles.shadowsContainer, SHADOWS[currentTheme].sm]}>
              <ThemedView style={[
                styles.shadowBox, 
                SHADOWS[currentTheme].xs,
                { backgroundColor: COLORS[currentTheme].primaryBackground }
              ]}>
                <ThemedText>Extra Small</ThemedText>
                <ThemedText type="small" style={styles.shadowInfo}>Elevação Mínima</ThemedText>
                <ThemedText style={[styles.codeExample, { fontFamily: 'SpaceMono' }]}>
                  SHADOWS[currentTheme].xs
                </ThemedText>
              </ThemedView>
              <ThemedView style={[
                styles.shadowBox, 
                SHADOWS[currentTheme].sm,
                { backgroundColor: COLORS[currentTheme].primaryBackground }
              ]}>
                <ThemedText>Small</ThemedText>
                <ThemedText type="small" style={styles.shadowInfo}>Elevação Sutil</ThemedText>
                <ThemedText style={[styles.codeExample, { fontFamily: 'SpaceMono' }]}>
                  SHADOWS[currentTheme].sm
                </ThemedText>
              </ThemedView>
              <ThemedView style={[
                styles.shadowBox, 
                SHADOWS[currentTheme].md,
                { backgroundColor: COLORS[currentTheme].primaryBackground }
              ]}>
                <ThemedText>Medium</ThemedText>
                <ThemedText type="small" style={styles.shadowInfo}>Elevação Média</ThemedText>
                <ThemedText style={[styles.codeExample, { fontFamily: 'SpaceMono' }]}>
                  SHADOWS[currentTheme].md
                </ThemedText>
              </ThemedView>
              <ThemedView style={[
                styles.shadowBox, 
                SHADOWS[currentTheme].lg,
                { backgroundColor: COLORS[currentTheme].primaryBackground }
              ]}>
                <ThemedText>Large</ThemedText>
                <ThemedText type="small" style={styles.shadowInfo}>Elevação Alta</ThemedText>
                <ThemedText style={[styles.codeExample, { fontFamily: 'SpaceMono' }]}>
                  SHADOWS[currentTheme].lg
                </ThemedText>
              </ThemedView>
              <ThemedView style={[
                styles.shadowBox, 
                SHADOWS[currentTheme].xl,
                { backgroundColor: COLORS[currentTheme].primaryBackground }
              ]}>
                <ThemedText>Extra Large</ThemedText>
                <ThemedText type="small" style={styles.shadowInfo}>Elevação Maior</ThemedText>
                <ThemedText style={[styles.codeExample, { fontFamily: 'SpaceMono' }]}>
                  SHADOWS[currentTheme].xl
                </ThemedText>
              </ThemedView>
              <ThemedView style={[
                styles.shadowBox, 
                SHADOWS[currentTheme]['2xl'],
                { backgroundColor: COLORS[currentTheme].primaryBackground }
              ]}>
                <ThemedText>2XL</ThemedText>
                <ThemedText type="small" style={styles.shadowInfo}>Elevação Muito Alta</ThemedText>
                <ThemedText style={[styles.codeExample, { fontFamily: 'SpaceMono' }]}>
                  SHADOWS[currentTheme]['2xl']
                </ThemedText>
              </ThemedView>
              <ThemedView style={[
                styles.shadowBox, 
                SHADOWS[currentTheme]['3xl'],
                { backgroundColor: COLORS[currentTheme].primaryBackground }
              ]}>
                <ThemedText>3XL</ThemedText>
                <ThemedText type="small" style={styles.shadowInfo}>Elevação Máxima</ThemedText>
                <ThemedText style={[styles.codeExample, { fontFamily: 'SpaceMono' }]}>
                  SHADOWS[currentTheme]['3xl']
                </ThemedText>
              </ThemedView>
              <ThemedView style={[
                styles.shadowBox, 
                SHADOWS[currentTheme].overlay,
                { backgroundColor: COLORS[currentTheme].primaryBackground }
              ]}>
                <ThemedText>Overlay</ThemedText>
                <ThemedText type="small" style={styles.shadowInfo}>Elevação para Overlays</ThemedText>
                <ThemedText style={[styles.codeExample, { fontFamily: 'SpaceMono' }]}>
                  SHADOWS[currentTheme].overlay
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedText style={[styles.componentDescription, { textAlign: 'left', marginTop: 16 }]}>
              💡 Para usar as sombras, importe SHADOWS de constants/DesignSystem e use com currentTheme
            </ThemedText>
          </ThemedView>

          {/* Componentes */}
          <ThemedView style={[styles.section, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
            <SectionTitle>Biblioteca de Componentes</SectionTitle>
            <ThemedText style={styles.sectionDescription}>
              Componentes reutilizáveis que seguem o design system
            </ThemedText>
            
            <ComponentShowcase title="Sidebar">
              <ThemedText style={styles.componentDescription}>
                Menu lateral responsivo com suporte a temas e animações
              </ThemedText>
              <ThemedView style={[
                styles.sidebarDemo,
                { 
                  height: 500,
                  borderColor: COLORS[currentTheme].divider
                }
              ]}>
                <Sidebar2 onNavigate={(route) => console.log('Demo:', route)} />
              </ThemedView>
            </ComponentShowcase>

            <ComponentShowcase title="ThemeSelector">
              <ThemedText style={styles.componentDescription}>
                Controle para alternar entre temas claro, escuro e do sistema
              </ThemedText>
              <ThemeSelector />
            </ComponentShowcase>

            <ComponentShowcase title="Toast">
              <ThemedText style={styles.componentDescription}>
                Sistema de notificações com diferentes tipos de feedback e posições na tela
              </ThemedText>
              <View style={styles.toastButtons}>
                {testToasts.map((toast) => (
                  <Pressable
                    key={toast.type}
                    style={({ pressed }) => [
                      styles.toastTestButton,
                      {
                        backgroundColor: toast.color,
                        borderColor: toast.borderColor,
                        opacity: pressed ? 0.8 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      },
                    ]}
                    onPress={() => showToast({
                      type: toast.type,
                      message: toast.message,
                      description: toast.description,
                      position: toast.position,
                    })}>
                    <ThemedText style={[styles.toastButtonText, { color: toast.textColor }]}>
                      {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
              <ThemedText style={[styles.componentDescription, { marginTop: 16 }]}>
                Clique nos botões para testar os diferentes tipos de toast em diferentes posições
              </ThemedText>
            </ComponentShowcase>

            <ThemedView style={[styles.componentGroup, SHADOWS[currentTheme].sm]}>
              <ThemedText type="defaultSemiBold">Sistema de Ícones</ThemedText>
              <ThemedText style={styles.componentDescription}>
                Sistema de ícones baseado no Lucide React. Oferece uma biblioteca completa de ícones consistentes e personalizáveis.
              </ThemedText>
              <ThemedText style={[styles.componentDescription, { marginTop: -8 }]}>
                Importar de: lucide-react-native
              </ThemedText>
              <View style={styles.iconGrid}>
                <View style={styles.iconItem}>
                  <Home size={24} color={COLORS[currentTheme].primaryText} strokeWidth={1.5} />
                  <ThemedText style={styles.iconLabel}>Home</ThemedText>
                </View>
                <View style={styles.iconItem}>
                  <Search size={24} color={COLORS[currentTheme].primaryText} strokeWidth={1.5} />
                  <ThemedText style={styles.iconLabel}>Search</ThemedText>
                </View>
                <View style={styles.iconItem}>
                  <User size={24} color={COLORS[currentTheme].primaryText} strokeWidth={1.5} />
                  <ThemedText style={styles.iconLabel}>User</ThemedText>
                </View>
              </View>
              <ThemedText style={[styles.componentDescription, { marginTop: 8 }]}>
                Personalize com: size, color, strokeWidth
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </PageContainer>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    minHeight: '100%',
  },
  section: {
    gap: 24,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitleAccent: {
    width: 4,
    height: 24,
    backgroundColor: COLORS.light.primary,
    borderRadius: 2,
  },
  breakpointsContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  breakpointBox: {
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: 150,
    alignItems: 'center',
  },
  activeBreakpoint: {
    backgroundColor: COLORS.light.primary + '10',
  },
  breakpointValue: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  typographySection: {
    gap: 16,
  },
  typographyContainer: {
    padding: 24,
    borderRadius: 16,
    gap: 16,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  colorBox: {
    alignItems: 'center',
    gap: 12,
    minWidth: 120,
    padding: 16,
    borderRadius: 12,
  },
  colorSquare: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.light.icon,
  },
  colorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  colorHex: {
    fontSize: 12,
    opacity: 0.7,
  },
  componentShowcase: {
    gap: 12,
    padding: 20,
    borderRadius: 16,
  },
  componentDemo: {
    padding: 20,
    gap: 12,
    borderRadius: 12,
    backgroundColor: COLORS.light.secondaryBackground,
    alignItems: 'center',
  },
  demoThemedView: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.light.secondaryBackground,
  },
  iconGrid: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
    padding: 8,
    width: '100%',
  },
  iconItem: {
    alignItems: 'center',
    gap: 8,
  },
  iconLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  feedbackContainer: {
    gap: 16,
  },
  spacingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  spacingBox: {
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  spacingVisual: {
    backgroundColor: COLORS.light.primary + '40',
    borderRadius: 6,
  },
  spacingLabel: {
    fontSize: 12,
  },
  shadowsContainer: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
  },
  shadowBox: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
    backgroundColor: COLORS.light.primaryBackground,
  },
  sectionDescription: {
    opacity: 0.7,
    marginBottom: 16,
  },
  typographyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  typographyInfo: {
    opacity: 0.7,
  },
  componentDescription: {
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 8,
  },
  activeLabel: {
    color: COLORS.light.primary,
    marginTop: 4,
  },
  shadowInfo: {
    opacity: 0.7,
    marginTop: 4,
  },
  componentGroup: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
    alignItems: 'center',
    width: '100%',
  },
  colorSection: {
    gap: 12,
    marginBottom: 24,
  },
  colorSectionTitle: {
    marginBottom: 4,
  },
  colorSectionDescription: {
    opacity: 0.7,
    marginBottom: 16,
  },
  sidebarDemo: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginTop: SPACING.md,
  },
  toastButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  toastTestButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  toastButtonText: {
    fontWeight: '600',
  },
  currentWidth: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
    color: COLORS.light.primary,
  },
  typographyGroupTitle: {
    marginBottom: SPACING.md,
    opacity: 0.7,
  },
  codeExample: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
    padding: 4,
    backgroundColor: COLORS.light.primaryBackground + '20',
    borderRadius: 4,
  },
}); 