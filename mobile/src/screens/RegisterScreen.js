import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AuthLayout, { form } from './AuthLayout';
import { useAuth } from '../AuthContext';
import { accountTypes, colors } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [f, setF] = useState({ displayName: '', email: '', password: '', accountType: 'PERSON' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!f.displayName.trim() || !f.email.trim()) return setError('Enter a name and an email.');
    if (f.password.length < 8) return setError('Use a password of at least 8 characters.');
    setBusy(true); setError('');
    try { await signUp(f); } catch (e) { setError(e.message); setBusy(false); }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Government and organization accounts are marked verified after review.">
      <Text style={form.label}>I’m joining as</Text>
      <View style={s.types}>
        {Object.entries(accountTypes).map(([key, t]) => {
          const on = f.accountType === key;
          return (
            <Pressable key={key} onPress={() => set('accountType')(key)} accessibilityRole="radio" accessibilityState={{ selected: on }}
              style={[s.type, on && { borderColor: t.color, backgroundColor: t.color }]}>
              <Text style={[s.typeText, on && { color: '#fff' }]}>{t.single}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={form.label}>{f.accountType === 'PERSON' ? 'Full name' : 'Name of the ' + accountTypes[f.accountType].single.toLowerCase()}</Text>
      <TextInput style={form.input} value={f.displayName} onChangeText={set('displayName')} />
      <Text style={form.label}>Email</Text>
      <TextInput style={form.input} value={f.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" />
      <Text style={form.label}>Password</Text>
      <TextInput style={form.input} value={f.password} onChangeText={set('password')} secureTextEntry placeholder="At least 8 characters" />
      {!!error && <Text style={form.error} accessibilityRole="alert">{error}</Text>}
      <Pressable style={[form.button, busy && { opacity: 0.7 }]} onPress={submit} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={form.buttonText}>Create account</Text>}
      </Pressable>
      <Text style={form.link} onPress={() => navigation.goBack()}>I already have an account</Text>
    </AuthLayout>
  );
}

const s = StyleSheet.create({
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  type: { borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  typeText: { color: colors.ink, fontWeight: '600', fontSize: 14 },
});
