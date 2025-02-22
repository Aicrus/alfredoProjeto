import { createConfig } from "@gluestack-ui/themed";
import { config as defaultConfig } from "@gluestack-ui/config";
import { COLORS } from '@/constants/DesignSystem';

export const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      primary0: COLORS.light.primary,
      primary100: COLORS.light.primary,
      primary200: COLORS.light.primary,
      primary300: COLORS.light.primary,
      primary400: COLORS.light.primary,
      primary500: COLORS.light.primary,
      primary600: COLORS.light.primary,
      primary700: COLORS.light.primary,
      primary800: COLORS.light.primary,
      primary900: COLORS.light.primary,
    },
  },
  components: {
    Select: {
      theme: {
        _input: {
          color: {
            light: COLORS.light.primaryText,
            dark: COLORS.dark.primaryText,
          }
        }
      }
    },
    SelectTrigger: {
      theme: {
        backgroundColor: {
          light: COLORS.light.primaryBackground,
          dark: COLORS.dark.primaryBackground,
        },
        borderColor: {
          light: COLORS.light.divider,
          dark: COLORS.dark.divider,
        }
      }
    },
    SelectInput: {
      theme: {
        color: {
          light: COLORS.light.primaryText,
          dark: COLORS.dark.primaryText,
        }
      }
    },
    SelectContent: {
      theme: {
        backgroundColor: {
          light: COLORS.light.primaryBackground,
          dark: COLORS.dark.primaryBackground,
        }
      }
    },
    SelectItem: {
      theme: {
        backgroundColor: {
          light: COLORS.light.primaryBackground,
          dark: COLORS.dark.primaryBackground,
        },
        _text: {
          color: {
            light: COLORS.light.primaryText,
            dark: COLORS.dark.primaryText,
          }
        },
        _hover: {
          backgroundColor: {
            light: COLORS.light.hover,
            dark: COLORS.dark.hover,
          }
        }
      }
    }
  }
}); 