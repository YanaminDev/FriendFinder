// ─── FriendFinder Mock Data ───────────────────────────────────────────────────

import { User, MatchProfile, ChatConversation, ChatMessage, Notification, HistoryItem, Venue, Activity } from '../types';

export const MOCK_CURRENT_USER: User = {
  id: 'user_001', username: 'SXN_BOXS', name: 'SXN_BOXS',
  avatar: 'https://i.pravatar.cc/150?img=12', age: 21, gender: 'Male',
  birthDate: '03/10/2004', bio: 'เขียนอธิบายเกี่ยวกับตัวคุณ...',
  interestedGender: 'Female', lookingFor: 'Find Friend', education: 'ปริญญาตรี',
  height: 175, language: 'ภาษาไทย', bloodGroup: 'B', drinking: 'Often',
  smoking: 'Always', workout: 'Never', pets: 'Cat',
  photos: ['https://picsum.photos/seed/sxn1/400/500'],
  interests: ['Movie', 'Gaming', 'Shopping'],
};

export const MOCK_MATCH_PROFILES: MatchProfile[] = [
  {
    id: 'match_001', username: 'Hanni NewJeans', name: 'Hanni NewJeans',
    avatar: 'https://picsum.photos/seed/hanni/400/600', age: 20, gender: 'Female',
    lookingFor: 'Looking For Love', interests: ['GAMING', 'Shopping', 'Movie'],
    photos: ['https://picsum.photos/seed/hanni1/400/600', 'https://picsum.photos/seed/hanni2/400/600'],
    bio: 'คำอธิบายเกี่ยวกับตัวเขา....', education: 'ปริญญาตรี', height: 163,
    language: 'ภาษาไทย', bloodGroup: 'A', drinking: 'Often', smoking: 'Never',
    workout: 'Sometimes', pets: 'None',
  },
  {
    id: 'match_002', username: 'Punch Love Cat', name: 'Punch Love Cat',
    avatar: 'https://picsum.photos/seed/punch/400/600', age: 19, gender: 'Female',
    lookingFor: 'Looking For Love', interests: ['Shopping', 'Movie'],
    photos: ['https://picsum.photos/seed/punch1/400/600'],
    bio: '', education: 'ปริญญาตรี', height: 160, language: 'ภาษาไทย',
    bloodGroup: 'O', drinking: 'Sometimes', smoking: 'Never', workout: 'Sometimes', pets: 'Dog',
  },
];

export const MOCK_CONVERSATIONS: ChatConversation[] = [
  { id: 'conv_001', user: { id: 'u2', username: 'Gussuke', name: 'Gussuke', avatar: 'https://i.pravatar.cc/150?img=5', age: 22, gender: 'Female', isOnline: true }, lastMessage: 'สวัสดีฮาฟ สาวสวย', lastMessageTime: '2:48 PM', unreadCount: 1 },
  { id: 'conv_002', user: { id: 'u3', username: 'ur4avf0lk', name: 'ur4avf0lk', avatar: 'https://i.pravatar.cc/150?img=8', age: 23, gender: 'Male', isOnline: true }, lastMessage: 'https://google.com', lastMessageTime: '1:30 PM', unreadCount: 0 },
  { id: 'conv_003', user: { id: 'u4', username: 'monowin.sj', name: 'monowin.sj', avatar: 'https://i.pravatar.cc/150?img=9', age: 25, gender: 'Male', isOnline: false }, lastMessage: 'อาจารย์ให้ผมผ่าน figma เถอะคับ', lastMessageTime: '12:00 PM', unreadCount: 0 },
  { id: 'conv_004', user: { id: 'u5', username: 'pv.tanta_bun', name: 'pv.tanta_bun', avatar: 'https://i.pravatar.cc/150?img=10', age: 21, gender: 'Female', isOnline: false }, lastMessage: 'กินหมูรียัง', lastMessageTime: '11:00 AM', unreadCount: 0 },
  { id: 'conv_005', user: { id: 'u6', username: 'duck_f69', name: 'duck_f69', avatar: 'https://i.pravatar.cc/150?img=11', age: 20, gender: 'Male', isOnline: false }, lastMessage: 'Hello', lastMessageTime: '10:00 AM', unreadCount: 0 },
  { id: 'conv_006', user: { id: 'u7', username: 'pooh._tana', name: 'pooh._tana', avatar: 'https://i.pravatar.cc/150?img=13', age: 22, gender: 'Female', isOnline: false }, lastMessage: 'กินหมูรียัง', lastMessageTime: '9:00 AM', unreadCount: 0 },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'msg_001', senderId: 'u2', text: 'สวัสดีครับ เป็นยังไงบ้าง?', timestamp: '18:15', isMine: false },
  { id: 'msg_002', senderId: 'user_001', text: 'สบายดีครับ แล้วคุณล่ะ?', timestamp: '18:17', isMine: true },
  { id: 'msg_003', senderId: 'u2', text: 'ดีมากเลย ขอบคุณที่ถาม วันนี้อากาศดีมากเลย', timestamp: '18:20', isMine: false },
  { id: 'msg_004', senderId: 'user_001', text: 'ใช่เลย อยากออกไปเดินเล่นมาก วันนี้ว่างไหม?', timestamp: '18:22', isMine: true },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u2', avatar: 'https://i.pravatar.cc/150?img=5', message: 'มีคน Match กับคุณแล้ว แนะนำให้ match กันเลย', time: '5:10 PM', hasActions: true, isRead: false },
  { id: 'n2', userId: 'u8', avatar: 'https://i.pravatar.cc/150?img=14', message: 'มีคน Match กับคุณแล้ว แนะนำให้ match กันเลย', time: '5:10 PM', hasActions: false, isRead: true },
];

