import { StyleSheet } from 'react-native';
export const commentRowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(163, 230, 53, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A3E635',
  },
  contentWrapper: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  commentContent: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
  },
});