import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useVideoData } from "@/hooks/useVideoData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Folder, 
  FolderPlus, 
  Search, 
  Filter, 
  SortAsc,
  MoreHorizontal,
  Play,
  Download,
  Share2,
  Trash2,
  Edit,
  Star
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface VideoFolder {
  id: string;
  name: string;
  description?: string;
  color: string;
  parent_folder_id?: string;
  created_at: string;
}

interface VideoProject {
  id: string;
  project_name: string;
  generation_status: string;
  generation_progress: number;
  created_at: string;
  updated_at: string;
  script_content?: string;
}

export const EnhancedVideoLibrary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { projects, loading: projectsLoading, refetch } = useVideoData();
  const [folders, setFolders] = useState<VideoFolder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('updated_at');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFolders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('video_folders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch folders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (folderData: {
    name: string;
    description?: string;
    color?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('video_folders')
        .insert({
          ...folderData,
          user_id: user.id,
          color: folderData.color || '#3B82F6',
        })
        .select()
        .single();

      if (error) throw error;
      
      setFolders(prev => [data, ...prev]);
      setIsCreateFolderOpen(false);
      
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  const moveProjectToFolder = async (projectId: string, folderId: string | null) => {
    try {
      const { error } = await supabase
        .from('video_projects')
        .update({ folder_id: folderId })
        .eq('id', projectId);

      if (error) throw error;
      
      refetch();
      toast({
        title: "Success",
        description: "Project moved successfully",
      });
    } catch (error) {
      console.error('Error moving project:', error);
      toast({
        title: "Error",
        description: "Failed to move project",
        variant: "destructive",
      });
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      // Move all projects out of this folder first
      await supabase
        .from('video_projects')
        .update({ folder_id: null })
        .eq('folder_id', folderId);

      // Delete the folder
      const { error } = await supabase
        .from('video_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;
      
      setFolders(prev => prev.filter(f => f.id !== folderId));
      if (selectedFolder === folderId) {
        setSelectedFolder(null);
      }
      
      toast({
        title: "Success",
        description: "Folder deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [user]);

  // Filter and sort projects  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.project_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder ? (project as any).folder_id === selectedFolder : true;
    const matchesStatus = filterStatus === 'all' || project.generation_status === filterStatus;
    
    return matchesSearch && matchesFolder && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.project_name.localeCompare(b.project_name);
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'updated_at':
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const FolderCreateForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      color: '#3B82F6',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="folder_name">Folder Name</Label>
          <Input
            id="folder_name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="My Video Projects"
            required
          />
        </div>

        <div>
          <Label htmlFor="folder_description">Description</Label>
          <Input
            id="folder_description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Optional description"
          />
        </div>

        <div>
          <Label htmlFor="folder_color">Color</Label>
          <div className="flex gap-2">
            <Input
              id="folder_color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-16 h-10 p-1"
            />
            <Input
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              placeholder="#3B82F6"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          <FolderPlus className="h-4 w-4 mr-2" />
          Create Folder
        </Button>
      </form>
    );
  };

  if (loading || projectsLoading) {
    return <div className="flex justify-center p-8">Loading video library...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Video Library</h2>
          <p className="text-muted-foreground">
            Organize and manage your video projects with folders
          </p>
        </div>
        
        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Organize your video projects by creating folders.
              </DialogDescription>
            </DialogHeader>
            <FolderCreateForm onSubmit={createFolder} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_at">Last Modified</SelectItem>
            <SelectItem value="created_at">Date Created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Folders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedFolder === null ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFolder(null)}
              >
                <Folder className="h-4 w-4 mr-2" />
                All Projects ({projects.length})
              </Button>
              
              {folders.map((folder) => {
                const folderProjectCount = projects.filter(p => (p as any).folder_id === folder.id).length;
                return (
                  <div key={folder.id} className="flex items-center group">
                    <Button
                      variant={selectedFolder === folder.id ? "default" : "ghost"}
                      className="flex-1 justify-start"
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <div
                        className="w-4 h-4 rounded mr-2"
                        style={{ backgroundColor: folder.color }}
                      />
                      <span className="truncate">{folder.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        ({folderProjectCount})
                      </span>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => deleteFolder(folder.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="lg:col-span-3">
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Play className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first video project to get started'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-1">
                        {project.project_name}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            Favorite
                          </DropdownMenuItem>
                          {folders.length > 0 && (
                            <>
                              {folders.map((folder) => (
                                <DropdownMenuItem
                                  key={folder.id}
                                  onClick={() => moveProjectToFolder(project.id, folder.id)}
                                >
                                  <div
                                    className="w-3 h-3 rounded mr-2"
                                    style={{ backgroundColor: folder.color }}
                                  />
                                  Move to {folder.name}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuItem onClick={() => moveProjectToFolder(project.id, null)}>
                                <Folder className="h-4 w-4 mr-2" />
                                Remove from folder
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(project.generation_status)}>
                        {project.generation_status}
                      </Badge>
                      {project.generation_progress > 0 && project.generation_status === 'processing' && (
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${project.generation_progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-3">
                      {project.script_content || 'No description available'}
                    </CardDescription>
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(project.updated_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};