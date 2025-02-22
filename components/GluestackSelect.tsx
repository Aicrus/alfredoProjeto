import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@gluestack-ui/themed";
import { View, Platform } from 'react-native';
import { SPACING, BORDER_RADIUS, COLORS } from '@/constants/DesignSystem';
import { useTheme } from '@/hooks/ThemeContext';
import { Feather } from '@expo/vector-icons';

interface Item {
  label: string;
  value: string | number;
}

interface GluestackSelectProps {
  label?: string;
  items: Item[];
  value: string | number | null;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
}

type Theme = 'light' | 'dark';

export function GluestackSelect({
  label,
  items,
  value,
  onValueChange,
  placeholder = "Selecione..."
}: GluestackSelectProps) {
  const { currentTheme } = useTheme() as { currentTheme: Theme };
  const stringValue = value?.toString() || "";

  return (
    <View>
      <Select
        selectedValue={stringValue}
        onValueChange={onValueChange}
      >
        <SelectTrigger
          variant="outline"
          size="md"
          style={{
            borderWidth: 1,
            borderColor: COLORS[currentTheme].divider,
            borderRadius: BORDER_RADIUS.md,
            backgroundColor: COLORS[currentTheme].primaryBackground,
            height: 40,
            paddingHorizontal: SPACING.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <SelectInput 
            placeholder={placeholder}
            fontSize={14}
            flex={1}
            paddingRight={40}
            style={{
              color: COLORS[currentTheme].primaryText,
              ...Platform.select({
                web: {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                default: {
                  numberOfLines: 1,
                }
              }),
            }}
          />
          <View style={{ 
            position: 'absolute',
            right: SPACING.md,
            height: '100%',
            justifyContent: 'center'
          }}>
            <Feather 
              name="chevron-down" 
              size={16} 
              color={COLORS[currentTheme].icon}
            />
          </View>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                label={item.label}
                value={item.value.toString()}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  );
} 