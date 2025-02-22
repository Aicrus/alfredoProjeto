import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, Pressable, Animated, Image } from 'react-native';
import { Bell, Search, Menu } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { HoverableView } from './HoverableView';
import { ProfileMenu } from './ProfileMenu';
import { NotificationsMenu } from './NotificationsMenu';
import { COLORS, SPACING, BORDER_RADIUS, getTypographyForBreakpoint } from '@/constants/DesignSystem';
import { useTheme } from '@/hooks/ThemeContext';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useAuth } from '@/contexts/auth';

interface HeaderProps {
  sidebarWidth: Animated.Value;
  onNavigate?: (route: string) => void;
  currentPath?: string;
  onToggleSidebar?: () => void;
  isSidebarExpanded?: boolean;
}

const pastelColors = [
  'E3F2FD', // azul claro
  'FCE4EC', // rosa claro
  'F3E5F5', // roxo claro
  'E8F5E9', // verde claro
  'FFF3E0', // laranja claro
  'E0F7FA', // ciano claro
] as const;

// Função para obter o storage apropriado
const getStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
    };
  }
  return {
    getItem: async (key: string) => await AsyncStorage.getItem(key),
    setItem: async (key: string, value: string) => await AsyncStorage.setItem(key, value),
  };
};

export function Header({ 
  sidebarWidth, 
  onNavigate, 
  currentPath = '/home',
  onToggleSidebar,
  isSidebarExpanded = true
}: HeaderProps) {
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
  const [isNotificationsMenuVisible, setIsNotificationsMenuVisible] = useState(false);
  const [userAvatarColor, setUserAvatarColor] = useState<string>(pastelColors[0]);
  const { currentTheme } = useTheme();
  const { isMobile } = useBreakpoints();
  const { session } = useAuth();
  const themeColors = COLORS[currentTheme];
  const typography = getTypographyForBreakpoint(Platform.OS === 'web' ? window.innerWidth : 0);

  const userName = session?.user?.user_metadata?.display_name || session?.user?.user_metadata?.name || 'Usuário';
  const userId = session?.user?.id;

  // Efeito para carregar/salvar a cor do avatar do usuário
  useEffect(() => {
    const storage = getStorage();
    const loadAvatarColor = async () => {
      if (!userId) return;
      
      const storageKey = `avatar_color_${userId}`;
      const savedColor = await storage.getItem(storageKey);
      
      if (savedColor && pastelColors.includes(savedColor as any)) {
        setUserAvatarColor(savedColor);
      } else {
        // Se não houver cor salva, escolhe uma aleatória e salva
        const newColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        setUserAvatarColor(newColor);
        await storage.setItem(storageKey, newColor);
      }
    };

    loadAvatarColor();
  }, [userId]);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=${userAvatarColor}&color=6A7280`;

  const getPageTitle = (path?: string) => {
    switch (path) {
      case '/config':
        return 'Configurações';
      case '/design-system':
        return 'Design System';
      case '/home':
        return 'Home';
      default:
        return 'Home';
    }
  };

  return (
    <Animated.View 
      style={[
        styles.header,
        {
          borderBottomColor: themeColors.divider,
          left: isMobile ? 0 : sidebarWidth,
          right: 0,
          backgroundColor: currentTheme === 'dark' ? '#151718' : 'white',
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          {!isMobile && onToggleSidebar && (
            <Pressable
              style={({ pressed, hovered }) => [
                styles.iconButton,
                { 
                  backgroundColor: currentTheme === 'dark' ? '#222' : themeColors.primaryBackground,
                  marginRight: SPACING.md,
                  width: 40,
                  height: 40,
                  borderRadius: BORDER_RADIUS.pill,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ scale: pressed ? 0.95 : hovered ? 1.02 : 1 }],
                  cursor: 'pointer'
                }
              ]}
              onPress={onToggleSidebar}
            >
              <Menu 
                size={20} 
                color={themeColors.icon} 
                strokeWidth={1.5}
              />
            </Pressable>
          )}
          <ThemedText 
            type="labelSmall" 
            style={[
              styles.pageTitle,
              { 
                color: '#57636C',
                fontFamily: 'Inter_600SemiBold',
                fontSize: 16,
                lineHeight: 24
              }
            ]}
          >
            {getPageTitle(currentPath)}
          </ThemedText>
        </View>

        <View style={styles.rightContent}>
          <HoverableView
            style={[
              styles.iconButton,
              { backgroundColor: currentTheme === 'dark' ? '#222' : themeColors.primaryBackground }
            ]}
            hoverScale={1.02}
          >
            <Search size={20} color={themeColors.icon} strokeWidth={1.5} />
          </HoverableView>

          <HoverableView
            style={[
              styles.iconButton,
              { backgroundColor: currentTheme === 'dark' ? '#222' : themeColors.primaryBackground }
            ]}
            hoverScale={1.02}
            onPress={() => setIsNotificationsMenuVisible(true)}
          >
            <Bell size={20} color={themeColors.icon} strokeWidth={1.5} />
            <View style={[styles.notificationBadge, { backgroundColor: themeColors.primary }]} />
          </HoverableView>

          <HoverableView
            style={[
              styles.avatarButton,
              { 
                backgroundColor: currentTheme === 'dark' ? '#222' : themeColors.primaryBackground,
                borderWidth: 2,
                borderColor: currentTheme === 'dark' ? '#333' : '#f0f0f0'
              }
            ]}
            hoverScale={1.02}
            onPress={() => setIsProfileMenuVisible(true)}
          >
            <Image 
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
            />
          </HoverableView>
        </View>
      </View>

      <ProfileMenu 
        isVisible={isProfileMenuVisible}
        onClose={() => setIsProfileMenuVisible(false)}
        onNavigate={onNavigate}
      />

      <NotificationsMenu 
        isVisible={isNotificationsMenuVisible}
        onClose={() => setIsNotificationsMenuVisible(false)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    position: Platform.select({
      web: 'fixed',
      default: 'absolute'
    }) as 'fixed' | 'absolute',
    top: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 40,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.pill,
    borderWidth: 2,
    borderColor: 'white',
  },
  pageTitle: {
    ...Platform.select({
      web: {
        userSelect: 'none',
      },
    }),
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.pill,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.pill,
  },
}); 