// Type definitions for the event management platform

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  venueLink?: string;
  category: string;
  capacity: number;
  registrationDeadline: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role?: string;
  status: 'confirmed' | 'pending' | 'declined';
}

export interface Team {
  id: string;
  eventId: string;
  name: string;
  leaderId: string;
  leaderName: string;
  leaderEmail: string;
  members: TeamMember[];
  maxMembers: number;
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  teamId?: string;
  teamName?: string;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
}

export interface Notification {
  id: string;
  type: 'email' | 'whatsapp' | 'announcement';
  title: string;
  message: string;
  recipients: string[];
  eventId?: string;
  sentAt: string;
  status: 'sent' | 'pending' | 'failed';
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  eventId?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  expiresAt?: string;
}
