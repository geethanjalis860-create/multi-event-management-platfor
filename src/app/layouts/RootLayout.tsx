import { Link, Outlet, useLocation } from 'react-router';
import { useEventContext } from '../contexts/EventContext';
import { Button } from '../components/ui/button';
import { Bell, Calendar, Users, LogOut, User } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export function RootLayout() {
  const location = useLocation();
  const { currentUser, userRole, setCurrentUser, setUserRole, announcements } = useEventContext();

  const activeAnnouncements = announcements.filter(a => {
    if (a.expiresAt) {
      return new Date(a.expiresAt) > new Date();
    }
    return true;
  });

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Calendar className="size-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">EventHub</h1>
                <p className="text-xs text-gray-500">Multi-Event Management</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              {currentUser ? (
                <>
                  <Link 
                    to="/events" 
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      location.pathname === '/events' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Events
                  </Link>
                  
                  {isAdmin ? (
                    <>
                      <Link 
                        to="/admin/dashboard" 
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                          location.pathname.startsWith('/admin') ? 'text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        Admin Dashboard
                      </Link>
                      <Link 
                        to="/admin/notifications" 
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                          location.pathname === '/admin/notifications' ? 'text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        Notifications
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/participant/dashboard" 
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                          location.pathname.startsWith('/participant') ? 'text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        My Dashboard
                      </Link>
                      <Link 
                        to="/participant/teams" 
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                          location.pathname === '/participant/teams' ? 'text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        My Teams
                      </Link>
                    </>
                  )}

                  <Link to="/announcements" className="relative">
                    <Button variant="ghost" size="icon">
                      <Bell className="size-5" />
                      {activeAnnouncements.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs">
                          {activeAnnouncements.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <User className="size-4" />
                        <span className="max-w-32 truncate">{currentUser.name}</span>
                        {isAdmin && (
                          <Badge variant="secondary" className="ml-1">Admin</Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="size-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/login?role=admin">
                    <Button variant="outline">Admin Login</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">EventHub</h3>
              <p className="text-sm text-gray-400">
                Multi-event management platform for seamless event organization and participation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>Event Management</li>
                <li>Team Formation</li>
                <li>Registration System</li>
                <li>Notifications</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <p className="text-sm text-gray-400">
                For support and inquiries, reach out to your event organizers.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 EventHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
