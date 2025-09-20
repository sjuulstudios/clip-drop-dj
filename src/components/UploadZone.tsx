import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, File, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUploads } from "@/hooks/useUploads";
import { useToast } from "@/hooks/use-toast";

const UploadZone = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [uploadId, setUploadId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const navigate = useNavigate();
  const { uploadFile } = useUploads();
  const { toast } = useToast();

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      // Validate file
      const maxSize = 4 * 1024 * 1024 * 1024; // 4GB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 4GB limit');
      }

      const allowedTypes = [
        'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac',
        'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported. Please upload audio or video files.');
      }

      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
      setUploadStatus('uploading');
      setErrorMessage('');

      // Start upload
      const resultUploadId = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadId(resultUploadId);
      setUploadStatus('processing');
      
      toast({
        title: 'Upload completed',
        description: 'Your DJ set is now being processed for drop detection.',
      });

      // Simulate processing time (in real implementation, you'd poll for status)
      setTimeout(() => {
        setUploadStatus('complete');
        toast({
          title: 'Processing complete',
          description: 'Your DJ set has been analyzed! Check out the results.',
        });
      }, 8000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred during upload',
        variant: 'destructive',
      });
    }
  };

  const handleViewResults = () => {
    if (uploadId) {
      navigate(`/results/${uploadId}`);
    }
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadProgress(0);
    setFileName('');
    setFileSize('');
    setUploadId('');
    setErrorMessage('');
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
              <h3 className="text-xl font-semibold text-textPrimary mb-2">
                Drop your DJ set here
              </h3>
              <p className="text-muted-foreground mb-6">
                Or click to browse files. Supports MP3, WAV, MP4, MOV up to 4GB
              </p>
              <Button 
                onClick={() => document.getElementById('fileInput')?.click()}
                className="bg-brand text-textOnBrand hover:bg-brand/90"
              >
                Choose File
              </Button>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="audio/*,video/*"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-brand animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-textPrimary mb-2">
                Uploading {fileName}
              </h3>
              <p className="text-muted-foreground mb-4">
                {fileSize} • Upload in progress...
              </p>
              <Progress value={uploadProgress} className="mb-4" />
              <p className="text-sm text-muted-foreground">
                {uploadProgress.toFixed(1)}% uploaded
              </p>
            </div>
          )}

          {uploadStatus === 'processing' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-brand animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-textPrimary mb-2">
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
              <h3 className="text-xl font-semibold text-textPrimary mb-2">
                Processing Complete!
              </h3>
              <p className="text-muted-foreground mb-6">
                Your DJ set has been analyzed and clips are ready
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleViewResults}
                  className="bg-brand text-textOnBrand hover:bg-brand/90"
                >
                  View Results
                </Button>
                <Button variant="outline" onClick={resetUpload}>
                  Upload Another File
                </Button>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-textPrimary mb-2">
                Upload Failed
              </h3>
              <p className="text-red-600 mb-6">
                {errorMessage}
              </p>
              <Button variant="outline" onClick={resetUpload}>
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadZone;