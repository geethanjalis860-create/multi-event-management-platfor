import { useState } from 'react';
import { useEventContext } from '../contexts/EventContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar, MapPin, Users, Clock, ExternalLink, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Event } from '../types';

export function EventsPage() {
  const { events, currentUser, registrations, registerForEvent } = useEventContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  const publishedEvents = events.filter(e => e.status === 'published' || e.status === 'ongoing');

  const filteredEvents = publishedEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(publishedEvents.map(e => e.category)));

  const handleRegister = () => {
    if (!currentUser) {
      toast.error('Please login to register for events');
      return;
    }

    if (!selectedEvent) return;

    // Check if already registered
    const existingRegistration = registrations.find(
      r => r.eventId === selectedEvent.id && 
           r.participantId === currentUser.id && 
           r.status !== 'cancelled'
    );

    if (existingRegistration) {
      toast.error('You are already registered for this event');
      return;
    }

    registerForEvent(selectedEvent.id, currentUser);
    
    const eventRegistrations = registrations.filter(
      r => r.eventId === selectedEvent.id && r.status !== 'cancelled'
    );
    const isFull = eventRegistrations.length >= selectedEvent.capacity;

    toast.success(
      isFull 
        ? 'Added to waitlist! You will be notified if a spot opens up.'
        : 'Successfully registered for the event!'
    );
    setShowRegisterDialog(false);
    setSelectedEvent(null);
  };

  const getRegistrationCount = (eventId: string) => {
    return registrations.filter(r => r.eventId === eventId && r.status !== 'cancelled').length;
  };

  const getStatusBadge = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (event.status === 'completed') {
      return <Badge variant="secondary">Completed</Badge>;
    }
    
    if (eventDate < now) {
      return <Badge variant="secondary">Past Event</Badge>;
    }

    const registrationDeadline = new Date(event.registrationDeadline);
    if (registrationDeadline < now) {
      return <Badge variant="destructive">Registration Closed</Badge>;
    }

    const registrationCount = getRegistrationCount(event.id);
    if (registrationCount >= event.capacity) {
      return <Badge variant="destructive">Full</Badge>;
    }

    return <Badge className="bg-green-600">Open</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
        <p className="text-gray-600">Browse and register for events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Calendar className="size-12 mx-auto mb-4 text-gray-400" />
            <p>No events found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const registrationCount = getRegistrationCount(event.id);
            const spotsLeft = event.capacity - registrationCount;
            const userRegistration = currentUser 
              ? registrations.find(r => r.eventId === event.id && r.participantId === currentUser.id && r.status !== 'cancelled')
              : null;

            return (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{event.category}</Badge>
                    {getStatusBadge(event)}
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="size-4" />
                    <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="size-4" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="size-4" />
                    <span className="flex-1 truncate">{event.venue}</span>
                    {event.venueLink && (
                      <a 
                        href={event.venueLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="size-4" />
                    <span>{registrationCount} / {event.capacity} registered</span>
                  </div>
                  
                  {spotsLeft > 0 && spotsLeft <= 10 && (
                    <p className="text-xs text-orange-600 font-medium">
                      Only {spotsLeft} spots left!
                    </p>
                  )}

                  {userRegistration ? (
                    <Button className="w-full" disabled variant="secondary">
                      {userRegistration.status === 'waitlist' ? 'On Waitlist' : 'Registered'}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowRegisterDialog(true);
                      }}
                      disabled={new Date(event.registrationDeadline) < new Date()}
                    >
                      Register Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Registration Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
            <DialogDescription>
              Confirm your registration for {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Event:</span>
                  <span className="text-sm font-medium">{selectedEvent.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium">
                    {format(new Date(selectedEvent.date), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time:</span>
                  <span className="text-sm font-medium">
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Venue:</span>
                  <span className="text-sm font-medium">{selectedEvent.venue}</span>
                </div>
              </div>

              {currentUser && (
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-blue-900">Your Information</p>
                  <div className="text-sm text-blue-800">
                    <p>{currentUser.name}</p>
                    <p>{currentUser.email}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowRegisterDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleRegister} className="flex-1">
                  Confirm Registration
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
