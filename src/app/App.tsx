import { RouterProvider } from 'react-router';
import { EventProvider } from './contexts/EventContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <EventProvider>
      <RouterProvider router={router} />
      <Toaster />
    </EventProvider>
  );
}
