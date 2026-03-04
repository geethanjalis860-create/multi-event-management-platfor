import { useNavigate } from 'react-router';
import { useEventContext } from '../../contexts/EventContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar, MapPin, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export function ParticipantDashboard() {
  const navigate = useNavigate();
  const { currentUser, registrations, events, teams } = useEventContext();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Please login to view your dashboard</p>
            <Button className="mt-4" onClick={() => navigate('/login')}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const myRegistrations = registrations.filter(
    r => r.participantId === currentUser.id && r.status !== 'cancelled'
  );

  const myTeams = teams.filter(
    t => t.leaderId === currentUser.id || 
         t.members.some(m => m.email === currentUser.email && m.status === 'confirmed')
  );

  const upcomingEvents = myRegistrations
    .map(reg => events.find(e => e.id === reg.eventId))
    .filter(event => event && new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime());

  const pastEvents = myRegistrations
    .map(reg => events.find(e => e.id === reg.eventId))
    .filter(event => event && new Date(event.date) < new Date())
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Registrations</CardTitle>
            <Calendar className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myRegistrations.length}</div>
            <p className="text-xs text-gray-500">
              {upcomingEvents.length} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Teams</CardTitle>
            <Users className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myTeams.length}</div>
            <p className="text-xs text-gray-500">
              {myTeams.filter(t => t.leaderId === currentUser.id).length} as leader
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
            <CheckCircle className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myRegistrations.filter(r => r.checkedIn).length}
            </div>
            <p className="text-xs text-gray-500">Events attended</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Events you're registered for</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="size-12 mx-auto mb-4 text-gray-400" />
              <p>No upcoming events</p>
              <Button className="mt-4" onClick={() => navigate('/events')}>
                Browse Events
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                if (!event) return null;
                const registration = myRegistrations.find(r => r.eventId === event.id);
                
                return (
                  <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{event.category}</Badge>
                          {registration?.status === 'waitlist' && (
                            <Badge variant="secondary">
                              <AlertCircle className="size-3 mr-1" />
                              Waitlist
                            </Badge>
                          )}
                          {registration?.teamName && (
                            <Badge>Team: {registration.teamName}</Badge>
                          )}
                        </div>
                      </div>
                      {registration?.checkedIn && (
                        <Badge className="bg-green-600">
                          <CheckCircle className="size-3 mr-1" />
                          Checked In
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="size-4" />
                        <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="size-4" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="size-4" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Teams */}
      {myTeams.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Teams</CardTitle>
                <CardDescription>Teams you're part of</CardDescription>
              </div>
              <Button onClick={() => navigate('/participant/teams')}>
                View All Teams
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTeams.slice(0, 4).map((team) => {
                const event = events.find(e => e.id === team.eventId);
                const isLeader = team.leaderId === currentUser.id;
                const confirmedMembers = team.members.filter(m => m.status === 'confirmed').length;

                return (
                  <div key={team.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{team.name}</h4>
                        {event && (
                          <p className="text-sm text-gray-500">{event.title}</p>
                        )}
                      </div>
                      {isLeader && (
                        <Badge variant="secondary">Leader</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="size-4" />
                      <span>{confirmedMembers + 1} / {team.maxMembers} members</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Events</CardTitle>
            <CardDescription>Events you've attended</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastEvents.slice(0, 5).map((event) => {
                if (!event) return null;
                const registration = myRegistrations.find(r => r.eventId === event.id);
                
                return (
                  <div key={event.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-500">
                        {format(new Date(event.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    {registration?.checkedIn ? (
                      <Badge className="bg-green-600">
                        <CheckCircle className="size-3 mr-1" />
                        Attended
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Registered</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
