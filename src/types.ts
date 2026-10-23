export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  caption: string;
  imageUrl: string;
  rotation?: number;
}

export interface SectionTexts {
  heroSubtitle: string;
  heroConfettiBtn: string;
  heroCakeBtn: string;

  letterKicker: string;
  letterBadge: string;
  letterSignature: string;
  wishesHeader: string;

  cakeBadge: string;
  cakeTitle: string;
  cakeSubtitle: string;
  cakeBlowBtn: string;
  cakeSuccessText: string;

  galleryBadge: string;
  galleryTitle: string;
  gallerySubtitle: string;

  responseBadge: string;
  responseTitle: string;
  responseSubtitle: string;
  responseSubmitBtn: string;

  footerText: string;
  footerSubtext: string;
}

export interface BirthdayContent {
  recipientName: string;
  nickname: string;
  birthDate: string;
  ageText: string;
  heroTitle: string;
  greetingMessage: string;
  wishesList: string[];
  memories: MemoryItem[];
  bgMusicTitle: string;
  notificationEmail: string;
  friendPassword: string;
  adminPin: string;
  secretLetter: string;
  sectionTexts?: Partial<SectionTexts>;
}

export interface FriendResponse {
  id: string;
  senderName: string;
  reactionEmoji: string;
  message: string;
  favoriteMemory: string;
  createdAt: string;
  emailDelivery: {
    attempted: boolean;
    success: boolean;
    destination: string;
    detail: string;
  };
}
