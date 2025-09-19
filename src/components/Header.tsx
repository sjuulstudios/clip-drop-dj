import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
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
          <Button variant="ghost" className="text-foreground hover:text-brand">
            How it works
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-brand">
            Pricing
          </Button>
          <Button variant="outline">
            Login
          </Button>
          <Link to="/upload">
            <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
              Upload DJ Set
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;