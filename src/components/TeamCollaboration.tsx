import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { 
  Users, UserPlus, MessageCircle, Send, Clock, CheckCircle, 
  AlertCircle, Crown, Shield, Eye, Edit3, Share2, Settings,
  Bell, Calendar, FileText, Video, Image
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  avatar: string;
  lastActive: string;
  status: "online" | "offline" | "away";
}

interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  timestamp: string;
  type: "comment" | "suggestion" | "approval";
  resolved: boolean;
}

interface Project {
  id: string;
  title: string;
  status: "draft" | "review" | "approved" | "published";
  assignedTo: TeamMember[];
  dueDate: string;
  comments: Comment[];
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "owner",
    avatar: "/api/placeholder/32/32",
    lastActive: "2 minutes ago",
    status: "online"
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@company.com", 
    role: "editor",
    avatar: "/api/placeholder/32/32",
    lastActive: "1 hour ago",
    status: "away"
  },
  {
    id: "3",
    name: "Lisa Rodriguez",
    email: "lisa@company.com",
    role: "admin",
    avatar: "/api/placeholder/32/32",
    lastActive: "5 minutes ago",
    status: "online"
  }
];

const projects: Project[] = [
  {
    id: "1",
    title: "Q1 Marketing Campaign",
    status: "review",
    assignedTo: [teamMembers[0], teamMembers[1]],
    dueDate: "2024-02-15",
    comments: [
      {
        id: "1",
        author: teamMembers[2],
        content: "The intro needs to be more engaging. Consider adding a hook in the first 3 seconds.",
        timestamp: "2 hours ago",
        type: "suggestion",
        resolved: false
      },
      {
        id: "2",
        author: teamMembers[1],
        content: "Updated the color scheme to match brand guidelines.",
        timestamp: "1 hour ago",
        type: "comment",
        resolved: true
      }
    ]
  }
];

export const TeamCollaboration = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [realProjects, setRealProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('video_projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedProjects: Project[] = data.map(project => {
          const status = project.generation_status === 'completed' ? 'approved' as const : 'draft' as const;
          
          return {
            id: project.id,
            title: project.project_name,
            status,
            assignedTo: [teamMembers[0]], // Current user
            dueDate: new Date(project.created_at).toISOString().split('T')[0],
            comments: []
          };
        });

        setRealProjects(mappedProjects);
        if (mappedProjects.length > 0) {
          setSelectedProject(mappedProjects[0] as Project);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to load team projects",
          variant: "destructive"
        });
        // Fallback to demo data
        setRealProjects(projects);
        setSelectedProject(projects[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleSendComment = () => {
    if (newComment.trim() && selectedProject) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: teamMembers[0], // Current user
        content: newComment,
        timestamp: "Just now",
        type: "comment",
        resolved: false
      };
      
      setSelectedProject({
        ...selectedProject,
        comments: [comment, ...selectedProject.comments]
      });
      setNewComment("");
    }
  };

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      // Handle team member invitation
      setInviteEmail("");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner": return <Crown className="h-4 w-4 text-yellow-500" />;
      case "admin": return <Shield className="h-4 w-4 text-blue-500" />;
      case "editor": return <Edit3 className="h-4 w-4 text-green-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Team Collaboration</h1>
          <p className="text-muted-foreground mt-1">Work together on video projects</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="premium-button">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Add a new member to your team workspace
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Select defaultValue="editor">
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - Can view projects</SelectItem>
                  <SelectItem value="editor">Editor - Can edit projects</SelectItem>
                  <SelectItem value="admin">Admin - Can manage team</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleInvite} className="w-full premium-button">
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-xs text-muted-foreground">{member.lastActive}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(realProjects.length > 0 ? realProjects : projects).map((project) => (
              <div 
                key={project.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedProject?.id === project.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{project.title}</h3>
                    <Badge variant={
                      project.status === "approved" ? "default" :
                      project.status === "review" ? "secondary" :
                      "outline"
                    }>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Due {project.dueDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {project.assignedTo.map((member) => (
                        <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {project.comments.length} comments
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Comments & Feedback */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProject ? (
              <>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {selectedProject.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-3 border rounded-lg">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback className="text-xs">
                          {comment.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{comment.author.name}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              comment.type === "suggestion" ? "border-yellow-500 text-yellow-700" :
                              comment.type === "approval" ? "border-green-500 text-green-700" :
                              "border-blue-500 text-blue-700"
                            }`}
                          >
                            {comment.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        {comment.type === "suggestion" && !comment.resolved && (
                          <Button variant="ghost" size="sm" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark as Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-3">
                  <Textarea
                    placeholder="Add a comment or suggestion..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSendComment} size="sm" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send Comment
                    </Button>
                    <Select defaultValue="comment">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comment">Comment</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="approval">Approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a project to view comments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};