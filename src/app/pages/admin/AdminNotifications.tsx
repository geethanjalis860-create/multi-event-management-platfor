import { useState } from 'react';
import { useEventContext } from '../../contexts/EventContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Mail, MessageSquare, Megaphone, Send, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function AdminNotifications() {
  const { 
    events, 
    registrations, 
    sendNotification, 
    notifications,
    addAnnouncement,
    announcements,
    deleteAnnouncement 
  } = useEventContext();

  const [notificationForm, setNotificationForm] = useState({
    type: 'email' as 'email' | 'whatsapp' | 'announcement',
    title: '',
    message: '',
    eventId: '',
    recipientType: 'all' as 'all' | 'event',
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    eventId: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    expiresAt: '',
  });

  const handleSendNotification = () => {
    if (!notificationForm.title || !notificationForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    let recipients: string[] = [];

    if (notificationForm.recipientType === 'all') {
      recipients = Array.from(new Set(registrations.map(r => r.participantEmail)));
    } else if (notificationForm.eventId) {
      recipients = registrations
        .filter(r => r.eventId === notificationForm.eventId && r.status === 'confirmed')
        .map(r => r.participantEmail);
    }

    if (recipients.length === 0) {
      toast.error('No recipients found');
      return;
    }

    sendNotification({
      type: notificationForm.type,
      title: notificationForm.title,
      message: notificationForm.message,
      recipients,
      eventId: notificationForm.eventId || undefined,
    });

    toast.success(`${notificationForm.type === 'email' ? 'Email' : notificationForm.type === 'whatsapp' ? 'WhatsApp message' : 'Announcement'} sent to ${recipients.length} recipient(s)`);

    setNotificationForm({
      type: 'email',
      title: '',
      message: '',
      eventId: '',
      recipientType: 'all',
    });
  };

  const handleCreateAnnouncement = () => {
    if (!announcementForm.title || !announcementForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    addAnnouncement({
      title: announcementForm.title,
      message: announcementForm.message,
      eventId: announcementForm.eventId || undefined,
      priority: announcementForm.priority,
      expiresAt: announcementForm.expiresAt || undefined,
    });

    toast.success('Announcement created successfully');

    setAnnouncementForm({
      title: '',
      message: '',
      eventId: '',
      priority: 'medium',
      expiresAt: '',
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement(id);
      toast.success('Announcement deleted');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="size-4" />;
      case 'whatsapp':
        return <MessageSquare className="size-4" />;
      case 'announcement':
        return <Megaphone className="size-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-orange-600';
      case 'low':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notifications & Announcements</h1>
        <p className="text-gray-600">Send updates to participants and manage announcements</p>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList>
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Send Notification Tab */}
        <TabsContent value="send">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compose Notification</CardTitle>
                <CardDescription>Send email or WhatsApp messages to participants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="type">Notification Type</Label>
                  <Select 
                    value={notificationForm.type} 
                    onValueChange={(value: any) => setNotificationForm({ ...notificationForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="size-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="size-4" />
                          WhatsApp
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="recipientType">Recipients</Label>
                  <Select 
                    value={notificationForm.recipientType} 
                    onValueChange={(value: any) => setNotificationForm({ ...notificationForm, recipientType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Registered Participants</SelectItem>
                      <SelectItem value="event">Specific Event Participants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {notificationForm.recipientType === 'event' && (
                  <div>
                    <Label htmlFor="event">Select Event</Label>
                    <Select 
                      value={notificationForm.eventId} 
                      onValueChange={(value) => setNotificationForm({ ...notificationForm, eventId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="title">Subject / Title *</Label>
                  <Input
                    id="title"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    placeholder="Event Reminder: Tech Conference 2026"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    placeholder="Your message here..."
                    rows={6}
                  />
                </div>

                <Button onClick={handleSendNotification} className="w-full">
                  <Send className="size-4 mr-2" />
                  Send {notificationForm.type === 'email' ? 'Email' : 'WhatsApp Message'}
                </Button>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  <p className="font-medium mb-1">Mock Notification</p>
                  <p>This is a demo platform. Notifications are simulated and not actually sent.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>Notification overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Sent</p>
                    <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Recipients</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Array.from(new Set(notifications.flatMap(n => n.recipients))).length}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Recent Notifications</h4>
                  <div className="space-y-2">
                    {notifications.slice(-5).reverse().map((notification) => (
                      <div key={notification.id} className="border rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(notification.sentAt), 'MMM dd, h:mm a')} • {notification.recipients.length} recipients
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No notifications sent yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Announcement</CardTitle>
                <CardDescription>Post announcements visible to all users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ann-title">Title *</Label>
                  <Input
                    id="ann-title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    placeholder="Important Update"
                  />
                </div>

                <div>
                  <Label htmlFor="ann-message">Message *</Label>
                  <Textarea
                    id="ann-message"
                    value={announcementForm.message}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                    placeholder="Announcement details..."
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="ann-priority">Priority</Label>
                  <Select 
                    value={announcementForm.priority} 
                    onValueChange={(value: any) => setAnnouncementForm({ ...announcementForm, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ann-event">Related Event (Optional)</Label>
                  <Select 
                    value={announcementForm.eventId} 
                    onValueChange={(value) => setAnnouncementForm({ ...announcementForm, eventId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ann-expires">Expires At (Optional)</Label>
                  <Input
                    id="ann-expires"
                    type="date"
                    value={announcementForm.expiresAt}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, expiresAt: e.target.value })}
                  />
                </div>

                <Button onClick={handleCreateAnnouncement} className="w-full">
                  <Megaphone className="size-4 mr-2" />
                  Create Announcement
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Announcements</CardTitle>
                <CardDescription>Manage current announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements
                    .filter(a => !a.expiresAt || new Date(a.expiresAt) > new Date())
                    .map((announcement) => {
                      const event = announcement.eventId 
                        ? events.find(e => e.id === announcement.eventId)
                        : null;

                      return (
                        <div key={announcement.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getPriorityColor(announcement.priority)}>
                                  {announcement.priority}
                                </Badge>
                                {event && (
                                  <Badge variant="outline" className="text-xs">
                                    <Calendar className="size-3 mr-1" />
                                    {event.title}
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-medium">{announcement.title}</h4>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{format(new Date(announcement.createdAt), 'MMM dd, yyyy h:mm a')}</span>
                            {announcement.expiresAt && (
                              <span>Expires: {format(new Date(announcement.expiresAt), 'MMM dd, yyyy')}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {announcements.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">No announcements created yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>View all sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        No notifications sent yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    notifications.slice().reverse().map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type)}
                            <span className="capitalize">{notification.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{notification.message}</p>
                          </div>
                        </TableCell>
                        <TableCell>{notification.recipients.length} people</TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(notification.sentAt), 'MMM dd, yyyy h:mm a')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={notification.status === 'sent' ? 'default' : 'secondary'}>
                            {notification.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
