import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Upload as UploadIcon } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-foreground">Clipped Set</h1>
          <span className="text-sm text-muted-foreground hidden sm:block">
            Clip your DJ-set for your socials
          </span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary"
            onClick={() => scrollToSection('hero')}
          >
            How it works
          </Button>
          <Button 
            variant="ghost" 
            className="text-foreground hover:text-primary"
            onClick={() => scrollToSection('pricing')}
          >
            Pricing
          </Button>
          
          {!user ? (
            <>
              <Link to="/login">
                <Button variant="outline">
                  Login
                </Button>
              </Link>
              <Link to="/upload">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Upload DJ Set
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/upload">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload DJ Set
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/upload" className="flex items-center cursor-pointer">
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Video Editor
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;