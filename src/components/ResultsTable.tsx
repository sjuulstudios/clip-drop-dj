import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Play, Share, Instagram, Facebook } from "lucide-react";
import type { Upload } from "@/hooks/useUploads";

const SocialIcon = ({ platform }: { platform: string }) => {
  const icons = {
    instagram: <Instagram className="h-4 w-4" />,
    tiktok: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
    facebook: <Facebook className="h-4 w-4" />,
    whatsapp: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
      </svg>
    )
  };
  
  return icons[platform as keyof typeof icons] || <Share className="h-4 w-4" />;
};

interface ResultsTableProps {
  upload: Upload;
  downloadUrls?: { csv?: string; zip?: string } | null;
}

const ResultsTable = ({ upload, downloadUrls }: ResultsTableProps) => {
  const cuts = upload.cuts || [];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.padStart(6, '0')}`;
  };

  const handleDownloadCSV = () => {
    if (downloadUrls?.csv) {
      window.open(downloadUrls.csv, '_blank');
    }
  };

  const handleDownloadZIP = () => {
    if (downloadUrls?.zip) {
      window.open(downloadUrls.zip, '_blank');
    }
  };

  const generateShareUrl = (platform: string, cut: any) => {
    const baseUrl = window.location.origin;
    const clipUrl = `${baseUrl}/clip/${upload.id}/${cut.id}`;
    
    switch (platform) {
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(clipUrl);
        return;
      case 'tiktok':
        navigator.clipboard.writeText(clipUrl);
        return;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(clipUrl)}`;
      case 'whatsapp':
        return `https://wa.me/?text=${encodeURIComponent(`Check out this drop from my DJ set: ${clipUrl}`)}`;
      default:
        navigator.clipboard.writeText(clipUrl);
        return;
    }
  };

  const handleShare = (platform: string, cut: any) => {
    const shareUrl = generateShareUrl(platform, cut);
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (cuts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No drops detected in this upload.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Detected Drops</h2>
          <p className="text-muted-foreground">
            Found {cuts.length} perfect moments in your set
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleDownloadCSV}
            disabled={!downloadUrls?.csv}
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
          <Button 
            className="bg-brand text-textOnBrand hover:bg-brand/90"
            onClick={handleDownloadZIP}
            disabled={!downloadUrls?.zip}
          >
            <Download className="mr-2 h-4 w-4" />
            Download All Clips (ZIP)
          </Button>
        </div>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Clip Timeline</span>
            <Badge variant="secondary">{cuts.length} clips</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead>Share</TableHead>
                <TableHead>Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cuts.map((cut, index) => (
                <TableRow key={cut.id}>
                  <TableCell className="font-mono">
                    {formatTime(cut.start_time)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {cut.cut_type || 'drop'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={(cut.confidence || 0) > 0.9 ? "default" : "secondary"}
                      className={(cut.confidence || 0) > 0.9 ? "bg-green-100 text-green-800" : ""}
                    >
                      {((cut.confidence || 0) * 100).toFixed(0)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" disabled>
                      <Play className="h-3 w-3" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="p-1 h-7 w-7"
                        onClick={() => handleShare('instagram', cut)}
                      >
                        <SocialIcon platform="instagram" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="p-1 h-7 w-7"
                        onClick={() => handleShare('tiktok', cut)}
                      >
                        <SocialIcon platform="tiktok" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="p-1 h-7 w-7"
                        onClick={() => handleShare('facebook', cut)}
                      >
                        <SocialIcon platform="facebook" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="p-1 h-7 w-7"
                        onClick={() => handleShare('whatsapp', cut)}
                      >
                        <SocialIcon platform="whatsapp" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" disabled>
                      <Download className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsTable;