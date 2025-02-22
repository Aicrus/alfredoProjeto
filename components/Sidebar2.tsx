import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/constants/DesignSystem';
import { LineChart, Database, Vote, Phone, Headphones, Settings, ChevronDown, Crown } from 'lucide-react-native';
import { HoverableView } from './HoverableView';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';

type Theme = 'light' | 'dark';

interface MenuItem {
  title: string;
  icon: string;
  route?: string;
  subItems?: Array<{
    title: string;
    route: '/home' | '/prefeito' | '/config' | '/apoiadores' | '/liderancas' | '/coordenadores' | '/assessores' | '/vereadores' | '/deputados-estaduais' | '/deputados-federais' | '/agenda' | '/suporte';
  }>;
}

type ExpandedMenus = {
  [key: string]: boolean;
};

interface Sidebar2Props {
  onNavigate?: (route: string) => void;
  currentPath?: string;
  onToggle?: (expanded: boolean) => void;
  isExpanded?: boolean;
}

export default function Sidebar2({ 
  onNavigate, 
  currentPath = '/home', 
  onToggle,
  isExpanded = true 
}: Sidebar2Props) {
  const router = useRouter();
  const { currentTheme } = useTheme() as { currentTheme: Theme };
  const [expandedMenus, setExpandedMenus] = React.useState<ExpandedMenus>({
    'Base de Dados': false,
    'Eleições MS': currentPath === '/prefeito'
  });

  useEffect(() => {
    setExpandedMenus({
      'Base de Dados': false,
      'Eleições MS': currentPath === '/prefeito'
    });
  }, [currentPath]);

  const handleItemPress = (item: MenuItem) => {
    if (item.route && onNavigate) {
      setExpandedMenus({ 'Base de Dados': false, 'Eleições MS': false });
      onNavigate(item.route);
    } else if (item.subItems) {
      if (!isExpanded && onToggle) {
        onToggle(true);
      }
      const title = item.title as keyof ExpandedMenus;
      setExpandedMenus(prev => ({
        'Base de Dados': false,
        'Eleições MS': false,
        [title]: !prev[title]
      }));
    }
  };

  const handleSubItemPress = (route: string) => {
    console.log('handleSubItemPress chamado com rota:', route);
    try {
      router.push(route as any);
      console.log('Navegação executada com sucesso para:', route);
    } catch (error) {
      console.error('Erro ao navegar:', error);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LineChart':
        return <LineChart size={20} color={COLORS[currentTheme].primaryText} strokeWidth={1.5} />;
      case 'Database':
        return <Database size={20} color={COLORS[currentTheme].primaryText} strokeWidth={1.5} />;
      case 'Vote':
        return <Vote size={20} color={COLORS[currentTheme].primaryText} strokeWidth={1.5} />;
      case 'Phone':
        return <Phone size={20} color={COLORS[currentTheme].primaryText} strokeWidth={1.5} />;
      case 'Headphones':
        return <Headphones size={20} color={COLORS[currentTheme].primaryText} strokeWidth={1.5} />;
      case 'Settings':
        return <Settings size={20} color={COLORS[currentTheme].primaryText} strokeWidth={1.5} />;
      default:
        return null;
    }
  };

  const menuItems: MenuItem[] = [
    {
      title: 'BI Servidores',
      icon: 'LineChart',
      route: '/home'
    },
    {
      title: 'Base de Dados',
      icon: 'Database',
      subItems: [
        { title: 'Apoiadores', route: '/apoiadores' },
        { title: 'Lideranças', route: '/liderancas' },
        { title: 'Coordenadores', route: '/coordenadores' },
        { title: 'Assesssores', route: '/assessores' }
      ]
    },
    {
      title: 'Eleições MS',
      icon: 'Vote',
      subItems: [
        { title: 'Prefeitos', route: '/prefeito' },
        { title: 'Vereadores', route: '/vereadores' },
        { title: 'Deputados Estaduais', route: '/deputados-estaduais' },
        { title: 'Deputados Federais', route: '/deputados-federais' }
      ]
    },
    {
      title: 'Agenda Telefônica',
      icon: 'Phone',
      route: '/agenda'
    },
    {
      title: 'Suporte do Sistema',
      icon: 'Headphones',
      route: '/suporte'
    },
    {
      title: 'Configurações',
      icon: 'Settings',
      route: '/config'
    }
  ];

  const handleLogoPress = () => {
    if (onNavigate) {
      onNavigate('/home');
    }
  };

  return (
    <View style={[
      styles.sidebarContainer,
      { 
        backgroundColor: COLORS[currentTheme].primaryBackground,
        width: isExpanded ? 220 : 70,
      }
    ]}>
      {/* Linha divisória vertical */}
      <View style={[
        styles.verticalDivider,
        { backgroundColor: COLORS[currentTheme].divider }
      ]} />
      
      <View style={[
        styles.headerContainer,
        { borderBottomColor: COLORS[currentTheme].divider }
      ]}>
        <TouchableOpacity 
          style={styles.logoContainer}
          onPress={handleLogoPress}
          activeOpacity={0.7}
        >
          <Image 
            source={isExpanded ? require('@/assets/images/gov-ms.png') : require('@/assets/images/Logotipo Design.png')}
            style={[styles.logoImage, { width: isExpanded ? '100%' : 40, height: isExpanded ? 60 : 40 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.menuScroll}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        scrollIndicatorInsets={{ right: 2 }}
      >
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <View key={index}>
              <HoverableView
                style={styles.menuItem}
                isActive={item.route === currentPath || (item.subItems && expandedMenus[item.title])}
                activeBackgroundColor="transparent"
                onPress={() => handleItemPress(item)}
                hoverTranslateX={4}
              >
                {(item.route === currentPath || (item.subItems && expandedMenus[item.title])) && (
                  <LinearGradient
                    colors={[COLORS[currentTheme].primary + '20', COLORS[currentTheme].primary + '05']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.activeBackground]}
                  />
                )}
                <View style={styles.menuIconContainer}>
                  {getIcon(item.icon)}
                </View>
                {isExpanded && (
                  <Text style={[
                    styles.menuItemText,
                    (item.route === currentPath || (item.subItems && expandedMenus[item.title])) && styles.menuItemTextActive,
                    { color: COLORS[currentTheme].primaryText }
                  ]}>
                    {item.title}
                  </Text>
                )}
                {isExpanded && item.subItems && (
                  <View style={[
                    styles.arrowContainer,
                    expandedMenus[item.title] && styles.arrowContainerRotated
                  ]}>
                    <ChevronDown
                      size={20}
                      color={COLORS[currentTheme].primaryText}
                      strokeWidth={1.5}
                    />
                  </View>
                )}
                {item.route === currentPath && (
                  <View style={[
                    styles.activeIndicator,
                    { 
                      backgroundColor: COLORS[currentTheme].primary,
                      ...(Platform.OS === 'web' ? {
                        filter: `drop-shadow(0 0 10px ${COLORS[currentTheme].primary}40)`
                      } : {})
                    }
                  ]} />
                )}
              </HoverableView>

              {isExpanded && item.subItems && expandedMenus[item.title] && (
                <View style={styles.subMenuContainer}>
                  {item.subItems.map((subItem, subIndex) => (
                    <HoverableView
                      key={subIndex}
                      style={[
                        styles.subMenuItem,
                        subItem.route === currentPath ? {
                          backgroundColor: COLORS[currentTheme].primary + '10',
                        } : {}
                      ]}
                      isActive={subItem.route === currentPath}
                      activeBackgroundColor="transparent"
                      onPress={() => handleSubItemPress(subItem.route)}
                      hoverTranslateX={4}
                    >
                      <View style={[
                        styles.dot,
                        { 
                          backgroundColor: subItem.route === currentPath 
                            ? COLORS[currentTheme].primary 
                            : COLORS[currentTheme].primaryText 
                        }
                      ]} />
                      <Text style={[
                        styles.subMenuText,
                        { 
                          color: subItem.route === currentPath 
                            ? COLORS[currentTheme].primary 
                            : COLORS[currentTheme].primaryText,
                          fontWeight: subItem.route === currentPath ? '600' : '400'
                        }
                      ]}>
                        {subItem.title}
                      </Text>
                      {subItem.route === currentPath && (
                        <View style={[
                          styles.activeIndicator,
                          { backgroundColor: COLORS[currentTheme].primary }
                        ]} />
                      )}
                    </HoverableView>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Linha divisória e texto da Secretaria */}
      {isExpanded && (
        <View style={[
          styles.footerContainer, 
          { 
            borderTopColor: COLORS[currentTheme].divider,
            backgroundColor: COLORS[currentTheme].primaryBackground 
          }
        ]}>
          <Text style={[
            styles.secretariaText, 
            { color: COLORS[currentTheme].secondaryText }
          ]}>
            Secretaria de Estado da{'\n'}Casa Civil - MS
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarContainer: {
    position: 'absolute',
    height: '100%',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  verticalDivider: {
    position: 'absolute',
    width: 1,
    height: '100%',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  headerContainer: {
    width: '100%',
    height: 64,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 0,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: -SPACING.md,
    paddingTop: SPACING.md,
  },
  logoImage: {
    width: '100%',
    height: 60,
  },
  logoImageCollapsed: {
    width: 40,
    height: 40,
  },
  menuScroll: {
    flex: 1,
    ...(Platform.OS === 'web' ? {
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(0,0,0,0.2) transparent',
    } : {}),
  },
  menuContainer: {
    paddingHorizontal: SPACING.sm,
    gap: 1,
    marginTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    position: 'relative',
    paddingHorizontal: SPACING.md,
    marginBottom: 2,
    overflow: 'hidden',
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    marginLeft: SPACING.sm,
    fontSize: 14,
    flex: 1,
    zIndex: 1,
  },
  menuItemTextActive: {
    fontWeight: '600',
    ...(Platform.OS === 'web' ? {
      textShadow: '0 0 20px rgba(0,0,0,0.1)',
    } : {}),
  },
  activeBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS.lg,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 3,
    height: 24,
    borderTopRightRadius: BORDER_RADIUS.sm,
    borderBottomRightRadius: BORDER_RADIUS.sm,
    transform: [{ translateY: -12 }],
    ...(Platform.OS === 'web' ? {
      transition: 'all 0.3s ease',
    } : {}),
  },
  arrowContainer: {
    transform: [{ rotate: '0deg' }],
  },
  arrowContainerRotated: {
    transform: [{ rotate: '180deg' }],
  },
  subMenuContainer: {
    marginLeft: 55,
    marginBottom: 4,
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    opacity: 0.8,
  },
  subMenuText: {
    fontSize: 14,
    flex: 1,
  },
  footerContainer: {
    borderTopWidth: 1,
    paddingVertical: SPACING.lg,
    width: '100%',
    paddingHorizontal: SPACING.lg,
    position: 'absolute',
    bottom: 0,
  },
  secretariaText: {
    ...TYPOGRAPHY.mobile.small,
    textAlign: 'center',
    lineHeight: 18,
  },
});
