import { StyleSheet, Platform, ScrollView, Animated, useWindowDimensions, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';

import { ThemedView } from '@/components/ThemedView';
import Sidebar2 from '@/components/Sidebar2';
import { Header } from '@/components/Header';
import { SPACING, COLORS } from '@/constants/DesignSystem';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { PageContainer } from '@/components/PageContainer';
import { useTheme } from '@/hooks/ThemeContext';
import { useSidebar } from '@/hooks/SidebarContext';

const EXPANDED_WIDTH = 220;
const COLLAPSED_WIDTH = 68;

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isMobile, isTablet, isDesktop } = useBreakpoints();
  const { isExpanded, toggleSidebar } = useSidebar();
  const animatedWidth = useRef(new Animated.Value(isMobile ? 0 : isExpanded ? 220 : 70)).current;
  const { currentTheme } = useTheme();

  const handleNavigation = (route: string) => {
    if (route === '/home') {
      router.push('/home');
    } else if (route === '/config') {
      router.push('/config');
    }
  };

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: isExpanded ? 220 : 70,
      duration: isExpanded ? 30 : 150,
      easing: isExpanded ? Easing.out(Easing.quad) : Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
      {!isMobile && (
        <Sidebar2 
          onNavigate={handleNavigation} 
          currentPath="/home"
          isExpanded={isExpanded}
          onToggle={toggleSidebar}
        />
      )}
      <Animated.View style={[
        styles.mainContent,
        { 
          left: isMobile ? 0 : animatedWidth,
          backgroundColor: COLORS[currentTheme].secondaryBackground
        }
      ]}>
        <Header 
          sidebarWidth={animatedWidth}
          onNavigate={handleNavigation}
          currentPath="/home"
          onToggleSidebar={toggleSidebar}
          isSidebarExpanded={isExpanded}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ThemedView style={[
            styles.contentContainer,
            {
              maxWidth: isDesktop ? 1200 : 800,
              alignSelf: 'center',
              width: '100%',
              backgroundColor: COLORS[currentTheme].secondaryBackground
            }
          ]}>
            <PageContainer>
              <ThemedView style={[styles.loremContainer, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
                {/* Conteúdo da página será adicionado aqui */}
              </ThemedView>
            </PageContainer>
          </ThemedView>
        </ScrollView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  mainContent: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      web: {
        transition: 'left 0.3s ease',
      },
    }),
  },
  scrollView: {
    flex: 1,
    marginTop: 64,
  },
  scrollContent: {
    minHeight: '100%',
    flexGrow: 1,
    display: 'flex',
  },
  contentContainer: {
    flex: 1,
  },
  loremContainer: {
    gap: SPACING.lg,
  },
}); 