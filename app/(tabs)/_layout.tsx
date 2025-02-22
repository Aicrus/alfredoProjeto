import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { LayoutDashboard, Settings } from 'lucide-react-native';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useTheme } from '@/hooks/ThemeContext';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { COLORS, ICONS } from '@/constants/DesignSystem';

/**
 * Guia de Personalização da Tab Bar:
 * 
 * 1. Cores:
 *    - Para mudar as cores dos ícones e textos, edite em constants/DesignSystem.ts:
 *      - COLORS.light.primary (cor do item selecionado)
 *      - COLORS.light.tabIconDefault (cor dos ícones não selecionados)
 * 
 * 2. Background:
 *    - Web: Ajuste os valores de opacity aqui mesmo no backgroundColor
 *    - iOS: Edite a intensidade do blur em components/ui/TabBarBackground.ios.tsx
 *    - Android: Ajuste a opacity em components/ui/TabBarBackground.tsx
 * 
 * 3. Ícones:
 *    - Para trocar os ícones, altere o name="house.fill" nas opções de cada Tab.Screen
 *    - Lista completa de ícones: https://icons.expo.fyi/Index
 * 
 * 4. Espaçamentos:
 *    - Ajuste os valores no StyleSheet abaixo:
 *      - tabBar: altura geral e padding
 *      - webTabBar: altura específica para web
 *      - tabItem: espaçamentos dos itens
 */
export default function TabsLayout() {
  const { currentTheme } = useTheme();
  const { isMobile } = useBreakpoints();

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS[currentTheme].primary,
          headerShown: false,
          tabBarButton: HapticTab,
          ...(Platform.OS !== 'web' && { tabBarBackground: TabBarBackground }),
          tabBarLabelPosition: 'below-icon',
          tabBarStyle: [
            styles.tabBar,
            Platform.select({
              ios: styles.iosTabBar,
              android: styles.androidTabBar,
              web: {
                ...styles.webTabBar,
                backgroundColor: currentTheme === 'dark' 
                  ? 'rgba(0, 0, 0, 0.75)' 
                  : 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              },
              default: {},
            }),
            !isMobile && styles.hideTabBar,
          ],
          tabBarItemStyle: Platform.select({
            web: {
              ...styles.webTabItem,
              paddingTop: 0,
              marginTop: -4,
              height: '100%',
              gap: 2,
            },
            native: {
              ...styles.tabItem,
              marginTop: -6,
            },
          }),
          tabBarLabelStyle: Platform.select({
            web: styles.webTabLabel,
            native: {
              fontSize: 12,
              lineHeight: 16,
              marginTop: -2
            }
          }),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <LayoutDashboard size={ICONS.sizes.md} color={color} strokeWidth={1.5} />,
          }}
        />
        <Tabs.Screen
          name="config"
          options={{
            title: 'Config',
            tabBarIcon: ({ color }) => <Settings size={ICONS.sizes.md} color={color} strokeWidth={1.5} />,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    display: 'flex',
    height: 80,
    paddingBottom: 25,
  },
  iosTabBar: {
    position: 'absolute',
  },
  androidTabBar: {},
  webTabBar: {
    height: 70,
    paddingTop: 4,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  tabItem: {
    paddingTop: 8,
    gap: 4,
  },
  webTabItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webTabLabel: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: -2,
  },
  hideTabBar: {
    display: 'none',
  },
});
