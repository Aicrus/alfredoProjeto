import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Ops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emoji}>😅</ThemedText>
        <ThemedText type="title" style={styles.title}>Página não encontrada</ThemedText>
        <ThemedText style={styles.description}>
          Desculpe, mas a página que você está procurando não existe.
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link" style={styles.linkText}>Voltar para a página inicial</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#007AFF',
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
