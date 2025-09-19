import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Clock, FileAudio, Download, Eye, MoreHorizontal } from "lucide-react";

// Mock data
const recentUploads = [
  {
    id: 1,
    filename: "Summer_Festival_Set_2024.mp4",
    duration: "2h 34min",
    status: "complete",
    drops: 6,
    uploadedAt: "2 hours ago",
    size: "1.2 GB"
  },
  {
    id: 2,
    filename: "Warehouse_Techno_Mix.mp3",
    duration: "1h 45min",
    status: "processing",
    drops: null,
    uploadedAt: "5 hours ago",
    size: "198 MB"
  },
  {
    id: 3,
    filename: "Beach_House_Session.mp4",
    duration: "3h 12min",
    status: "complete",
    drops: 8,
    uploadedAt: "1 day ago",
    size: "2.1 GB"
  },
  {
    id: 4,
    filename: "Club_Night_Highlights.mp3",
    duration: "58min",
    status: "failed",
    drops: null,
    uploadedAt: "2 days ago",
    size: "142 MB"
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    complete: "bg-green-100 text-green-800",
    processing: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    queued: "bg-blue-100 text-blue-800"
  };
  
  return (
    <Badge className={variants[status as keyof typeof variants] || variants.queued}>
      {status}
    </Badge>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Manage your uploads and clips</p>
            </div>
            <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
              <Upload className="mr-2 h-4 w-4" />
              New Upload
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Uploads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Clips Generated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">187</div>
                <p className="text-xs text-muted-foreground">+24 from last week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Processing Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24h</div>
                <p className="text-xs text-muted-foreground">Total this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Storage Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 GB</div>
                <p className="text-xs text-muted-foreground">of unlimited</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Uploads</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Drops</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUploads.map((upload) => (
                    <TableRow key={upload.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-surface rounded flex items-center justify-center">
                            <FileAudio className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-[200px]">
                              {upload.filename}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {upload.size}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{upload.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={upload.status} />
                      </TableCell>
                      <TableCell>
                        {upload.drops ? (
                          <span className="text-sm font-medium">{upload.drops} clips</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {upload.uploadedAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          {upload.status === 'complete' && (
                            <>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;