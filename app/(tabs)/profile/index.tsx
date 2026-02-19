import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  User, Globe, Calendar, ChevronRight, Bell, Palette,
  FileText, Shield, HelpCircle, Info, LogOut, Settings,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useAppState } from '@/hooks/useAppState';
import { profileResults } from '@/constants/quiz';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, trips, resetQuiz } = useAppState();
  const result = profile ? profileResults[profile] : null;

  const handleLogout = () => {
    Alert.alert('Logout', 'Vuoi davvero uscire?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Esci', style: 'destructive', onPress: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }},
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#4DD0E1', '#5C8AE6', '#7B68EE']}
          style={styles.header}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User color={Colors.white} size={36} />
            </View>
          </View>
          <Text style={styles.name}>Marco Rossi</Text>
          <Text style={styles.email}>marco.rossi@email.com</Text>
          {result && (
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>{result.title}</Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors.tealLight }]}>
            <Globe color={Colors.tealDark} size={20} />
            <Text style={[styles.statNumber, { color: Colors.tealDark }]}>12</Text>
            <Text style={styles.statLabel}>Paesi Visitati</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.purpleLight }]}>
            <Calendar color={Colors.purpleDark} size={20} />
            <Text style={[styles.statNumber, { color: Colors.purpleDark }]}>{trips.length}</Text>
            <Text style={styles.statLabel}>Viaggi Pianificati</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impostazioni Account</Text>
          <View style={styles.menuCard}>
            <MenuItem icon={User} color={Colors.teal} label="Modifica Profilo" onPress={() => router.push('/(tabs)/profile/edit-profile' as never)} />
            <View style={styles.divider} />
            <MenuItem icon={Globe} color={Colors.teal} label="Lingua" rightText="IT/EN" onPress={() => router.push('/(tabs)/profile/language' as never)} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferenze</Text>
          <View style={styles.menuCard}>
            <MenuItem icon={Bell} color={Colors.purple} label="Notifiche" onPress={() => router.push('/(tabs)/profile/notifications' as never)} />
            <View style={styles.divider} />
            <MenuItem icon={Palette} color={Colors.purple} label="Tema" rightText="Auto" onPress={() => router.push('/(tabs)/profile/theme' as never)} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legale e Info</Text>
          <View style={styles.menuCard}>
            <MenuItem icon={FileText} color={Colors.textSecondary} label="Termini di Servizio" onPress={() => router.push('/(tabs)/profile/terms' as never)} />
            <View style={styles.divider} />
            <MenuItem icon={Shield} color={Colors.textSecondary} label="Privacy Policy" onPress={() => router.push('/(tabs)/profile/privacy' as never)} />
            <View style={styles.divider} />
            <MenuItem icon={Info} color={Colors.textSecondary} label="Informazioni" onPress={() => router.push('/(tabs)/profile/info' as never)} />
            <View style={styles.divider} />
            <MenuItem icon={HelpCircle} color={Colors.textSecondary} label="Centro Assistenza" onPress={() => router.push('/(tabs)/profile/help' as never)} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <LogOut color={Colors.white} size={18} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function MenuItem({
  icon: Icon,
  color,
  label,
  rightText,
  onPress,
}: {
  icon: React.ComponentType<{ color: string; size: number }>;
  color: string;
  label: string;
  rightText?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onPress}>
      <Icon color={color} size={20} />
      <Text style={styles.menuLabel}>{label}</Text>
      <View style={styles.menuRight}>
        {rightText && <Text style={styles.menuRightText}>{rightText}</Text>}
        <ChevronRight color={Colors.textLight} size={18} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  name: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  profileBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profileBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: -16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800' as const,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuLabel: {
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuRightText: {
    fontSize: 13,
    color: Colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.background,
    marginLeft: 48,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.coral,
    marginHorizontal: 16,
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 50,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});
