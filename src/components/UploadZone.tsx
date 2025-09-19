import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react";

const UploadZone = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    setUploadStatus('uploading');
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('processing');
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-2 border-dashed border-border hover:border-brand/50 transition-colors">
        <CardContent className="p-8">
          {uploadStatus === 'idle' && (
            <div
              className={`text-center ${dragOver ? 'scale-105' : ''} transition-transform`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Drop your DJ set here
              </h3>
              <p className="text-muted-foreground mb-6">
                Or click to browse files. Supports MP3, WAV, MP4, MOV up to 4GB
              </p>
              <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
                Choose File
              </Button>
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <File className="h-8 w-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Uploading {fileName}
              </h3>
              <p className="text-muted-foreground mb-4">
                {fileSize} • Estimated time: 5 minutes
              </p>
              <Progress value={uploadProgress} className="mb-4" />
              <p className="text-sm text-muted-foreground">
                {uploadProgress.toFixed(1)}% uploaded
              </p>
            </div>
          )}

          {uploadStatus === 'processing' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AlertCircle className="h-8 w-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Processing {fileName}
              </h3>
              <p className="text-muted-foreground mb-4">
                Analyzing audio and detecting drops...
              </p>
              <div className="w-full bg-surface rounded-full h-2 mb-4">
                <div className="bg-brand h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}

          {uploadStatus === 'complete' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Processing Complete!
              </h3>
              <p className="text-muted-foreground mb-6">
                Found 12 drops in your set. Ready to download and share.
              </p>
              <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
                View Results
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadZone;