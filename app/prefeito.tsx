import React from 'react';
import { StyleSheet, Platform, ScrollView, useWindowDimensions, Animated, Easing, Image, View, TextInput, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedView } from '@/components/ThemedView';
import Sidebar2 from '@/components/Sidebar2';
import { Header } from '@/components/Header';
import { SPACING, COLORS, BORDER_RADIUS, TYPOGRAPHY } from '@/constants/DesignSystem';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { PageContainer } from '@/components/PageContainer';
import { useTheme } from '@/hooks/ThemeContext';
import { useSidebar } from '@/hooks/SidebarContext';
import { ThemedText } from '@/components/ThemedText';
import { TableActionMenu } from '@/components/TableActionMenu';
import { usePrefeitos, Politico } from '@/hooks/usePrefeitos';
import { useToast } from '@/hooks/useToast';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HoverableView } from '@/components/HoverableView';

type Theme = 'light' | 'dark';
type ColorScheme = typeof COLORS.light & typeof COLORS.dark;

interface ThemeContextType {
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  currentTheme: Theme;
}

const EXPANDED_WIDTH = 220;
const COLLAPSED_WIDTH = 68;

const adjustColor = (color: string, amount: number) => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgb = hexToRgb(color);
  if (!rgb) return color;

  return rgbToHex(
    Math.max(0, Math.min(255, rgb.r + amount)),
    Math.max(0, Math.min(255, rgb.g + amount)),
    Math.max(0, Math.min(255, rgb.b + amount))
  );
};

function PrefeitoScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isMobile, isTablet, isDesktop } = useBreakpoints();
  const { isExpanded, toggleSidebar } = useSidebar();
  const animatedWidth = useRef(new Animated.Value(isMobile ? 0 : isExpanded ? 220 : 70)).current;
  const { currentTheme } = useTheme() as ThemeContextType;
  const [searchText, setSearchText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedPrefeito, setSelectedPrefeito] = useState<Politico | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { showToast } = useToast();
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [filtroEleito, setFiltroEleito] = useState<boolean | undefined>(undefined);
  const filterMenuRef = useRef(null);

  const {
    prefeitos,
    loading,
    error,
    totalCount,
    fetchPrefeitos,
    deletePrefeito,
  } = usePrefeitos();

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    fetchPrefeitos(currentPage, itemsPerPage, searchText, filtroEleito);
  }, [currentPage, searchText, filtroEleito]);

  useFocusEffect(
    useCallback(() => {
      fetchPrefeitos(1, itemsPerPage, '', undefined);
    }, [])
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && 
          !(filterMenuRef.current as any).contains(event.target) &&
          event.target instanceof HTMLElement &&
          !event.target.closest('[data-filter-button="true"]')) {
        setFilterMenuVisible(false);
      }
    };

    if (Platform.OS === 'web') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const handleNavigation = (route: string) => {
    console.log('handleNavigation chamado em prefeito.tsx com rota:', route);
    try {
      router.replace(route as any);
      console.log('Navegação executada com sucesso');
    } catch (error) {
      console.error('Erro ao navegar:', error);
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

  const handleConfigClick = (event: any, prefeito: Politico) => {
    const rect = event.target.getBoundingClientRect();
    setSelectedPrefeito(prefeito);
    setMenuPosition({ 
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 100
    });
    setMenuVisible(true);
  };

  const handleViewPrefeito = () => {
    if (selectedPrefeito) {
      console.log('Visualizar político:', selectedPrefeito.nomeCompleto);
      // Implementar visualização detalhada
    }
    setMenuVisible(false);
  };

  const handleEditPrefeito = () => {
    if (selectedPrefeito) {
      console.log('Editar político:', selectedPrefeito.nomeCompleto);
      // Implementar edição
    }
    setMenuVisible(false);
  };

  const handleDeletePrefeito = async () => {
    if (selectedPrefeito) {
      const { success, error } = await deletePrefeito(selectedPrefeito.uuid);
      
      if (success) {
        showToast({
          type: 'success',
          message: 'Registro excluído',
          description: 'O registro foi excluído com sucesso.',
        });
      } else {
        showToast({
          type: 'error',
          message: 'Erro ao excluir',
          description: error || 'Não foi possível excluir o registro.',
        });
      }
    }
    setMenuVisible(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleFilterClick = () => {
    setFilterMenuVisible(!filterMenuVisible);
  };

  const handleFiltroEleitoChange = (value: boolean | undefined) => {
    setFiltroEleito(value);
    setFilterMenuVisible(false);
    setCurrentPage(1);
  };

  const handlePressOutside = () => {
    if (filterMenuVisible) {
      setFilterMenuVisible(false);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Primeira página
    if (startPage > 1) {
      pageNumbers.push(
        <TouchableOpacity
          key={1}
          style={[
            styles.pageNumberButton,
            currentPage === 1 && styles.pageNumberButtonActive
          ]}
          onPress={() => handlePageClick(1)}
        >
          <ThemedText style={[
            styles.pageNumberText,
            currentPage === 1 && styles.pageNumberTextActive
          ]}>1</ThemedText>
        </TouchableOpacity>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <ThemedText key="ellipsis1" style={styles.paginationInfo}>...</ThemedText>
        );
      }
    }

    // Páginas do meio
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageNumberButton,
            currentPage === i && styles.pageNumberButtonActive
          ]}
          onPress={() => handlePageClick(i)}
        >
          <ThemedText style={[
            styles.pageNumberText,
            currentPage === i && styles.pageNumberTextActive
          ]}>{i}</ThemedText>
        </TouchableOpacity>
      );
    }

    // Última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <ThemedText key="ellipsis2" style={styles.paginationInfo}>...</ThemedText>
        );
      }
      pageNumbers.push(
        <TouchableOpacity
          key={totalPages}
          style={[
            styles.pageNumberButton,
            currentPage === totalPages && styles.pageNumberButtonActive
          ]}
          onPress={() => handlePageClick(totalPages)}
        >
          <ThemedText style={[
            styles.pageNumberText,
            currentPage === totalPages && styles.pageNumberTextActive
          ]}>{totalPages}</ThemedText>
        </TouchableOpacity>
      );
    }

    return pageNumbers;
  };

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
      position: 'relative',
    },
    tableContainer: {
      borderWidth: 1,
      borderColor: COLORS[currentTheme].divider,
      borderRadius: BORDER_RADIUS.md,
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1,
    },
    tableHeader: {
      flexDirection: 'row',
      padding: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS[currentTheme].divider,
      alignItems: 'center',
      backgroundColor: COLORS[currentTheme].primary,
      ...Platform.select({
        web: {
          background: `linear-gradient(90deg, ${COLORS[currentTheme].primary} 0%, ${COLORS[currentTheme].primary} 40%, ${adjustColor(COLORS[currentTheme].primary, -30)} 100%)`,
        },
      }),
    },
    headerText: {
      flex: 1,
      ...TYPOGRAPHY.mobile.labelMedium,
      color: '#FFFFFF',
      paddingHorizontal: SPACING.xs,
      marginLeft: SPACING.sm,
    },
    tableRow: {
      flexDirection: 'row',
      padding: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS[currentTheme].divider,
      alignItems: 'center',
      backgroundColor: COLORS[currentTheme].primaryBackground,
    },
    photoContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: SPACING.sm,
    },
    userPhoto: {
      width: 32,
      height: 32,
      borderRadius: 16,
      resizeMode: 'cover',
    },
    cellText: {
      flex: 1,
      ...TYPOGRAPHY.mobile.body,
      color: COLORS[currentTheme].primaryText,
      paddingHorizontal: SPACING.xs,
      marginLeft: SPACING.sm,
      fontSize: 13,
    },
    configCell: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
    },
    configText: {
      ...TYPOGRAPHY.mobile.labelLarge,
      color: COLORS[currentTheme].secondaryText,
      fontSize: 18,
    },
    loremContainer: {
      gap: SPACING.xs,
      marginBottom: SPACING.xxxl,
    },
    title: {
      ...TYPOGRAPHY.mobile.headlineSmall,
      color: COLORS[currentTheme].primaryText,
      ...Platform.select({
        web: {
          userSelect: 'none',
        },
      }),
    },
    subtitle: {
      ...TYPOGRAPHY.mobile.labelMedium,
      color: COLORS[currentTheme].secondaryText,
      ...Platform.select({
        web: {
          userSelect: 'none',
        },
      }),
    },
    tableControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.xl,
      position: 'relative',
      zIndex: 9999,
    },
    userCount: {
      flex: 1,
    },
    userCountText: {
      ...TYPOGRAPHY.mobile.labelMedium,
    },
    userCountLabel: {
      color: COLORS[currentTheme].primaryText,
    },
    userCountNumber: {
      color: COLORS[currentTheme].secondaryText,
    },
    controlsRight: {
      flexDirection: 'row',
      gap: SPACING.sm,
      alignItems: 'center',
      position: 'relative',
      zIndex: 9999,
    },
    inputContainer: {
      position: 'relative',
      width: 300,
    },
    input: {
      width: '100%',
      height: 40,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingRight: 48,
      backgroundColor: COLORS[currentTheme].secondaryBackground,
      borderWidth: 1,
      borderColor: COLORS[currentTheme].divider,
      ...TYPOGRAPHY.mobile.body,
      color: COLORS[currentTheme].primaryText,
      shadowColor: COLORS[currentTheme].primaryText,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3.84,
      elevation: 5,
    },
    searchIconContainer: {
      position: 'absolute',
      right: SPACING.md,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS[currentTheme].primary,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      height: 40,
      gap: SPACING.xs,
      ...(Platform.OS === 'web' ? {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      } : {}),
    },
    filterButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: COLORS[currentTheme].primary,
    },
    filterButtonText: {
      color: COLORS[currentTheme].primary,
    },
    buttonText: {
      ...TYPOGRAPHY.mobile.labelMedium,
      color: '#FFFFFF',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SPACING.xl,
      gap: SPACING.xs,
      backgroundColor: COLORS[currentTheme].primaryBackground,
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.md,
      shadowColor: COLORS[currentTheme].primaryText,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    paginationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      width: 32,
      height: 32,
      borderRadius: 16,
      ...(Platform.OS === 'web' ? {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      } : {}),
    },
    paginationButtonDisabled: {
      opacity: 0.5,
    },
    pageNumbersContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: SPACING.xs,
      paddingHorizontal: SPACING.sm,
    },
    pageNumberButton: {
      minWidth: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      ...(Platform.OS === 'web' ? {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      } : {}),
    },
    pageNumberButtonActive: {
      backgroundColor: COLORS[currentTheme].primary,
    },
    pageNumberText: {
      ...TYPOGRAPHY.mobile.labelMedium,
      fontSize: 13,
      color: COLORS[currentTheme].primaryText,
    },
    pageNumberTextActive: {
      color: '#FFFFFF',
      fontWeight: '500',
    },
    paginationInfo: {
      ...TYPOGRAPHY.mobile.labelMedium,
      fontSize: 13,
      color: COLORS[currentTheme].secondaryText,
      marginHorizontal: SPACING.xs,
    },
    filterMenu: {
      position: 'absolute',
      backgroundColor: COLORS[currentTheme].primaryBackground,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.sm,
      shadowColor: COLORS[currentTheme].primaryText,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 9999,
      minWidth: 200,
      top: '100%',
      right: 0,
      marginTop: 2,
    },
    filterMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.sm,
      marginBottom: SPACING.xs,
      backgroundColor: 'transparent',
      ...(Platform.OS === 'web' ? {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      } : {}),
    },
    filterMenuItemActive: {
      backgroundColor: COLORS[currentTheme].primary + '20',
    },
    filterMenuItemText: {
      ...TYPOGRAPHY.mobile.labelMedium,
      color: COLORS[currentTheme].primaryText,
      marginLeft: SPACING.sm,
    },
  });

  return (
    <ProtectedRoute>
      <Pressable onPress={handlePressOutside} style={{ flex: 1 }}>
        <ThemedView style={[styles.container, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
          {!isMobile && (
            <Sidebar2 
              onNavigate={handleNavigation} 
              currentPath="/prefeito"
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
              currentPath="/prefeito"
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
                    <ThemedText style={styles.title}>
                      Prefeitos 2024 - 2028
                    </ThemedText>
                    <ThemedText style={styles.subtitle}>
                      Relação de candidatos
                    </ThemedText>
                  </ThemedView>

                  <ThemedView style={[styles.tableControls, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
                    <ThemedView style={styles.userCount}>
                      <ThemedText style={styles.userCountText}>
                        <ThemedText style={styles.userCountLabel}>Total de prefeitos: </ThemedText>
                        <ThemedText style={styles.userCountNumber}>{totalCount}</ThemedText>
                      </ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.controlsRight}>
                      <ThemedView style={styles.inputContainer}>
                        <TextInput
                          style={[
                            styles.input,
                            { 
                              backgroundColor: COLORS[currentTheme].primaryBackground,
                              color: COLORS[currentTheme].primaryText,
                              borderColor: COLORS[currentTheme].divider,
                              ...(Platform.OS === 'web' ? { outline: 'none' } : {}),
                            }
                          ]}
                          placeholder="Buscar por Nome Urna, Nome Completo, Partido, Cargo, Local, Ocupação ou Instrução..."
                          placeholderTextColor={COLORS[currentTheme].icon}
                          value={searchText}
                          onChangeText={handleSearch}
                        />
                        <View style={styles.searchIconContainer}>
                          <Feather name="search" size={20} color={COLORS[currentTheme].icon} />
                        </View>
                      </ThemedView>

                      <View style={{ position: 'relative', zIndex: 9999 }}>
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.filterButton]} 
                          onPress={(e) => {
                            e.stopPropagation();
                            handleFilterClick();
                          }}
                        >
                          <Feather name="filter" size={20} color={COLORS[currentTheme].primary} />
                          <ThemedText style={[styles.buttonText, styles.filterButtonText]}>
                            Filtrar {filtroEleito !== undefined ? '(1)' : ''}
                          </ThemedText>
                        </TouchableOpacity>

                        {filterMenuVisible && (
                          <Pressable onPress={(e) => e.stopPropagation()}>
                            <ThemedView 
                              style={[
                                styles.filterMenu,
                                {
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  zIndex: 99999,
                                  transform: [{ translateY: -2 }],
                                }
                              ]}
                            >
                              <HoverableView
                                style={styles.filterMenuItem}
                                isActive={filtroEleito === undefined}
                                activeBackgroundColor={COLORS[currentTheme].primary + '20'}
                                onPress={() => handleFiltroEleitoChange(undefined)}
                              >
                                <Feather 
                                  name={filtroEleito === undefined ? "check-circle" : "circle"} 
                                  size={18} 
                                  color={COLORS[currentTheme].primary}
                                />
                                <ThemedText style={styles.filterMenuItemText}>Todos</ThemedText>
                              </HoverableView>

                              <HoverableView
                                style={styles.filterMenuItem}
                                isActive={filtroEleito === true}
                                activeBackgroundColor={COLORS[currentTheme].primary + '20'}
                                onPress={() => handleFiltroEleitoChange(true)}
                              >
                                <Feather 
                                  name={filtroEleito === true ? "check-circle" : "circle"} 
                                  size={18} 
                                  color={COLORS[currentTheme].primary}
                                />
                                <ThemedText style={styles.filterMenuItemText}>Eleitos</ThemedText>
                              </HoverableView>

                              <HoverableView
                                style={styles.filterMenuItem}
                                isActive={filtroEleito === false}
                                activeBackgroundColor={COLORS[currentTheme].primary + '20'}
                                onPress={() => handleFiltroEleitoChange(false)}
                              >
                                <Feather 
                                  name={filtroEleito === false ? "check-circle" : "circle"} 
                                  size={18} 
                                  color={COLORS[currentTheme].primary}
                                />
                                <ThemedText style={styles.filterMenuItemText}>Não Eleitos</ThemedText>
                              </HoverableView>
                            </ThemedView>
                          </Pressable>
                        )}
                      </View>
                    </ThemedView>
                  </ThemedView>

                  <ThemedView style={styles.tableContainer}>
                    <ThemedView style={styles.tableHeader}>
                      <View style={{ width: 40, marginLeft: SPACING.md }}>
                        <ThemedText style={[styles.headerText, { marginLeft: 0 }]}>Foto</ThemedText>
                      </View>
                      <ThemedText style={styles.headerText}>Nome Urna</ThemedText>
                      <ThemedText style={styles.headerText}>Nome Completo</ThemedText>
                      <ThemedText style={styles.headerText}>Partido</ThemedText>
                      <ThemedText style={styles.headerText}>Cargo</ThemedText>
                      <ThemedText style={styles.headerText}>Local</ThemedText>
                      <ThemedText style={styles.headerText}>Ocupação</ThemedText>
                      <ThemedText style={styles.headerText}>Instrução</ThemedText>
                      <ThemedText style={styles.headerText}>Apoia</ThemedText>
                      <ThemedText style={styles.headerText}>Ações</ThemedText>
                    </ThemedView>
                    {loading ? (
                      <ThemedView style={[styles.tableRow, { justifyContent: 'center', padding: SPACING.xl }]}>
                        <ActivityIndicator size="large" color={COLORS[currentTheme].primary} />
                      </ThemedView>
                    ) : error ? (
                      <ThemedView style={[styles.tableRow, { justifyContent: 'center', padding: SPACING.xl }]}>
                        <ThemedText style={[styles.cellText, { textAlign: 'center', color: COLORS[currentTheme].error }]}>
                          {error}
                        </ThemedText>
                      </ThemedView>
                    ) : prefeitos.length === 0 ? (
                      <ThemedView style={[styles.tableRow, { justifyContent: 'center', padding: SPACING.xl }]}>
                        <ThemedText style={[styles.cellText, { textAlign: 'center' }]}>
                          Nenhum registro encontrado
                        </ThemedText>
                      </ThemedView>
                    ) : (
                      prefeitos.map((politico) => (
                        <ThemedView key={politico.uuid} style={styles.tableRow}>
                          <View style={styles.photoContainer}>
                            <Image 
                              source={{ uri: politico.fotoUrl || 'https://i.pravatar.cc/40' }} 
                              style={styles.userPhoto}
                            />
                          </View>
                          <ThemedText style={styles.cellText}>{politico.nomeUrna || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{politico.nomeCompleto || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{politico.siglaPartido || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{politico.cargo || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{politico.localCandidatura || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{politico.ocupacao || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{politico.grauInstrucao || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{politico.apoiaMara ? 'Sim' : 'Não'}</ThemedText>
                          <TouchableOpacity 
                            style={styles.configCell}
                            onPress={(e) => handleConfigClick(e, politico)}
                          >
                            <Feather name="more-vertical" size={16} color={COLORS[currentTheme].secondaryText} />
                          </TouchableOpacity>
                        </ThemedView>
                      ))
                    )}
                  </ThemedView>

                  <ThemedView style={styles.paginationContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.paginationButton,
                        currentPage === 1 && styles.paginationButtonDisabled,
                        Platform.OS === 'web' && { cursor: currentPage === 1 ? 'not-allowed' : 'pointer' } as any
                      ]}
                      onPress={handleFirstPage}
                      disabled={currentPage === 1}
                    >
                      <Feather 
                        name="chevrons-left" 
                        size={18}
                        color={currentPage === 1 ? COLORS[currentTheme].secondaryText : COLORS[currentTheme].primary} 
                      />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[
                        styles.paginationButton,
                        currentPage === 1 && styles.paginationButtonDisabled,
                        Platform.OS === 'web' && { cursor: currentPage === 1 ? 'not-allowed' : 'pointer' } as any
                      ]}
                      onPress={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <Feather 
                        name="chevron-left" 
                        size={18}
                        color={currentPage === 1 ? COLORS[currentTheme].secondaryText : COLORS[currentTheme].primary} 
                      />
                    </TouchableOpacity>

                    <ThemedView style={styles.pageNumbersContainer}>
                      {renderPageNumbers()}
                    </ThemedView>

                    <TouchableOpacity 
                      style={[
                        styles.paginationButton,
                        currentPage === totalPages && styles.paginationButtonDisabled,
                        Platform.OS === 'web' && { cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' } as any
                      ]}
                      onPress={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <Feather 
                        name="chevron-right" 
                        size={18}
                        color={currentPage === totalPages ? COLORS[currentTheme].secondaryText : COLORS[currentTheme].primary} 
                      />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[
                        styles.paginationButton,
                        currentPage === totalPages && styles.paginationButtonDisabled,
                        Platform.OS === 'web' && { cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' } as any
                      ]}
                      onPress={handleLastPage}
                      disabled={currentPage === totalPages}
                    >
                      <Feather 
                        name="chevrons-right" 
                        size={18}
                        color={currentPage === totalPages ? COLORS[currentTheme].secondaryText : COLORS[currentTheme].primary} 
                      />
                    </TouchableOpacity>
                  </ThemedView>
                </PageContainer>
              </ThemedView>
            </ScrollView>
          </Animated.View>

          <TableActionMenu
            isVisible={menuVisible}
            onClose={() => setMenuVisible(false)}
            onView={handleViewPrefeito}
            onEdit={handleEditPrefeito}
            onDelete={handleDeletePrefeito}
            position={menuPosition}
          />
        </ThemedView>
      </Pressable>
    </ProtectedRoute>
  );
}

export default PrefeitoScreen; 