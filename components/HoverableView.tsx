import React, { useState } from 'react';
import { Pressable, StyleSheet, Platform, ViewStyle, PressableProps } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';
import { COLORS } from '@/constants/DesignSystem';

interface HoverableViewProps extends PressableProps {
  children: React.ReactNode;
  isActive?: boolean;
  activeBackgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
  hoverScale?: number;
  hoverTranslateX?: number;
  disableHoverBackground?: boolean;
}

export function HoverableView({
  children,
  isActive,
  activeBackgroundColor,
  style,
  hoverScale = 1.002,
  hoverTranslateX = 0,
  disableHoverBackground = false,
  ...props
}: HoverableViewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { currentTheme } = useTheme();

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        style,
        isActive && activeBackgroundColor && {
          backgroundColor: activeBackgroundColor,
        },
        isHovered && !isActive && !disableHoverBackground && {
          backgroundColor: COLORS[currentTheme].hover,
        },
        (!isActive && (isHovered || pressed)) && {
          transform: [
            { scale: pressed ? 0.98 : hoverScale },
            { translateX: isHovered ? hoverTranslateX : 0 }
          ],
        },
        Platform.select({
          web: {
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isHovered && !isActive ? `0 0 0 1px ${COLORS[currentTheme].primary}15` : 'none',
          },
        }),
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
} 