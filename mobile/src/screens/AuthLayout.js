import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.panel}>
            <View style={s.mark}><Text style={s.markText}>CN</Text></View>
            <Text style={s.title}>{title}</Text>
            <Text style={s.sub}>{subtitle}</Text>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const form = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: colors.ink, marginTop: 16, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: colors.ink, backgroundColor: '#fff' },
  button: { backgroundColor: colors.teal, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  error: { color: colors.danger, marginTop: 14, fontSize: 14 },
  link: { color: colors.teal, fontWeight: '600', textAlign: 'center', marginTop: 22, fontSize: 15 },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mist },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  panel: { width: '100%', maxWidth: 440, alignSelf: 'center', backgroundColor: colors.card, borderRadius: 14, padding: 28, borderWidth: 1, borderColor: colors.line },
  mark: { width: 44, height: 44, borderRadius: 10, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  markText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
  title: { fontSize: 26, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 15, color: colors.slate, marginTop: 6, lineHeight: 21 },
});
