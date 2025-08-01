import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Heart, Download, Search, Filter, Zap, TrendingUp, Users, ShoppingBag, Dumbbell, Code, Utensils, Shirt, GraduationCap, Plane, Home, Building2 } from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  style: string;
  duration: number;
  thumbnail: string;
  tags: string[];
  isPremium: boolean;
  likes: number;
  uses: number;
}

const templates: Template[] = [
  {
    id: "1",
    title: "Property Showcase Reel",
    description: "Professional real estate tour with smooth transitions and luxury feel",
    category: "Real Estate",
    industry: "real-estate",
    style: "luxury",
    duration: 30,
    thumbnail: "/api/placeholder/300/200",
    tags: ["luxury", "tour", "professional"],
    isPremium: true,
    likes: 1240,
    uses: 5600
  },
  {
    id: "2",
    title: "Workout Motivation",
    description: "High-energy fitness content with dynamic cuts and pumping music",
    category: "Fitness",
    industry: "fitness",
    style: "energetic",
    duration: 15,
    thumbnail: "/api/placeholder/300/200",
    tags: ["motivation", "workout", "energy"],
    isPremium: false,
    likes: 890,
    uses: 3200
  },
  {
    id: "3",
    title: "Tech Product Demo",
    description: "Clean, modern showcase for software or hardware products",
    category: "Technology",
    industry: "tech",
    style: "modern",
    duration: 45,
    thumbnail: "/api/placeholder/300/200",
    tags: ["demo", "product", "clean"],
    isPremium: true,
    likes: 670,
    uses: 2100
  },
  {
    id: "4",
    title: "Recipe Quick Prep",
    description: "Fast-paced cooking video with close-up shots and satisfying reveals",
    category: "Food",
    industry: "food",
    style: "appetizing",
    duration: 20,
    thumbnail: "/api/placeholder/300/200",
    tags: ["recipe", "cooking", "quick"],
    isPremium: false,
    likes: 1560,
    uses: 7800
  },
  {
    id: "5",
    title: "Fashion Lookbook",
    description: "Stylish outfit transitions with elegant music and perfect lighting",
    category: "Fashion",
    industry: "fashion",
    style: "elegant",
    duration: 25,
    thumbnail: "/api/placeholder/300/200",
    tags: ["fashion", "outfit", "style"],
    isPremium: true,
    likes: 2100,
    uses: 4500
  },
  {
    id: "6",
    title: "Business Explainer",
    description: "Professional corporate video with clean graphics and clear messaging",
    category: "Business",
    industry: "business",
    style: "corporate",
    duration: 60,
    thumbnail: "/api/placeholder/300/200",
    tags: ["business", "explainer", "corporate"],
    isPremium: true,
    likes: 520,
    uses: 1800
  }
];

const categories = [
  { value: "all", label: "All Categories", icon: Filter },
  { value: "real-estate", label: "Real Estate", icon: Home },
  { value: "fitness", label: "Fitness & Health", icon: Dumbbell },
  { value: "tech", label: "Technology", icon: Code },
  { value: "food", label: "Food & Cooking", icon: Utensils },
  { value: "fashion", label: "Fashion & Beauty", icon: Shirt },
  { value: "business", label: "Business", icon: Building2 },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "travel", label: "Travel", icon: Plane }
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
}

export const TemplateLibrary = ({ onSelectTemplate }: TemplateLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || template.industry === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.uses - a.uses;
      case "likes":
        return b.likes - a.likes;
      case "newest":
        return parseInt(b.id) - parseInt(a.id);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold gradient-text">Professional Templates</h2>
        <p className="text-muted-foreground text-lg">Choose from industry-tested templates to jumpstart your video creation</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Used</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTemplates.map((template) => (
          <Card key={template.id} className="premium-card group cursor-pointer transition-all duration-300 hover:scale-105">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                <Play className="h-12 w-12 text-primary/70" />
              </div>
              {template.isPremium && (
                <Badge className="absolute top-2 right-2 premium-button">
                  <Zap className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {template.title}
                  </h3>
                  <Badge variant="secondary">{template.duration}s</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {template.likes.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {template.uses.toLocaleString()}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => onSelectTemplate(template)}
                className="w-full premium-button"
                variant="premium"
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};