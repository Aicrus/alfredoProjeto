import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Platform, Pressable, useColorScheme, useWindowDimensions, TextStyle, ScrollView, Image, ImageStyle, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { HoverableView } from './HoverableView';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, getTypographyForBreakpoint } from '@/constants/DesignSystem';
import * as Icons from 'lucide-react-native';
import { useTheme } from '@/hooks/ThemeContext';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import type { Theme } from '@/src/hooks/useTheme';
import { useAuth } from '@/contexts/auth';

interface SidebarProps {
  onNavigate?: (route: string) => void;
  currentPath?: string;
  onToggle?: (expanded: boolean) => void;
}

interface TypographyStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight?: TextStyle['fontWeight'];
}

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 68;

const getFontWeight = (weight?: TextStyle['fontWeight']): TextStyle['fontWeight'] => {
  switch (weight) {
    case 'bold':
      return '700';
    case 'semibold':
      return '600';
    case 'medium':
      return '500';
    case 'normal':
      return '400';
    default:
      return '400';
  }
};

export const Sidebar = ({ onNavigate, currentPath = '/dash', onToggle }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { currentTheme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const { isTablet, isDesktop } = useBreakpoints();
  const { signOut } = useAuth();
  const typographyBase = getTypographyForBreakpoint(windowWidth);
  
  // Convertendo a tipografia para o formato correto do React Native
  const typography: Record<string, TypographyStyle> = {
    title: {
      fontSize: typographyBase.title?.fontSize || 24,
      lineHeight: typographyBase.title?.lineHeight || 28,
      fontWeight: getFontWeight(typographyBase.title?.fontWeight),
    },
    subtitle: {
      fontSize: typographyBase.subtitle?.fontSize || 18,
      lineHeight: typographyBase.subtitle?.lineHeight || 24,
      fontWeight: getFontWeight(typographyBase.subtitle?.fontWeight),
    },
    body: {
      fontSize: typographyBase.body?.fontSize || 16,
      lineHeight: typographyBase.body?.lineHeight || 20,
      fontWeight: getFontWeight('normal'),
    },
  };

  const animatedWidth = React.useRef(new Animated.Value(EXPANDED_WIDTH)).current;
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [isToggleHovered, setIsToggleHovered] = useState(false);

  useEffect(() => {
    if (isTablet && isExpanded) {
      // Colapsa no tablet
      const toValue = COLLAPSED_WIDTH;
      Animated.parallel([
        Animated.timing(animatedWidth, {
          toValue,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
      ]).start();
      setIsExpanded(false);
      onToggle?.(false);
    } else if (isDesktop && !isExpanded) {
      // Expande no desktop
      const toValue = EXPANDED_WIDTH;
      Animated.parallel([
        Animated.timing(animatedWidth, {
          toValue,
          duration: 200,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
      ]).start();
      setIsExpanded(true);
      onToggle?.(true);
    }
  }, [isTablet, isDesktop]);

  const toggleSidebar = () => {
    const toValue = isExpanded ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
    Animated.parallel([
      Animated.timing(animatedWidth, {
        toValue,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.cubic),
      }),
      Animated.timing(fadeAnim, {
        toValue: isExpanded ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic),
      }),
    ]).start();
    setIsExpanded(!isExpanded);
    onToggle?.(!isExpanded);
  };

  const themeColors = COLORS[currentTheme as keyof typeof COLORS];

  const menuItems = [
    { icon: 'LineChart', label: 'BI Servidores', route: '/dash', canNavigate: true },
    { icon: 'Server', label: 'Base de Dados', route: '/transactions', canNavigate: false },
    { icon: 'Vote', label: 'Eleições MS', route: '/wallet', canNavigate: false },
    { icon: 'Phone', label: 'Agenda Telefônica', route: '/goals', canNavigate: false },
    { icon: 'Headphones', label: 'Suporte do Sistema', route: '/budget', canNavigate: false },
    { icon: 'Settings', label: 'Configurações', route: '/config', canNavigate: true }
  ];

  const handleNavigation = (route: string, canNavigate: boolean) => {
    if (canNavigate) {
      onNavigate?.(route);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      <Animated.View style={[
        styles.container,
        {
          width: animatedWidth,
          backgroundColor: themeColors.secondaryBackground,
          borderRightWidth: 0.5,
          borderRightColor: themeColors.divider,
        }
      ]}>
        <ThemedView style={styles.content}>
          <ThemedView style={[styles.header, { backgroundColor: 'transparent' }]}>
            <View style={[
              styles.logoContainer,
              { backgroundColor: 'transparent' }
            ]}>
              {isExpanded ? (
                <Image 
                  source={require('../assets/images/gov-ms.png')}
                  style={{
                    width: EXPANDED_WIDTH,
                    height: 45,
                    marginLeft: -SPACING.sm,
                  }}
                  resizeMode="contain"
                />
              ) : (
                <Image 
                  source={require('../assets/images/gov-ms.png')}
                  style={{
                    width: COLLAPSED_WIDTH,
                    height: 45,
                    marginLeft: -SPACING.sm,
                  }}
                  resizeMode="contain"
                />
              )}
            </View>
            <Animated.View style={{
              opacity: fadeAnim,
              transform: [{ translateX: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })}]
            }}>
              {isExpanded && (
                <View style={{ width: 100, height: 20 } as ViewStyle} />
              )}
            </Animated.View>
            <HoverableView
              onPress={toggleSidebar}
              style={[
                styles.toggleButton,
                {
                  backgroundColor: themeColors.secondaryBackground,
                  right: -8,
                  top: 62,
                  borderColor: themeColors.divider,
                  borderWidth: 1,
                }
              ]}
              hoverScale={1.02}
            >
              {isExpanded ? (
                <Icons.ChevronLeft 
                  color={currentTheme === 'dark' ? '#fff' : themeColors.primary} 
                  size={16} 
                  strokeWidth={2} 
                />
              ) : (
                <Icons.ChevronRight 
                  color={currentTheme === 'dark' ? '#fff' : themeColors.primary} 
                  size={16} 
                  strokeWidth={2} 
                />
              )}
            </HoverableView>
          </ThemedView>

          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={Platform.OS === 'web'}
            scrollIndicatorInsets={{ right: 2 }}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.menuContainer}>
              {menuItems.map((item, index) => {
                const IconComponent = (Icons as any)[item.icon];
                const isActive = currentPath === item.route;
                
                return (
                  <HoverableView
                    key={index}
                    onPress={() => handleNavigation(item.route, item.canNavigate)}
                    style={styles.menuItem}
                    isActive={isActive}
                    activeBackgroundColor={themeColors.primary + '15'}
                    hoverTranslateX={4}
                  >
                    <View style={styles.menuIconContainer}>
                      <IconComponent
                        size={20}
                        color={isActive ? themeColors.primary : themeColors.primaryText}
                        strokeWidth={1.5}
                      />
                    </View>
                    {isExpanded && (
                      <Animated.View style={{
                        opacity: fadeAnim,
                        transform: [{ translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0]
                        })}]
                      }}>
                        <ThemedText
                          style={[
                            styles.menuItemText,
                            typography.body,
                            isActive && { color: themeColors.primary }
                          ]}
                        >
                          {item.label}
                        </ThemedText>
                      </Animated.View>
                    )}
                    {isActive && (
                      <View style={[
                        styles.activeIndicator,
                        { backgroundColor: themeColors.primary }
                      ]} />
                    )}
                  </HoverableView>
                );
              })}
            </View>

            <View style={[
              styles.footer,
              { 
                borderTopColor: themeColors.divider,
                marginTop: 'auto',
                paddingTop: SPACING.lg,
                borderTopWidth: 1,
                marginBottom: SPACING.xl,
              }
            ]}>
              {[
                { label: 'Ajuda', icon: Icons.HelpCircle, action: () => {} },
                { label: 'Sair', icon: Icons.LogOut, action: handleLogout }
              ].map(({ label, icon: IconComponent, action }, index) => {
                return (
                  <HoverableView
                    key={label}
                    style={styles.menuItem}
                    hoverTranslateX={4}
                    activeBackgroundColor={themeColors.hover}
                    onPress={action}
                  >
                    <View style={styles.menuIconContainer}>
                      <IconComponent
                        size={20}
                        color={currentTheme === 'dark' ? '#fff' : themeColors.primaryText}
                        strokeWidth={2}
                      />
                    </View>
                    {isExpanded && (
                      <Animated.View style={{
                        opacity: fadeAnim,
                        transform: [{ translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0]
                        })}]
                      }}>
                        <ThemedText
                          style={[
                            styles.menuItemText,
                            typography.body,
                          ]}
                        >
                          {label}
                        </ThemedText>
                      </Animated.View>
                    )}
                  </HoverableView>
                );
              })}
            </View>
          </ScrollView>
        </ThemedView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    position: 'relative',
    paddingVertical: SPACING.lg,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
      },
    }),
  },
  scrollContainer: {
    flex: 1,
    ...Platform.select({
      web: {
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0,0,0,0.2) transparent',
      },
    }),
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        transition: 'all 0.3s ease',
      } as ViewStyle,
    }),
  } as ViewStyle,
  logoImage: {
    ...Platform.select({
      web: {
        transition: 'all 0.3s ease',
      } as ImageStyle,
    }),
  } as ImageStyle,
  logoText: {
    color: 'white',
  },
  brandText: {
    marginLeft: SPACING.md,
  },
  toggleButton: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    right: -8,
    top: 64,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    gap: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    position: 'relative',
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      },
    }),
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        transition: 'transform 0.2s ease',
      },
    }),
  },
  activeMenuItem: {
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 3,
    height: 20,
    borderTopRightRadius: BORDER_RADIUS.sm,
    borderBottomRightRadius: BORDER_RADIUS.sm,
    transform: [{ translateY: -10 }],
    ...Platform.select({
      web: {
        transition: 'background-color 0.2s ease',
      },
    }),
  },
  menuItemText: {
    marginLeft: SPACING.sm,
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease',
      },
    }),
  },
  footer: {
    paddingHorizontal: SPACING.sm,
    gap: 1,
    marginTop: 'auto',
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
  },
  disabledMenuItem: {
    cursor: 'not-allowed',
    opacity: 0.8,
  },
}); 