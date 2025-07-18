import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="VideoBlitz AI Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-gradient">VideoBlitz AI</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#video-generator" className="text-muted-foreground hover:text-primary transition-colors">
              Generator
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="hidden sm:block text-muted-foreground hover:text-primary transition-colors touch-manipulation">
              Sign In
            </button>
            <button className="bg-primary text-primary-foreground px-3 md:px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors touch-manipulation text-sm md:text-base">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;