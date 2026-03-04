import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, Registration, Team, Participant, Notification, Announcement } from '../types';
import { seedEvents } from '../utils/seedData';

interface EventContextType {
  events: Event[];
  registrations: Registration[];
  teams: Team[];
  participants: Participant[];
  notifications: Notification[];
  announcements: Announcement[];
  currentUser: Participant | null;
  userRole: 'admin' | 'participant' | null;
  
  // Event methods
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  // Registration methods
  registerForEvent: (eventId: string, participant: Participant, teamId?: string) => void;
  checkInParticipant: (registrationId: string) => void;
  cancelRegistration: (registrationId: string) => void;
  
  // Team methods
  createTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  joinTeam: (teamId: string, member: Omit<TeamMember, 'id' | 'status'>) => void;
  updateTeamMemberStatus: (teamId: string, memberId: string, status: 'confirmed' | 'declined') => void;
  
  // Participant methods
  addParticipant: (participant: Omit<Participant, 'id' | 'createdAt'>) => void;
  setCurrentUser: (participant: Participant | null) => void;
  setUserRole: (role: 'admin' | 'participant' | null) => void;
  
  // Notification methods
  sendNotification: (notification: Omit<Notification, 'id' | 'sentAt' | 'status'>) => void;
  
  // Announcement methods
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'participant' | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const storedEvents = localStorage.getItem('events');
      const storedRegistrations = localStorage.getItem('registrations');
      const storedTeams = localStorage.getItem('teams');
      const storedParticipants = localStorage.getItem('participants');
      const storedNotifications = localStorage.getItem('notifications');
      const storedAnnouncements = localStorage.getItem('announcements');
      const storedUser = localStorage.getItem('currentUser');
      const storedRole = localStorage.getItem('userRole');

      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // Load seed data if no events exist
        const initialEvents = seedEvents.map(event => ({
          ...event,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        setEvents(initialEvents);
      }
      
      if (storedRegistrations) setRegistrations(JSON.parse(storedRegistrations));
      if (storedTeams) setTeams(JSON.parse(storedTeams));
      if (storedParticipants) setParticipants(JSON.parse(storedParticipants));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
      if (storedRole) setUserRole(JSON.parse(storedRole));
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('userRole', JSON.stringify(userRole));
  }, [userRole]);

  // Event methods
  const addEvent = (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(events.map(event => 
      event.id === id 
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    setRegistrations(registrations.filter(reg => reg.eventId !== id));
    setTeams(teams.filter(team => team.eventId !== id));
  };

  // Registration methods
  const registerForEvent = (eventId: string, participant: Participant, teamId?: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const eventRegistrations = registrations.filter(r => r.eventId === eventId && r.status !== 'cancelled');
    const isFull = eventRegistrations.length >= event.capacity;

    const team = teamId ? teams.find(t => t.id === teamId) : undefined;

    const newRegistration: Registration = {
      id: crypto.randomUUID(),
      eventId,
      participantId: participant.id,
      participantName: participant.name,
      participantEmail: participant.email,
      teamId,
      teamName: team?.name,
      registeredAt: new Date().toISOString(),
      checkedIn: false,
      status: isFull ? 'waitlist' : 'confirmed',
    };

    setRegistrations([...registrations, newRegistration]);
  };

  const checkInParticipant = (registrationId: string) => {
    setRegistrations(registrations.map(reg => 
      reg.id === registrationId 
        ? { ...reg, checkedIn: true, checkedInAt: new Date().toISOString() }
        : reg
    ));
  };

  const cancelRegistration = (registrationId: string) => {
    setRegistrations(registrations.map(reg => 
      reg.id === registrationId 
        ? { ...reg, status: 'cancelled' }
        : reg
    ));
  };

  // Team methods
  const createTeam = (team: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...team,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTeams([...teams, newTeam]);
  };

  const joinTeam = (teamId: string, member: Omit<TeamMember, 'id' | 'status'>) => {
    setTeams(teams.map(team => {
      if (team.id === teamId && team.members.length < team.maxMembers) {
        return {
          ...team,
          members: [...team.members, {
            ...member,
            id: crypto.randomUUID(),
            status: 'pending',
          }],
        };
      }
      return team;
    }));
  };

  const updateTeamMemberStatus = (teamId: string, memberId: string, status: 'confirmed' | 'declined') => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.map(member => 
            member.id === memberId ? { ...member, status } : member
          ),
        };
      }
      return team;
    }));
  };

  // Participant methods
  const addParticipant = (participant: Omit<Participant, 'id' | 'createdAt'>) => {
    const newParticipant: Participant = {
      ...participant,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setParticipants([...participants, newParticipant]);
    return newParticipant;
  };

  // Notification methods
  const sendNotification = (notification: Omit<Notification, 'id' | 'sentAt' | 'status'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      sentAt: new Date().toISOString(),
      status: 'sent',
    };
    setNotifications([...notifications, newNotification]);
  };

  // Announcement methods
  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setAnnouncements([...announcements, newAnnouncement]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== id));
  };

  return (
    <EventContext.Provider
      value={{
        events,
        registrations,
        teams,
        participants,
        notifications,
        announcements,
        currentUser,
        userRole,
        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        checkInParticipant,
        cancelRegistration,
        createTeam,
        joinTeam,
        updateTeamMemberStatus,
        addParticipant,
        setCurrentUser,
        setUserRole,
        sendNotification,
        addAnnouncement,
        deleteAnnouncement,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
}