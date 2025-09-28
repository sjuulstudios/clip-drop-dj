import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipBack, SkipForward, Volume2, Scissors, Save } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface Cut {
  id: string;
  start_time: number;
  end_time?: number;
  confidence?: number;
  cut_type?: string;
}

interface TimelineEditorProps {
  upload: {
    id: string;
    filename: string;
    duration_seconds?: number;
    cuts?: Cut[];
  };
  onClipCreate: (startTime: number, endTime: number, name: string) => void;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({ upload, onClipCreate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const duration = upload.duration_seconds || 300;
  const cuts = upload.cuts || [];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    
    if (isSelecting) {
      if (selectionStart === null) {
        setSelectionStart(time);
      } else if (selectionEnd === null) {
        const start = Math.min(selectionStart, time);
        const end = Math.max(selectionStart, time);
        setSelectionStart(start);
        setSelectionEnd(end);
        setIsSelecting(false);
      }
    } else {
      setCurrentTime(time);
    }
  };

  const startSelection = () => {
    setIsSelecting(true);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const clearSelection = () => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsSelecting(false);
  };

  const createClip = () => {
    if (selectionStart !== null && selectionEnd !== null) {
      const clipName = `Clip ${formatTime(selectionStart)}-${formatTime(selectionEnd)}`;
      onClipCreate(selectionStart, selectionEnd, clipName);
      clearSelection();
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control actual audio playback
  };

  const skipToTime = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, duration)));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Timeline Editor</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startSelection}
              disabled={isSelecting}
            >
              <Scissors className="h-4 w-4 mr-2" />
              Select Clip
            </Button>
            {selectionStart !== null && selectionEnd !== null && (
              <Button size="sm" onClick={createClip}>
                <Save className="h-4 w-4 mr-2" />
                Create Clip
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => skipToTime(currentTime - 10)}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button onClick={togglePlayPause}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => skipToTime(currentTime + 10)}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <div 
            ref={timelineRef}
            className="relative h-16 bg-muted rounded-md cursor-crosshair border-2 border-border"
            onClick={handleTimelineClick}
          >
            {/* Waveform placeholder - in real implementation, this would show actual waveform */}
            <div className="absolute inset-1 bg-gradient-to-r from-brand/20 via-brand/40 to-brand/20 rounded-sm opacity-50" />
            
            {/* Current time indicator */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-brand z-10"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
            
            {/* Selection area */}
            {selectionStart !== null && selectionEnd !== null && (
              <div 
                className="absolute top-0 bottom-0 bg-brand/30 border-l-2 border-r-2 border-brand z-5"
                style={{ 
                  left: `${(selectionStart / duration) * 100}%`,
                  width: `${((selectionEnd - selectionStart) / duration) * 100}%`
                }}
              />
            )}
            
            {/* Cut markers */}
            {cuts.map((cut) => (
              <div
                key={cut.id}
                className="absolute top-0 bottom-0 w-1 bg-red-500 z-20"
                style={{ left: `${(cut.start_time / duration) * 100}%` }}
                title={`Drop at ${formatTime(cut.start_time)} (${((cut.confidence || 0) * 100).toFixed(0)}%)`}
              />
            ))}
          </div>
          
          {/* Time markers */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0:00</span>
            <span>{formatTime(duration / 4)}</span>
            <span>{formatTime(duration / 2)}</span>
            <span>{formatTime((3 * duration) / 4)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Selection Info */}
        {isSelecting && (
          <div className="text-sm text-muted-foreground">
            {selectionStart === null 
              ? "Click to set start time" 
              : selectionEnd === null
              ? "Click to set end time"
              : `Selected: ${formatTime(selectionStart)} - ${formatTime(selectionEnd)} (${formatTime(selectionEnd - selectionStart)})`
            }
            <Button variant="ghost" size="sm" onClick={clearSelection} className="ml-2">
              Cancel
            </Button>
          </div>
        )}

        {/* Cut Points List */}
        {cuts.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Detected Drops</h4>
            <div className="flex flex-wrap gap-2">
              {cuts.map((cut) => (
                <Button
                  key={cut.id}
                  variant="outline"
                  size="sm"
                  onClick={() => skipToTime(cut.start_time)}
                  className="text-xs"
                >
                  <Badge variant="secondary" className="mr-2">
                    {((cut.confidence || 0) * 100).toFixed(0)}%
                  </Badge>
                  {formatTime(cut.start_time)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimelineEditor;