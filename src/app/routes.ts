import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { EventsPage } from './pages/EventsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { ParticipantDashboard } from './pages/participant/ParticipantDashboard';
import { ParticipantTeams } from './pages/participant/ParticipantTeams';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'login',
        Component: LoginPage,
      },
      {
        path: 'events',
        Component: EventsPage,
      },
      {
        path: 'announcements',
        Component: AnnouncementsPage,
      },
      {
        path: 'admin/dashboard',
        Component: AdminDashboard,
      },
      {
        path: 'admin/notifications',
        Component: AdminNotifications,
      },
      {
        path: 'participant/dashboard',
        Component: ParticipantDashboard,
      },
      {
        path: 'participant/teams',
        Component: ParticipantTeams,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);