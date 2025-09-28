import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Play, Edit, Trash2, Download, Share } from 'lucide-react';
import { useClips, type Clip } from '@/hooks/useClips';
import { toast } from 'sonner';

interface ClipManagerProps {
  uploadId: string;
}

const ClipManager: React.FC<ClipManagerProps> = ({ uploadId }) => {
  const { clips, loading, createClip, updateClip, deleteClip } = useClips(uploadId);
  const [editingClip, setEditingClip] = useState<Clip | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEditClip = async (formData: FormData) => {
    if (!editingClip) return;

    try {
      const name = formData.get('name') as string;
      const aspectRatio = formData.get('aspectRatio') as string;

      await updateClip(editingClip.id, {
        name,
        aspect_ratio: aspectRatio,
      });

      toast.success('Clip updated successfully');
      setIsEditDialogOpen(false);
      setEditingClip(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update clip');
    }
  };

  const handleDeleteClip = async (clipId: string) => {
    try {
      await deleteClip(clipId);
      toast.success('Clip deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete clip');
    }
  };

  const handleExportClip = (clip: Clip) => {
    // In a real implementation, this would trigger clip export/rendering
    toast.info(`Exporting ${clip.name}... This feature will be available soon!`);
  };

  const handleShareClip = (clip: Clip) => {
    const shareUrl = `${window.location.origin}/clip/${clip.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Clip link copied to clipboard!');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading clips...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Clips</span>
          <Badge variant="secondary">{clips.length} clips</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No clips created yet. Use the timeline editor above to create your first clip!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clips.map((clip) => (
                <TableRow key={clip.id}>
                  <TableCell className="font-medium">{clip.name}</TableCell>
                  <TableCell className="font-mono">
                    {formatTime(clip.start_time)} - {formatTime(clip.end_time)}
                    <div className="text-xs text-muted-foreground">
                      ({formatTime(clip.end_time - clip.start_time)} duration)
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{clip.aspect_ratio}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(clip.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" disabled>
                        <Play className="h-3 w-3" />
                      </Button>
                      
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingClip(clip)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Clip</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleEditClip(formData);
                          }}>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="name">Clip Name</Label>
                                <Input 
                                  id="name" 
                                  name="name" 
                                  defaultValue={editingClip?.name} 
                                  required 
                                />
                              </div>
                              <div>
                                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                                <Select name="aspectRatio" defaultValue={editingClip?.aspect_ratio || '16:9'}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                    <SelectItem value="4:5">4:5 (Instagram)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">Save Changes</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleExportClip(clip)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>

                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShareClip(clip)}
                      >
                        <Share className="h-3 w-3" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Clip</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{clip.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteClip(clip.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ClipManager;