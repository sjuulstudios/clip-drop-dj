import Header from "@/components/Header";
import ResultsTable from "@/components/ResultsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, FileAudio, TrendingUp } from "lucide-react";

const Results = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="text-sm text-muted-foreground">
              Dashboard / Uploads / Summer_Festival_Set_2024.mp4
            </div>
          </div>

          {/* Upload Info */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                  <FileAudio className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">File</p>
                  <p className="font-semibold">Summer_Festival_Set_2024.mp4</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">2h 34min</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Drops Found</p>
                  <p className="font-semibold">6 clips</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">Complete</Badge>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-xs text-muted-foreground">Processed 5 min ago</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <ResultsTable />

          {/* Share Instructions */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Sharing Tips
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Instagram & TikTok</h4>
                  <p>Clips are optimized for vertical format (9:16). Perfect for Stories and Reels.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Facebook & WhatsApp</h4>
                  <p>Horizontal format (16:9) works best for timeline posts and group sharing.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Results;