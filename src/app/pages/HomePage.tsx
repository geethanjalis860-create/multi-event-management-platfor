import { Link } from 'react-router';
import { Calendar, Users, Bell, CheckCircle, BarChart, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Create and manage multiple events with schedules, venues, and capacity limits.',
    },
    {
      icon: Users,
      title: 'Team Formation',
      description: 'Create teams, invite members, and collaborate with other participants.',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Stay updated with email, WhatsApp, and in-app announcements.',
    },
    {
      icon: CheckCircle,
      title: 'Registration & Check-in',
      description: 'Easy registration process with automated check-in system.',
    },
    {
      icon: BarChart,
      title: 'Analytics Dashboard',
      description: 'Track attendance, registrations, and event performance metrics.',
    },
    {
      icon: Shield,
      title: 'Admin Controls',
      description: 'Comprehensive admin panel for complete event oversight.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Manage Multiple Events with Ease
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              A comprehensive platform for hosting events, managing registrations, 
              forming teams, and keeping participants informed.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  Get Started
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to organize successful events and manage participants efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-blue-500 transition-colors">
                <CardContent className="pt-6">
                  <feature.icon className="size-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="bg-blue-600 text-white rounded-full size-12 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">For Admins</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Create and publish events</li>
                  <li>• Set schedules, venues, and capacities</li>
                  <li>• Monitor registrations and attendance</li>
                  <li>• Send notifications to participants</li>
                  <li>• Manage check-ins and updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="bg-green-600 text-white rounded-full size-12 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">For Participants</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Browse and register for events</li>
                  <li>• Create or join teams</li>
                  <li>• Invite team members</li>
                  <li>• Receive event notifications</li>
                  <li>• Track your registrations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join EventHub today and experience seamless event management.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login?role=admin">
                <Button size="lg" variant="secondary">
                  Admin Login
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  Participant Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
