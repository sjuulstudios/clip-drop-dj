import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div id="hero">
          <HeroSection />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
        
        {/* CTA Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ready to create viral clips?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of DJs already using Clipped Set to grow their social presence.
            </p>
            <Link to="/upload">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-surface py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Clipped Set</h3>
          <p className="text-muted-foreground mb-4">Clip your DJ-set for your socials</p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-brand">Privacy Policy</a>
            <a href="#" className="hover:text-brand">Terms of Service</a>
            <a href="#" className="hover:text-brand">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;