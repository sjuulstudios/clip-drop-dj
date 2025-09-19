import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Upload, Play, Share } from "lucide-react";
import heroImage from "@/assets/hero-dj-setup.jpg";

const HeroSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-surface relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={heroImage} 
          alt="Professional DJ setup" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto text-center max-w-4xl relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          Turn your DJ sets into
          <span className="text-brand"> viral clips</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Upload your DJ set and our AI will detect every drop, creating perfect clips 
          for Instagram, TikTok, and more. Professional quality, instant results.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/upload">
            <Button size="lg" className="bg-brand text-brand-foreground hover:bg-brand/90 px-8 py-6 text-lg">
              <Upload className="mr-2 h-5 w-5" />
              Upload Your DJ Set
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-brand" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Upload</h3>
            <p className="text-muted-foreground">
              Drag & drop your DJ set. Supports up to 4-hour sets in 4K quality.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-brand" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Detect</h3>
            <p className="text-muted-foreground">
              AI analyzes your set and identifies the perfect moments before each drop.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share className="h-8 w-8 text-brand" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Share</h3>
            <p className="text-muted-foreground">
              Download clips or share directly to Instagram, TikTok, and Facebook.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;