import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="py-20 px-4 bg-surface">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Pay per upload or subscribe for unlimited processing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Per-Upload Pricing</h3>
            <div className="space-y-4">
              <Card className="border-2 hover:border-brand/50 transition-colors">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-foreground">1 Hour Set</h4>
                    <p className="text-muted-foreground">Perfect for short mixes</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-brand">€9</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 hover:border-brand/50 transition-colors">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-foreground">2 Hour Set</h4>
                    <p className="text-muted-foreground">Most popular option</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-brand">€15</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 hover:border-brand/50 transition-colors">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-foreground">4+ Hour Set</h4>
                    <p className="text-muted-foreground">For marathon sessions</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-brand">€25</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Subscription Plans</h3>
            <div className="space-y-4">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Starter</span>
                    <span className="text-2xl font-bold text-brand">€9/mo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">120 minutes/month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">CSV download</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    7-day free trial
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-brand relative">
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-brand text-brand-foreground">
                  Most Popular
                </Badge>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Pro</span>
                    <span className="text-2xl font-bold text-brand">€19/mo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">400 minutes/month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">CSV + auto split ZIP</span>
                  </div>
                  <Button className="w-full mt-4 bg-brand text-brand-foreground hover:bg-brand/90">
                    7-day free trial
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Studio</span>
                    <span className="text-2xl font-bold text-brand">€39/mo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">1200 minutes/month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority processing</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    7-day free trial
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;