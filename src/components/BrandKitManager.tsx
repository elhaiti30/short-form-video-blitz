import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Palette, Upload, Plus, Trash2, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface BrandKit {
  id: string;
  name: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_primary?: string;
  font_secondary?: string;
  brand_guidelines?: string;
  is_default: boolean;
}

export const BrandKitManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKit, setSelectedKit] = useState<BrandKit | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchBrandKits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('brand_kits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrandKits(data || []);
    } catch (error) {
      console.error('Error fetching brand kits:', error);
      toast({
        title: "Error",
        description: "Failed to fetch brand kits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBrandKit = async (kitData: Partial<BrandKit>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('brand_kits')
        .insert({
          name: kitData.name || '',
          user_id: user.id,
          primary_color: kitData.primary_color,
          secondary_color: kitData.secondary_color,
          accent_color: kitData.accent_color,
          font_primary: kitData.font_primary,
          font_secondary: kitData.font_secondary,
          brand_guidelines: kitData.brand_guidelines,
        })
        .select()
        .single();

      if (error) throw error;
      
      setBrandKits(prev => [data, ...prev]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Brand kit created successfully",
      });
    } catch (error) {
      console.error('Error creating brand kit:', error);
      toast({
        title: "Error",
        description: "Failed to create brand kit",
        variant: "destructive",
      });
    }
  };

  const updateBrandKit = async (id: string, updates: Partial<BrandKit>) => {
    try {
      const { error } = await supabase
        .from('brand_kits')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setBrandKits(prev => prev.map(kit => 
        kit.id === id ? { ...kit, ...updates } : kit
      ));
      
      toast({
        title: "Success",
        description: "Brand kit updated successfully",
      });
    } catch (error) {
      console.error('Error updating brand kit:', error);
      toast({
        title: "Error",
        description: "Failed to update brand kit",
        variant: "destructive",
      });
    }
  };

  const deleteBrandKit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('brand_kits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setBrandKits(prev => prev.filter(kit => kit.id !== id));
      toast({
        title: "Success",
        description: "Brand kit deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting brand kit:', error);
      toast({
        title: "Error",
        description: "Failed to delete brand kit",
        variant: "destructive",
      });
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      // First, unset all as default
      await supabase
        .from('brand_kits')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Then set the selected one as default
      await updateBrandKit(id, { is_default: true });
    } catch (error) {
      console.error('Error setting default brand kit:', error);
    }
  };

  useEffect(() => {
    fetchBrandKits();
  }, [user]);

  const BrandKitForm = ({ kit, onSubmit }: { kit?: BrandKit, onSubmit: (data: Partial<BrandKit>) => void }) => {
    const [formData, setFormData] = useState({
      name: kit?.name || '',
      primary_color: kit?.primary_color || '#3B82F6',
      secondary_color: kit?.secondary_color || '#10B981',
      accent_color: kit?.accent_color || '#F59E0B',
      font_primary: kit?.font_primary || 'Inter',
      font_secondary: kit?.font_secondary || 'Inter',
      brand_guidelines: kit?.brand_guidelines || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Brand Kit Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="My Brand Kit"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="primary_color">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary_color"
                type="color"
                value={formData.primary_color}
                onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                className="w-16 h-10 p-1"
              />
              <Input
                value={formData.primary_color}
                onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="secondary_color">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondary_color"
                type="color"
                value={formData.secondary_color}
                onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                className="w-16 h-10 p-1"
              />
              <Input
                value={formData.secondary_color}
                onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                placeholder="#10B981"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="accent_color">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accent_color"
                type="color"
                value={formData.accent_color}
                onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                className="w-16 h-10 p-1"
              />
              <Input
                value={formData.accent_color}
                onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                placeholder="#F59E0B"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="font_primary">Primary Font</Label>
            <Input
              id="font_primary"
              value={formData.font_primary}
              onChange={(e) => setFormData(prev => ({ ...prev, font_primary: e.target.value }))}
              placeholder="Inter"
            />
          </div>

          <div>
            <Label htmlFor="font_secondary">Secondary Font</Label>
            <Input
              id="font_secondary"
              value={formData.font_secondary}
              onChange={(e) => setFormData(prev => ({ ...prev, font_secondary: e.target.value }))}
              placeholder="Inter"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="brand_guidelines">Brand Guidelines</Label>
          <Textarea
            id="brand_guidelines"
            value={formData.brand_guidelines}
            onChange={(e) => setFormData(prev => ({ ...prev, brand_guidelines: e.target.value }))}
            placeholder="Describe your brand voice, tone, and visual guidelines..."
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full">
          {kit ? 'Update Brand Kit' : 'Create Brand Kit'}
        </Button>
      </form>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading brand kits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Brand Kit Manager</h2>
          <p className="text-muted-foreground">
            Create and manage your brand assets for consistent video styling
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Brand Kit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Brand Kit</DialogTitle>
              <DialogDescription>
                Set up your brand colors, fonts, and guidelines for consistent video creation.
              </DialogDescription>
            </DialogHeader>
            <BrandKitForm onSubmit={createBrandKit} />
          </DialogContent>
        </Dialog>
      </div>

      {brandKits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Palette className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Brand Kits Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first brand kit to ensure consistent styling across all your videos.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Brand Kit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandKits.map((kit) => (
            <Card key={kit.id} className={`relative ${kit.is_default ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {kit.name}
                      {kit.is_default && <Star className="h-4 w-4 text-primary fill-primary" />}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAsDefault(kit.id)}
                      disabled={kit.is_default}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBrandKit(kit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Colors</Label>
                    <div className="flex gap-2 mt-1">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: kit.primary_color }}
                        title="Primary"
                      />
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: kit.secondary_color }}
                        title="Secondary"
                      />
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: kit.accent_color }}
                        title="Accent"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Fonts</Label>
                    <div className="mt-1 text-sm">
                      <div style={{ fontFamily: kit.font_primary }}>{kit.font_primary}</div>
                      <div style={{ fontFamily: kit.font_secondary }} className="text-muted-foreground">
                        {kit.font_secondary}
                      </div>
                    </div>
                  </div>

                  {kit.brand_guidelines && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Guidelines</Label>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {kit.brand_guidelines}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};