import React from 'react';
import { StyleSheet, Platform, ScrollView, useWindowDimensions, Animated, Easing, Image, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import { usePessoas, Pessoa } from '@/hooks/usePessoas';
import { useToast } from '@/hooks/useToast';
import { FormularioPessoa } from '@/components/FormularioPessoa';

type Theme = 'light' | 'dark';
type ColorScheme = typeof COLORS.light & typeof COLORS.dark;

interface ThemeContextType {
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  currentTheme: Theme;
}

const EXPANDED_WIDTH = 220;
const COLLAPSED_WIDTH = 68;

export default function ConfigScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isMobile, isTablet, isDesktop } = useBreakpoints();
  const { isExpanded, toggleSidebar } = useSidebar();
  const animatedWidth = useRef(new Animated.Value(isMobile ? 0 : isExpanded ? 220 : 70)).current;
  const { currentTheme } = useTheme() as ThemeContextType;
  const [searchText, setSearchText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Pessoa | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const {
    pessoas,
    loading,
    error,
    totalCount,
    fetchPessoas,
    deletePessoa,
    addPessoa
  } = usePessoas();

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    fetchPessoas(currentPage, itemsPerPage, searchText);
  }, [currentPage, searchText]);

  useFocusEffect(
    useCallback(() => {
      // Quando a tela receber foco
      setShowForm(false);
      fetchPessoas(1, itemsPerPage, '');
    }, [])
  );

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

  const handleConfigClick = (event: any, user: Pessoa) => {
    const rect = event.target.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 5,
      left: rect.left - 120,
    });
    setSelectedUser(user);
    setMenuVisible(true);
  };

  const handleViewUser = () => {
    if (selectedUser) {
      console.log('Visualizar usuário:', selectedUser.nome);
      // Implementar visualização detalhada
    }
    setMenuVisible(false);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      console.log('Editar usuário:', selectedUser.nome);
      // Implementar edição
    }
    setMenuVisible(false);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      const { success, error } = await deletePessoa(selectedUser.id);
      
      if (success) {
        showToast({
          type: 'success',
          message: 'Usuário excluído',
          description: 'O usuário foi excluído com sucesso.',
        });
      } else {
        showToast({
          type: 'error',
          message: 'Erro ao excluir',
          description: error || 'Não foi possível excluir o usuário.',
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
    setCurrentPage(1); // Volta para a primeira página ao pesquisar
  };

  const handleAddUser = () => {
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleSaveForm = async (dados: any) => {
    try {
      const { success, error, data } = await addPessoa(dados);
      
      if (success) {
        showToast({
          type: 'success',
          message: 'Usuário cadastrado',
          description: 'O usuário foi cadastrado com sucesso.',
        });
        setShowForm(false);
        fetchPessoas(1, itemsPerPage, ''); // Recarrega a primeira página
        setCurrentPage(1);
      } else {
        showToast({
          type: 'error',
          message: 'Erro ao cadastrar',
          description: error || 'Não foi possível cadastrar o usuário.',
        });
      }
    } catch (err) {
      showToast({
        type: 'error',
        message: 'Erro ao cadastrar',
        description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      });
    }
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
    },
    tableContainer: {
      borderWidth: 1,
      borderColor: COLORS[currentTheme].divider,
      borderRadius: BORDER_RADIUS.md,
      overflow: 'hidden',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: COLORS[currentTheme].primary,
      padding: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS[currentTheme].divider,
      alignItems: 'center',
    },
    headerText: {
      flex: 1,
      ...TYPOGRAPHY.mobile.labelMedium,
      color: '#FFFFFF',
      paddingHorizontal: SPACING.xs,
      marginLeft: SPACING.md,
    },
    tableRow: {
      flexDirection: 'row',
      padding: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS[currentTheme].divider,
      alignItems: 'center',
      backgroundColor: COLORS[currentTheme].primaryBackground,
    },
    photoContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: SPACING.md,
    },
    userPhoto: {
      width: 40,
      height: 40,
      borderRadius: 20,
      resizeMode: 'cover',
    },
    cellText: {
      flex: 1,
      ...TYPOGRAPHY.mobile.body,
      color: COLORS[currentTheme].primaryText,
      paddingHorizontal: SPACING.xs,
      marginLeft: SPACING.md,
    },
    configCell: {
      flex: 1,
      alignItems: 'center',
    },
    configText: {
      ...TYPOGRAPHY.mobile.labelLarge,
      color: COLORS[currentTheme].secondaryText,
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
    addButton: {
      backgroundColor: COLORS[currentTheme].primary,
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
      gap: SPACING.md,
    },
    paginationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: COLORS[currentTheme].primary,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      height: 40,
      gap: SPACING.xs,
    },
    paginationButtonDisabled: {
      borderColor: COLORS[currentTheme].divider,
      opacity: 0.5,
    },
    paginationText: {
      ...TYPOGRAPHY.mobile.labelMedium,
      color: COLORS[currentTheme].primary,
    },
    paginationTextDisabled: {
      color: COLORS[currentTheme].secondaryText,
    },
    paginationInfo: {
      ...TYPOGRAPHY.mobile.labelMedium,
      color: COLORS[currentTheme].secondaryText,
    },
  });

  return (
    <ThemedView style={[styles.container, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
      {!isMobile && (
        <Sidebar2 
          onNavigate={handleNavigation} 
          currentPath="/config"
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
          currentPath="/config"
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
              {!showForm && (
                <ThemedView style={[styles.loremContainer, { backgroundColor: COLORS[currentTheme].secondaryBackground }]}>
                  <ThemedText style={styles.title}>
                    Base de dados de cadastro de pessoas
                  </ThemedText>
                  <ThemedText style={styles.subtitle}>
                    Relação de pessoas cadastradas no sistema
                  </ThemedText>
                </ThemedView>
              )}

              {!showForm ? (
                <>
                  <ThemedView style={styles.tableControls}>
                    <ThemedView style={styles.userCount}>
                      <ThemedText style={styles.userCountText}>
                        <ThemedText style={styles.userCountLabel}>Total de usuários: </ThemedText>
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
                          placeholder="Buscar usuário..."
                          placeholderTextColor={COLORS[currentTheme].icon}
                          value={searchText}
                          onChangeText={handleSearch}
                        />
                        <View style={styles.searchIconContainer}>
                          <Feather name="search" size={20} color={COLORS[currentTheme].icon} />
                        </View>
                      </ThemedView>

                      <TouchableOpacity style={[styles.actionButton, styles.filterButton]}>
                        <Feather name="filter" size={20} color={COLORS[currentTheme].primary} />
                        <ThemedText style={[styles.buttonText, styles.filterButtonText]}>Filtrar</ThemedText>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={[styles.actionButton, styles.addButton]}
                        onPress={handleAddUser}
                      >
                        <Feather name="plus" size={20} color="#FFFFFF" />
                        <ThemedText style={styles.buttonText}>Adicionar usuário</ThemedText>
                      </TouchableOpacity>
                    </ThemedView>
                  </ThemedView>

                  <ThemedView style={styles.tableContainer}>
                    <ThemedView style={styles.tableHeader}>
                      <View style={{ width: 40, marginLeft: SPACING.md }}>
                        <ThemedText style={[styles.headerText, { marginLeft: 0 }]}>Foto</ThemedText>
                      </View>
                      <ThemedText style={styles.headerText}>Nome</ThemedText>
                      <ThemedText style={styles.headerText}>Local de Trabalho</ThemedText>
                      <ThemedText style={styles.headerText}>Cargo</ThemedText>
                      <ThemedText style={styles.headerText}>Cidade</ThemedText>
                      <ThemedText style={styles.headerText}>Telefone</ThemedText>
                      <ThemedText style={styles.headerText}>Configurações</ThemedText>
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
                    ) : pessoas.length === 0 ? (
                      <ThemedView style={[styles.tableRow, { justifyContent: 'center', padding: SPACING.xl }]}>
                        <ThemedText style={[styles.cellText, { textAlign: 'center' }]}>
                          Nenhum usuário encontrado
                        </ThemedText>
                      </ThemedView>
                    ) : (
                      pessoas.map((pessoa) => (
                        <ThemedView key={pessoa.id} style={styles.tableRow}>
                          <View style={styles.photoContainer}>
                            <Image 
                              source={{ uri: pessoa.fotoURL || 'https://i.pravatar.cc/40' }} 
                              style={styles.userPhoto}
                            />
                          </View>
                          <ThemedText style={styles.cellText}>{pessoa.nome || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{pessoa.localTrabalho || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{pessoa.cargo || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{pessoa.cidade || '-'}</ThemedText>
                          <ThemedText style={styles.cellText}>{pessoa.telefone || '-'}</ThemedText>
                          <TouchableOpacity 
                            style={styles.configCell}
                            onPress={(e) => handleConfigClick(e, pessoa)}
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
                      onPress={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <Feather 
                        name="chevron-left" 
                        size={20} 
                        color={currentPage === 1 ? COLORS[currentTheme].secondaryText : COLORS[currentTheme].primary} 
                      />
                      <ThemedText style={[
                        styles.paginationText,
                        currentPage === 1 && styles.paginationTextDisabled
                      ]}>
                        Anterior
                      </ThemedText>
                    </TouchableOpacity>

                    <ThemedText style={styles.paginationInfo}>
                      Página {currentPage} de {totalPages}
                    </ThemedText>

                    <TouchableOpacity 
                      style={[
                        styles.paginationButton,
                        currentPage === totalPages && styles.paginationButtonDisabled,
                        Platform.OS === 'web' && { cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' } as any
                      ]}
                      onPress={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ThemedText style={[
                        styles.paginationText,
                        currentPage === totalPages && styles.paginationTextDisabled
                      ]}>
                        Próxima
                      </ThemedText>
                      <Feather 
                        name="chevron-right" 
                        size={20} 
                        color={currentPage === totalPages ? COLORS[currentTheme].secondaryText : COLORS[currentTheme].primary} 
                      />
                    </TouchableOpacity>
                  </ThemedView>
                </>
              ) : (
                <FormularioPessoa
                  onCancel={handleCancelForm}
                  onSave={handleSaveForm}
                />
              )}
            </PageContainer>
          </ThemedView>
        </ScrollView>
      </Animated.View>

      <TableActionMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        position={menuPosition}
      />
    </ThemedView>
  );
}
