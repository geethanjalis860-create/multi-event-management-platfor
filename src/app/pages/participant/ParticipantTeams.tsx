import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useEventContext } from '../../contexts/EventContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Users, Plus, Mail, CheckCircle, XCircle, Clock, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export function ParticipantTeams() {
  const navigate = useNavigate();
  const { 
    currentUser, 
    teams, 
    events, 
    registrations,
    createTeam, 
    joinTeam,
    updateTeamMemberStatus 
  } = useEventContext();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    eventId: '',
    name: '',
    maxMembers: 5,
  });

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: '',
  });

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Please login to view teams</p>
            <Button className="mt-4" onClick={() => navigate('/login')}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get events user is registered for
  const myRegistrations = registrations.filter(
    r => r.participantId === currentUser.id && r.status === 'confirmed'
  );
  const registeredEventIds = myRegistrations.map(r => r.eventId);
  const availableEvents = events.filter(e => registeredEventIds.includes(e.id));

  // Get my teams
  const myTeams = teams.filter(
    t => t.leaderId === currentUser.id || 
         t.members.some(m => m.email === currentUser.email && m.status === 'confirmed')
  );

  // Get teams I can join (for events I'm registered for)
  const availableTeams = teams.filter(t => {
    const isRegisteredForEvent = registeredEventIds.includes(t.eventId);
    const notAlreadyMember = !myTeams.some(mt => mt.id === t.id);
    const hasSpace = t.members.filter(m => m.status === 'confirmed').length < t.maxMembers - 1;
    return isRegisteredForEvent && notAlreadyMember && hasSpace;
  });

  // Get pending invitations
  const pendingInvites = teams.filter(t => 
    t.members.some(m => m.email === currentUser.email && m.status === 'pending')
  );

  const handleCreateTeam = () => {
    if (!createForm.eventId || !createForm.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    createTeam({
      eventId: createForm.eventId,
      name: createForm.name,
      leaderId: currentUser.id,
      leaderName: currentUser.name,
      leaderEmail: currentUser.email,
      members: [],
      maxMembers: createForm.maxMembers,
    });

    toast.success('Team created successfully');
    setShowCreateDialog(false);
    setCreateForm({ eventId: '', name: '', maxMembers: 5 });
  };

  const handleJoinTeam = (teamId: string) => {
    joinTeam(teamId, {
      name: currentUser.name,
      email: currentUser.email,
      role: 'Member',
    });

    toast.success('Join request sent to team leader');
    setShowJoinDialog(false);
  };

  const handleInviteMember = () => {
    if (!inviteForm.name || !inviteForm.email || !selectedTeam) {
      toast.error('Please fill in all required fields');
      return;
    }

    joinTeam(selectedTeam, {
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role || 'Member',
    });

    toast.success('Invitation sent successfully');
    setShowInviteDialog(false);
    setInviteForm({ name: '', email: '', role: '' });
  };

  const handleRespondToInvite = (teamId: string, memberId: string, accept: boolean) => {
    updateTeamMemberStatus(teamId, memberId, accept ? 'confirmed' : 'declined');
    toast.success(accept ? 'Invitation accepted' : 'Invitation declined');
  };

  const handleApproveMember = (teamId: string, memberId: string, approve: boolean) => {
    updateTeamMemberStatus(teamId, memberId, approve ? 'confirmed' : 'declined');
    toast.success(approve ? 'Member approved' : 'Member declined');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Teams</h1>
          <p className="text-gray-600">Create and manage your event teams</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowJoinDialog(true)}>
            <UserPlus className="size-4 mr-2" />
            Join Team
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="size-4 mr-2" />
            Create Team
          </Button>
        </div>
      </div>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Clock className="size-5" />
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingInvites.map((team) => {
              const event = events.find(e => e.id === team.eventId);
              const myMembership = team.members.find(m => m.email === currentUser.email);
              
              return (
                <div key={team.id} className="bg-white border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{team.name}</h4>
                      {event && (
                        <p className="text-sm text-gray-600 mb-2">{event.title}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        Invited by: {team.leaderName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRespondToInvite(team.id, myMembership!.id, true)}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespondToInvite(team.id, myMembership!.id, false)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* My Teams */}
      <Tabs defaultValue="my-teams" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-teams">My Teams ({myTeams.length})</TabsTrigger>
          <TabsTrigger value="available">Available Teams ({availableTeams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="my-teams">
          {myTeams.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Users className="size-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-4">You're not part of any teams yet</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setShowCreateDialog(true)}>Create a Team</Button>
                  <Button variant="outline" onClick={() => setShowJoinDialog(true)}>
                    Join a Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myTeams.map((team) => {
                const event = events.find(e => e.id === team.eventId);
                const isLeader = team.leaderId === currentUser.id;
                const confirmedMembers = team.members.filter(m => m.status === 'confirmed');
                const pendingMembers = team.members.filter(m => m.status === 'pending');

                return (
                  <Card key={team.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{team.name}</CardTitle>
                          {event && (
                            <CardDescription>{event.title}</CardDescription>
                          )}
                        </div>
                        {isLeader && (
                          <Badge>Team Leader</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="size-4" />
                        <span>{confirmedMembers.length + 1} / {team.maxMembers} members</span>
                      </div>

                      {/* Team Leader */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Team Leader</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="bg-blue-100 rounded-full size-8 flex items-center justify-center text-blue-600 font-medium">
                            {team.leaderName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{team.leaderName}</p>
                            <p className="text-xs text-gray-500">{team.leaderEmail}</p>
                          </div>
                        </div>
                      </div>

                      {/* Members */}
                      {confirmedMembers.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Members</h4>
                          <div className="space-y-2">
                            {confirmedMembers.map((member) => (
                              <div key={member.id} className="flex items-center gap-2 text-sm">
                                <div className="bg-gray-200 rounded-full size-8 flex items-center justify-center text-gray-600 font-medium">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-xs text-gray-500">{member.role || 'Member'}</p>
                                </div>
                                <CheckCircle className="size-4 text-green-600" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pending Members (only visible to leader) */}
                      {isLeader && pendingMembers.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Pending Approval</h4>
                          <div className="space-y-2">
                            {pendingMembers.map((member) => (
                              <div key={member.id} className="flex items-center gap-2 text-sm bg-yellow-50 rounded p-2">
                                <div className="bg-yellow-200 rounded-full size-8 flex items-center justify-center text-yellow-700 font-medium">
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-xs text-gray-500">{member.email}</p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2"
                                    onClick={() => handleApproveMember(team.id, member.id, true)}
                                  >
                                    <CheckCircle className="size-4 text-green-600" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2"
                                    onClick={() => handleApproveMember(team.id, member.id, false)}
                                  >
                                    <XCircle className="size-4 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Invite Button (only for leader) */}
                      {isLeader && (confirmedMembers.length + 1) < team.maxMembers && (
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => {
                            setSelectedTeam(team.id);
                            setShowInviteDialog(true);
                          }}
                        >
                          <Mail className="size-4 mr-2" />
                          Invite Members
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available">
          {availableTeams.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Users className="size-12 mx-auto mb-4 text-gray-400" />
                <p>No available teams to join at the moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTeams.map((team) => {
                const event = events.find(e => e.id === team.eventId);
                const confirmedMembers = team.members.filter(m => m.status === 'confirmed');
                const spotsLeft = team.maxMembers - confirmedMembers.length - 1;

                return (
                  <Card key={team.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      {event && (
                        <CardDescription>{event.title}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p>Leader: {team.leaderName}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {confirmedMembers.length + 1} / {team.maxMembers} members
                        </span>
                        <Badge variant="secondary">{spotsLeft} spots left</Badge>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleJoinTeam(team.id)}
                      >
                        Request to Join
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Team Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Create a team for one of your registered events
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="event">Select Event *</Label>
              <Select
                value={createForm.eventId}
                onValueChange={(value) => setCreateForm({ ...createForm, eventId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an event" />
                </SelectTrigger>
                <SelectContent>
                  {availableEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="team-name">Team Name *</Label>
              <Input
                id="team-name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Team Awesome"
              />
            </div>

            <div>
              <Label htmlFor="max-members">Maximum Members *</Label>
              <Input
                id="max-members"
                type="number"
                min="2"
                max="20"
                value={createForm.maxMembers}
                onChange={(e) => setCreateForm({ ...createForm, maxMembers: parseInt(e.target.value) || 5 })}
              />
              <p className="text-xs text-gray-500 mt-1">Including yourself as team leader</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreateTeam} className="flex-1">
                Create Team
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="member-name">Name *</Label>
              <Input
                id="member-name"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="member-email">Email *</Label>
              <Input
                id="member-email"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="member-role">Role (Optional)</Label>
              <Input
                id="member-role"
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                placeholder="Developer, Designer, etc."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p>The invited member will receive a notification and can accept or decline the invitation.</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleInviteMember} className="flex-1">
                <Mail className="size-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
