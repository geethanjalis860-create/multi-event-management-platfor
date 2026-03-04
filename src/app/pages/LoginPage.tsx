import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useEventContext } from '../contexts/EventContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'admin' ? 'admin' : 'participant';
  
  const { addParticipant, setCurrentUser, setUserRole } = useEventContext();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'admin' | 'participant'>(defaultRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    // For demo purposes, create/login user
    const participant = addParticipant({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
    });

    setCurrentUser(participant);
    setUserRole(role);

    toast.success(`Welcome, ${formData.name}!`);

    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/events');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to EventHub</CardTitle>
          <CardDescription>
            {role === 'admin' 
              ? 'Admin login to manage events and participants' 
              : 'Login to register for events and join teams'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={role} onValueChange={(v) => setRole(v as 'admin' | 'participant')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="participant">Participant</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="participant">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    type="text"
                    placeholder="Your company or institution"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Continue as Participant
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="admin-name">Full Name *</Label>
                  <Input
                    id="admin-name"
                    type="text"
                    placeholder="Admin Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="admin-email">Email *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-medium mb-1">Admin Access</p>
                  <p>You will have full access to event management, participant data, and notification systems.</p>
                </div>

                <Button type="submit" className="w-full">
                  Continue as Admin
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-gray-500 mt-6">
            This is a demo platform. No real authentication is required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
