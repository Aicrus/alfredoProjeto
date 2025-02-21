import { StyleSheet, View, Image } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from '@/constants/DesignSystem';
import { useTheme } from '@/hooks/ThemeContext';

type AuthImageProps = {
  type: 'login' | 'register';
};

export function AuthImage({ type }: AuthImageProps) {
  const { width } = useWindowDimensions();
  const { currentTheme } = useTheme();
  const isDesktopOrTablet = width >= BREAKPOINTS.tablet;

  if (!isDesktopOrTablet) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: '#003366' } // Azul escuro institucional
    ]}>
      <Image
        source={require('../assets/images/brasao-ms.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  }
}); 