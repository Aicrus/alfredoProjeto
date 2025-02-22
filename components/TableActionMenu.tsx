import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Pressable, Platform } from 'react-native';
import { Eye, Edit, Trash2 } from 'lucide-react-native';
import { ThemedText } from './ThemedText';
import { HoverableView } from './HoverableView';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/DesignSystem';
import { useTheme } from '@/hooks/ThemeContext';

interface TableActionMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  position: {
    top: number;
    left: number;
  };
}

export function TableActionMenu({ isVisible, onClose, onView, onEdit, onDelete, position }: TableActionMenuProps) {
  const { currentTheme } = useTheme();
  const themeColors = COLORS[currentTheme];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(5)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 5,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: themeColors.secondaryBackground,
            borderColor: themeColors.divider,
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
            top: position.top,
            left: position.left,
          },
        ]}
      >
        <HoverableView
          style={styles.menuItem}
          onPress={() => {
            onView();
            onClose();
          }}
          hoverScale={1.02}
        >
          <Eye size={16} color={themeColors.primaryText} />
          <ThemedText style={styles.menuItemText}>Visualizar</ThemedText>
        </HoverableView>

        <HoverableView
          style={styles.menuItem}
          onPress={() => {
            onEdit();
            onClose();
          }}
          hoverScale={1.02}
        >
          <Edit size={16} color={themeColors.primaryText} />
          <ThemedText style={styles.menuItemText}>Editar</ThemedText>
        </HoverableView>

        <HoverableView
          style={styles.menuItem}
          onPress={() => {
            onDelete();
            onClose();
          }}
          hoverScale={1.02}
        >
          <Trash2 size={16} color={themeColors.tertiary} />
          <ThemedText style={[styles.menuItemText, { color: themeColors.tertiary }]}>
            Excluir
          </ThemedText>
        </HoverableView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 45,
      },
      default: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 45,
      }
    })
  },
  container: {
    position: 'absolute',
    width: 150,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    zIndex: 50,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    gap: SPACING.xs,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  menuItemText: {
    fontSize: 13,
  },
}); 