export const MOCK_VENUES: Venue[] = [
  {
    id: 'v1', name: 'Major Cineplex', category: 'Movie', image: 'https://picsum.photos/seed/cinema/200/150',
    successfulMatches: 12, address: '1799 ถ. พหลโยธิน แขวงจตุจักร เขตจตุจักร', phone: '0873568243',
    openHours: 'open Mon-Fri 8:30 AM - 9:30 PM',
    description: 'A comfortable and immersive place to enjoy movies together.',
    reviews: [
      { id: 'r1', userId: 'u2', username: 'Gussuke', avatar: 'https://i.pravatar.cc/150?img=5', comment: 'A comfortable cinema with great sound and a clear screen.', liked: true },
      { id: 'r2', userId: 'user_001', username: 'SXN_BOXS', avatar: 'https://picsum.photos/seed/sxn1/50/50', comment: 'Perfect for relaxing and enjoying a movie together.', liked: true },
    ],
  },
  { id: 'v2', name: 'Game Center', category: 'GAMING', image: 'https://picsum.photos/seed/game/200/150', successfulMatches: 6, address: '123 ถนนสุขุมวิท', phone: '0812345678', openHours: 'open Daily 10:00 AM - 10:00 PM', description: 'Fun gaming center with a wide variety of arcade games.', reviews: [] },
  { id: 'v3', name: 'BLUE CAT CAFE', category: 'Coffee', image: 'https://picsum.photos/seed/cafe/200/150', successfulMatches: 2, address: '456 ถนนสีลม', phone: '0898765432', openHours: 'open Daily 8:00 AM - 8:00 PM', description: 'Cozy cat cafe with great coffee.', reviews: [] },
];

export const MOCK_HISTORY: HistoryItem[] = [
  {
    id: 'h1', date: '25 มกราคม 2569', venue: MOCK_VENUES[0],
    personReview: { id: 'pr1', userId: 'user_001', username: 'SXN_BOXS', avatar: 'https://picsum.photos/seed/sxn1/50/50', comment: '"A kind and reliable person who always gives their best."', liked: true },
    locationReview: { id: 'lr1', userId: 'user_001', username: 'SXN_BOXS', avatar: 'https://picsum.photos/seed/sxn1/50/50', comment: 'A comfortable cinema with great sound and a clear screen. Perfect for relaxing and enjoying a movie together.', liked: true },
  },
  {
    id: 'h2', date: '27 มกราคม 2569', venue: MOCK_VENUES[0],
    personReview: { id: 'pr2', userId: 'user_001', username: 'SXN_BOXS', avatar: 'https://picsum.photos/seed/sxn1/50/50', comment: '"A kind and reliable person who always gives their best."', liked: true },
    locationReview: { id: 'lr2', userId: 'user_001', username: 'SXN_BOXS', avatar: 'https://picsum.photos/seed/sxn1/50/50', comment: 'A comfortable cinema with great sound and a clear screen.', liked: true },
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1', name: 'GAMING',           icon: '🎮', isPopular: true },
  { id: 'a2', name: 'Singing',          icon: '🎤', isPopular: true },
  { id: 'a3', name: 'Shopping',         icon: '🛒', isPopular: true },
  { id: 'a4', name: 'Reading',          icon: '📖', isPopular: true },
  { id: 'a5', name: 'Movie',            icon: '🎬', isPopular: true, isRecommended: true },
  { id: 'a6', name: 'Gym',              icon: '🏋️', isPopular: true },
  { id: 'a7', name: 'Working Together', icon: '💼', isPopular: true, isRecommended: true },
  { id: 'a8', name: 'Coffee',           icon: '☕', isPopular: true, isRecommended: true },
  { id: 'a9', name: 'Shopping',         icon: '🛍️', isRecommended: true },
];
