import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput } from 'react-native';
import AuthLayout, { form } from './AuthLayout';
import { useAuth } from '../AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email.trim() || !password) return setError('Enter your email and password.');
    setBusy(true); setError('');
    try { await signIn(email, password); } catch (e) { setError(e.message); setBusy(false); }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Connect with people, organizations, institutes and government agencies.">
      <Text style={form.label}>Email</Text>
      <TextInput style={form.input} value={email} onChangeText={setEmail} autoCapitalize="none"
        keyboardType="email-address" autoComplete="email" placeholder="you@example.com" />
      <Text style={form.label}>Password</Text>
      <TextInput style={form.input} value={password} onChangeText={setPassword} secureTextEntry
        autoComplete="password" onSubmitEditing={submit} />
      {!!error && <Text style={form.error} accessibilityRole="alert">{error}</Text>}
      <Pressable style={[form.button, busy && { opacity: 0.7 }]} onPress={submit} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={form.buttonText}>Sign in</Text>}
      </Pressable>
      <Text style={form.link} onPress={() => navigation.navigate('Register')}>Create an account</Text>
    </AuthLayout>
  );
}
