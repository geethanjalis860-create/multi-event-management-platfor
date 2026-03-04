import { useState } from 'react';
import { useEventContext } from '../../contexts/EventContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Calendar, Users, TrendingUp, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Event } from '../../types';

export function AdminDashboard() {
  const { 
    events, 
    registrations, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    checkInParticipant 
  } = useEventContext();

  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<Event | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    venueLink: '',
    category: '',
    capacity: 50,
    registrationDeadline: '',
    status: 'draft' as 'draft' | 'published' | 'ongoing' | 'completed',
  });

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      venueLink: '',
      category: '',
      capacity: 50,
      registrationDeadline: '',
      status: 'draft',
    });
    setSelectedEvent(null);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue,
      venueLink: event.venueLink || '',
      category: event.category,
      capacity: event.capacity,
      registrationDeadline: event.registrationDeadline,
      status: event.status,
    });
    setShowEventDialog(true);
  };

  const handleSubmit = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.startTime || !eventForm.endTime || !eventForm.venue || !eventForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventForm);
      toast.success('Event updated successfully');
    } else {
      addEvent(eventForm);
      toast.success('Event created successfully');
    }

    setShowEventDialog(false);
    resetForm();
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
      toast.success('Event deleted successfully');
    }
  };

  const handleCheckIn = (registrationId: string) => {
    checkInParticipant(registrationId);
    toast.success('Participant checked in');
  };

  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.status === 'published' || e.status === 'ongoing').length;
  const totalRegistrations = registrations.filter(r => r.status === 'confirmed').length;
  const checkedInCount = registrations.filter(r => r.checkedIn).length;

  const getEventRegistrations = (eventId: string) => {
    return registrations.filter(r => r.eventId === eventId && r.status !== 'cancelled');
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      draft: 'secondary',
      published: 'default',
      ongoing: 'default',
      completed: 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage events and monitor registrations</p>
        </div>
        <Button onClick={() => setShowEventDialog(true)}>
          <Plus className="size-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-gray-500">{publishedEvents} published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-gray-500">Confirmed participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <CheckCircle className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedInCount}</div>
            <p className="text-xs text-gray-500">Attendance rate: {totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Registration</CardTitle>
            <TrendingUp className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0}
            </div>
            <p className="text-xs text-gray-500">Per event</p>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>Manage all your events</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No events created yet. Click "Create Event" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => {
                  const eventRegs = getEventRegistrations(event.id);
                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500">{event.venue}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(event.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {event.startTime} - {event.endTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {eventRegs.length} / {event.capacity}
                        </div>
                        <div className="text-xs text-gray-500">
                          {eventRegs.filter(r => r.checkedIn).length} checked in
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEventForDetails(event);
                              setShowDetailsDialog(true);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Event Form Dialog */}
      <Dialog open={showEventDialog} onOpenChange={(open) => {
        setShowEventDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>
              {selectedEvent ? 'Update event information' : 'Fill in the details to create a new event'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Annual Tech Conference 2026"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Describe your event..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  placeholder="Technology, Workshop, etc."
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="deadline">Registration Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={eventForm.registrationDeadline}
                  onChange={(e) => setEventForm({ ...eventForm, registrationDeadline: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="venue">Venue *</Label>
              <Input
                id="venue"
                value={eventForm.venue}
                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                placeholder="Main Auditorium, Building A"
              />
            </div>

            <div>
              <Label htmlFor="venueLink">Venue Link (Optional)</Label>
              <Input
                id="venueLink"
                value={eventForm.venueLink}
                onChange={(e) => setEventForm({ ...eventForm, venueLink: e.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={eventForm.status} onValueChange={(value: any) => setEventForm({ ...eventForm, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowEventDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                {selectedEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEventForDetails?.title}</DialogTitle>
            <DialogDescription>Event attendees and check-in management</DialogDescription>
          </DialogHeader>

          {selectedEventForDetails && (
            <Tabs defaultValue="attendees">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
                <TabsTrigger value="info">Event Info</TabsTrigger>
              </TabsList>

              <TabsContent value="attendees" className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {getEventRegistrations(selectedEventForDetails.id).length} total registrations
                  </p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getEventRegistrations(selectedEventForDetails.id).map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell>{reg.participantName}</TableCell>
                        <TableCell className="text-sm text-gray-600">{reg.participantEmail}</TableCell>
                        <TableCell>
                          <Badge variant={reg.status === 'confirmed' ? 'default' : 'secondary'}>
                            {reg.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {reg.checkedIn ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="size-4" />
                              <span className="text-sm">
                                {reg.checkedInAt && format(new Date(reg.checkedInAt), 'MMM dd, h:mm a')}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-400">
                              <XCircle className="size-4" />
                              <span className="text-sm">Not checked in</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!reg.checkedIn && (
                            <Button size="sm" onClick={() => handleCheckIn(reg.id)}>
                              Check In
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <p className="text-sm">
                      {format(new Date(selectedEventForDetails.date), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <Label>Time</Label>
                    <p className="text-sm">
                      {selectedEventForDetails.startTime} - {selectedEventForDetails.endTime}
                    </p>
                  </div>
                  <div>
                    <Label>Venue</Label>
                    <p className="text-sm">{selectedEventForDetails.venue}</p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p className="text-sm">{selectedEventForDetails.category}</p>
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <p className="text-sm">{selectedEventForDetails.capacity} participants</p>
                  </div>
                  <div>
                    <Label>Registration Deadline</Label>
                    <p className="text-sm">
                      {format(new Date(selectedEventForDetails.registrationDeadline), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedEventForDetails.description}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
