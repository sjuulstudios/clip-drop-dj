import Header from "@/components/Header";
import ResultsTable from "@/components/ResultsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, FileAudio, TrendingUp, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useUploadDetail } from "@/hooks/useUploads";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Results = () => {
  const { uploadId } = useParams<{ uploadId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { upload, downloadUrls, loading, error } = useUploadDetail(uploadId || '');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand" />
              <p className="text-textPrimary">Loading upload details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !upload) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || 'Upload not found'}</p>
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  };

  const getStatusBadge = () => {
    switch (upload.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{upload.status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="text-sm text-muted-foreground">
              Dashboard / Uploads / {upload.filename}
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
                  <p className="font-semibold text-sm">{upload.filename}</p>
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
                  <p className="font-semibold">{formatDuration(upload.duration_seconds)}</p>
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
                  <p className="font-semibold">{upload.cuts?.length || 0} clips</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center space-x-2">
                {getStatusBadge()}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-xs text-muted-foreground">
                    {upload.status === 'completed' ? 'Processing complete' : 'Processing...'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {upload.status === 'completed' ? (
            <ResultsTable upload={upload} downloadUrls={downloadUrls} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand" />
                <h3 className="text-lg font-semibold mb-2">Processing Your DJ Set</h3>
                <p className="text-muted-foreground">
                  We're analyzing your upload and detecting the perfect drop moments. This usually takes a few minutes.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Share Instructions */}
          {upload.status === 'completed' && (
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
          )}
        </div>
      </main>
    </div>
  );
};

export default Results;