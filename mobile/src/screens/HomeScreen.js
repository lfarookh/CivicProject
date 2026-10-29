import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { accountTypes, colors } from '../theme';

const FILTERS = [{ key: null, label: 'Everyone' }, ...Object.entries(accountTypes).map(([key, t]) => ({ key, label: t.label }))];

function timeAgo(iso) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h`;
  return `${Math.floor(m / 1440)}d`;
}

function PostCard({ post, onLike }) {
  const t = accountTypes[post.author.accountType];
  return (
    <View style={[s.card, { borderLeftColor: t.color }]}>
      <View style={s.row}>
        <Text style={s.author} numberOfLines={1}>{post.author.displayName}</Text>
        {post.author.verified && <Text style={[s.badge, { color: t.color }]} accessibilityLabel="Verified">✓ Verified</Text>}
        <Text style={s.meta}>{t.single} · {timeAgo(post.createdAt)}</Text>
      </View>
      <Text style={s.content}>{post.content}</Text>
      <Pressable onPress={() => onLike(post.id)} style={s.like} accessibilityRole="button"
        accessibilityLabel={post.likedByMe ? 'Remove like' : 'Like'}>
        <Text style={[s.likeText, post.likedByMe && { color: colors.teal }]}>{post.likedByMe ? '♥' : '♡'} {post.likes}</Text>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [filter, setFilter] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const busy = useRef(false);

  const load = useCallback(async (reset) => {
    if (busy.current) return;
    busy.current = true; setError('');
    const next = reset ? 0 : page + 1;
    try {
      const rows = await api.feed(next, filter);
      setPosts((p) => (reset ? rows : [...p, ...rows]));
      setPage(next); setDone(rows.length < 20);
    } catch (e) { setError(e.message); }
    busy.current = false; setLoading(false); setRefreshing(false);
  }, [page, filter]);

  useEffect(() => { setLoading(true); setDone(false); load(true); /* eslint-disable-next-line */ }, [filter]);

  const publish = async () => {
    if (!draft.trim()) return;
    setPosting(true);
    try { const p = await api.post(draft); setPosts((x) => [p, ...x]); setDraft(''); } catch (e) { setError(e.message); }
    setPosting(false);
  };

  const like = async (id) => {
    try { const u = await api.like(id); setPosts((x) => x.map((p) => (p.id === id ? u : p))); } catch (e) { setError(e.message); }
  };

  const me = accountTypes[user.accountType];

  const header = (
    <View>
      <View style={s.composer}>
        <TextInput style={s.compose} multiline value={draft} onChangeText={setDraft} maxLength={2000}
          placeholder={`Share an update as ${user.displayName}`} placeholderTextColor={colors.slate} />
        <Pressable style={[s.postBtn, (!draft.trim() || posting) && { opacity: 0.5 }]} onPress={publish} disabled={!draft.trim() || posting}>
          <Text style={s.postBtnText}>Post</Text>
        </Pressable>
      </View>
      <View style={s.filters}>
        {FILTERS.map((f) => (
          <Pressable key={String(f.key)} onPress={() => setFilter(f.key)} accessibilityRole="tab" accessibilityState={{ selected: filter === f.key }}
            style={[s.chip, filter === f.key && s.chipOn]}>
            <Text style={[s.chipText, filter === f.key && { color: '#fff' }]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>
      {!!error && <Text style={s.error}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={s.root}>
      <View style={s.bar}>
        <View style={{ flex: 1 }}>
          <Text style={s.brand}>CivicNet</Text>
          <Text style={[s.who, { color: me.color }]} numberOfLines={1}>{user.displayName} · {me.single}</Text>
        </View>
        <Pressable onPress={signOut} accessibilityRole="button"><Text style={s.out}>Sign out</Text></Pressable>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(p) => String(p.id)}
        renderItem={({ item }) => <PostCard post={item} onLike={like} />}
        ListHeaderComponent={header}
        contentContainerStyle={s.list}
        refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); setDone(false); load(true); }}
        onEndReachedThreshold={0.4}
        onEndReached={() => { if (!done && !loading) load(false); }}
        ListEmptyComponent={loading ? <ActivityIndicator style={{ marginTop: 40 }} color={colors.teal} /> :
          <Text style={s.empty}>Nothing here yet. Post the first update to start the conversation.</Text>}
        ListFooterComponent={!done && posts.length > 0 ? <ActivityIndicator style={{ margin: 20 }} color={colors.teal} /> : null}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mist },
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.line },
  brand: { fontSize: 20, fontWeight: '800', color: colors.ink },
  who: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  out: { color: colors.slate, fontWeight: '600', fontSize: 14 },
  list: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 16, paddingBottom: 48 },
  composer: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.line, padding: 12 },
  compose: { minHeight: 64, fontSize: 16, color: colors.ink, textAlignVertical: 'top' },
  postBtn: { alignSelf: 'flex-end', backgroundColor: colors.teal, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 9, marginTop: 8 },
  postBtnText: { color: '#fff', fontWeight: '700' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 14 },
  chip: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { color: colors.ink, fontWeight: '600', fontSize: 14 },
  card: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.line, borderLeftWidth: 4, padding: 14, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 },
  author: { fontSize: 16, fontWeight: '700', color: colors.ink, flexShrink: 1 },
  badge: { fontSize: 12, fontWeight: '700' },
  meta: { fontSize: 13, color: colors.slate },
  content: { fontSize: 16, lineHeight: 23, color: colors.ink, marginTop: 8 },
  like: { alignSelf: 'flex-start', marginTop: 12, paddingVertical: 4 },
  likeText: { fontSize: 15, color: colors.slate, fontWeight: '600' },
  error: { color: colors.danger, marginBottom: 10 },
  empty: { textAlign: 'center', color: colors.slate, marginTop: 40, fontSize: 15, paddingHorizontal: 24 },
});
