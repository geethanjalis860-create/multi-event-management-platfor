import { useEventContext } from '../contexts/EventContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bell, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function AnnouncementsPage() {
  const { announcements, events } = useEventContext();

  const activeAnnouncements = announcements
    .filter(a => {
      if (a.expiresAt) {
        return new Date(a.expiresAt) > new Date();
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-orange-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Announcements</h1>
        <p className="text-gray-600">Stay updated with the latest news and updates</p>
      </div>

      {activeAnnouncements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Bell className="size-12 mx-auto mb-4 text-gray-400" />
            <p>No announcements at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeAnnouncements.map((announcement) => {
            const event = announcement.eventId 
              ? events.find(e => e.id === announcement.eventId)
              : null;

            return (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority.toUpperCase()}
                        </Badge>
                        {event && (
                          <Badge variant="outline">
                            <Calendar className="size-3 mr-1" />
                            {event.title}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      {format(new Date(announcement.createdAt), 'MMM dd, yyyy')}
                      <br />
                      {format(new Date(announcement.createdAt), 'h:mm a')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{announcement.message}</p>
                  {announcement.expiresAt && (
                    <p className="text-xs text-gray-500 mt-3">
                      Expires on {format(new Date(announcement.expiresAt), 'MMM dd, yyyy')}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
