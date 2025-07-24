'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Send, Loader2, AlertTriangle, Clock, CheckCircle, DollarSign, Upload, X, Check, Camera, Zap, Sparkles, ImageIcon } from 'lucide-react';
import { processVoiceToText, formatIssueWithAI, analyzeImageWithAI } from '@/lib/ai-processor';
import { commonIssues } from '@/lib/tata-models';

interface IssueFormProps {
  vehicleModel: string;
  onSubmit: (issue: any) => void;
}

export default function IssueForm({ vehicleModel, onSubmit }: IssueFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [autoAnalyzed, setAutoAnalyzed] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setIsProcessing(true);
        
        try {
          const transcribedText = await processVoiceToText(audioBlob);
          setIssueText(transcribedText);
          const analysis = await formatIssueWithAI(transcribedText, vehicleModel);
          setAiAnalysis(analysis);
        } catch (error) {
          console.error('Voice processing failed:', error);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Auto-analyze the image immediately
      setIsAnalyzingImage(true);
      setAutoAnalyzed(true);
      try {
        const analysis = await analyzeImageWithAI(file, vehicleModel || 'Unknown');
        setIssueText(analysis.description);
        setAiAnalysis(analysis);
      } catch (error) {
        console.error('Auto image analysis failed:', error);
        setAutoAnalyzed(false);
      } finally {
        setIsAnalyzingImage(false);
      }
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setAutoAnalyzed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzingImage(true);
    try {
      const analysis = await analyzeImageWithAI(uploadedImage, vehicleModel || 'Unknown');
      setIssueText(analysis.description);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Image analysis failed:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!issueText.trim()) return;
    
    setIsProcessing(true); 
    try {
      const analysis = await formatIssueWithAI(issueText, vehicleModel);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const submitIssue = async () => {
    setIsSubmitting(true);
    
    const issueData = {
      description: aiAnalysis?.formattedIssue || issueText,
      category: aiAnalysis?.category || selectedCategory,
      severity: aiAnalysis?.severity || 'medium',
      suggestedActions: aiAnalysis?.suggestedActions || [],
      possibleCauses: aiAnalysis?.possibleCauses || [],
      urgencyLevel: aiAnalysis?.urgencyLevel || 'Within 1 week',
      estimatedCost: aiAnalysis?.estimatedCost || 'Contact service center',
      vehicleModel,
      status: 'open',
      createdAt: new Date(),
      hasImage: !!uploadedImage,
    };

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      });

      if (response.ok) {
        const savedIssue = await response.json();
        
        // Show success animation
        setIsSubmitted(true);
        
        // Reset form after animation
        setTimeout(() => {
          onSubmit(savedIssue);
          setIssueText('');
          setAiAnalysis(null);
          setSelectedCategory('');
          setUploadedImage(null);
          setImagePreview(null);
          setAutoAnalyzed(false);
          setIsSubmitted(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to submit issue:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success animation overlay
  if (isSubmitted) {
    return (
      <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center z-10 backdrop-blur-sm">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 quantum-glow">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold mb-4 holographic-text">Issue Submitted Successfully!</h3>
            <p className="text-green-200 text-lg">Your vehicle issue has been recorded and analyzed by AI.</p>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="matrix-text">Report New Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 opacity-20">
          <div className="h-32 bg-white/5 rounded-2xl"></div>
          <div className="h-8 bg-white/5 rounded-2xl"></div>
          <div className="h-12 bg-white/5 rounded-2xl"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-t-3xl border-b border-white/10">
          <CardTitle className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center quantum-glow">
              <Send className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <span className="text-2xl font-bold holographic-text">Report Vehicle Issue</span>
              <p className="text-sm text-white/60 font-normal mt-1">AI-powered issue analysis and diagnosis</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Text Input Section with Image Upload Icon */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-white/90">Describe Your Issue</Label>
            <div className="flex gap-3">
              <Textarea
                placeholder="Describe the issue with your vehicle in detail..."
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                className="flex-1 quantum-input min-h-[120px] text-white placeholder:text-white/50"
                rows={4}
              />
              <div className="flex flex-col gap-2">
                {/* Image Upload Button */}
                <Button 
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 w-12 bg-white/5 border-white/20 hover:bg-white/10 group border rounded-xl backdrop-blur-sm"
                  title="Upload Image for AI Analysis"
                >
                  <div className="relative">
                    <ImageIcon className="w-5 h-5 text-white/70 group-hover:text-purple-400 transition-colors" />
                    {uploadedImage && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </Button>
                
                {/* Voice Recording Button */}
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`h-12 w-12 ${isRecording ? 'bg-red-500/20 border-red-400 hover:bg-red-500/30' : 'bg-white/5 border-white/20 hover:bg-white/10'} border rounded-xl backdrop-blur-sm`}
                >
                  {isRecording ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5 text-white/70" />}
                </Button>
                
                {/* Analyze Text Button */}
                <Button
                  type="button"
                  size="icon"
                  onClick={handleTextSubmit}
                  disabled={!issueText.trim() || isProcessing}
                  className="h-12 w-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-purple-500/30 hover:border-cyan-400/50 hover:text-white rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Image Preview Section */}
          {imagePreview && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-white/90 flex items-center gap-2"> 
                <Camera className="w-5 h-5 text-purple-400" />
                Uploaded Image
              </Label>
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Issue preview" 
                  className="w-full max-w-md h-64 object-contain rounded-2xl border border-white/10 bg-black/20 mx-auto"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </Button>
                {autoAnalyzed && (
                  <div className="absolute bottom-4 left-4 bg-green-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-green-400/30">
                    <div className="flex items-center gap-2 text-green-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Auto-analyzed by AI</span>
                    </div>
                  </div>
                )}
                {!autoAnalyzed && !isAnalyzingImage && (
                  <Button
                    type="button"
                    onClick={analyzeImage}
                    className="absolute bottom-4 right-4 holographic-button"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Image
                  </Button>
                )}
                {isAnalyzingImage && (
                  <div className="absolute bottom-4 right-4 bg-blue-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-blue-400/30">
                    <div className="flex items-center gap-2 text-blue-400">
                      <div className="loading-cyber w-4 h-4"></div>
                      <span className="text-sm font-medium">Analyzing...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center gap-3 text-red-400 bg-red-500/10 p-4 rounded-2xl border border-red-400/30 backdrop-blur-sm">
              <div className="w-3 h-3 bg-red-400 rounded-full pulse-ring"></div>
              <span className="font-medium">Recording audio... Click stop when finished</span>
            </div>
          )}

          {/* Processing Status */}
          {(isProcessing || isAnalyzingImage) && (
            <div className="flex items-center gap-3 text-blue-400 bg-blue-500/10 p-4 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
              <div className="loading-cyber w-5 h-5"></div>
              <span className="font-medium">
                {isAnalyzingImage ? 'AI analyzing image...' : 'Gemini AI processing your issue...'}
              </span>
            </div>
          )}

          {/* Quick Categories */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-white/90">Quick Issue Categories</Label>
            <div className="flex flex-wrap gap-3">
              {commonIssues.map((issue) => (
                <Badge
                  key={issue}
                  variant={selectedCategory === issue ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-300 px-4 py-2 text-sm ${
                    selectedCategory === issue 
                      ? 'bg-purple-500/30 border-purple-400 text-purple-200 quantum-glow' 
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setSelectedCategory(issue)}
                >
                  {issue}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="matrix-text">AI Analysis Complete</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-semibold text-white/80">Formatted Issue Description:</Label>
                  <p className="text-sm bg-white/5 rounded-xl p-4 mt-2 text-white/90 border border-white/10">{aiAnalysis.formattedIssue}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-white/80">Category:</Label>
                    <div className="mt-2">
                      <Badge className="bg-blue-500/20 border-blue-400 text-blue-200">{aiAnalysis.category}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-white/80">Severity Level:</Label>
                    <div className="mt-2 flex items-center gap-2">
                      {aiAnalysis.severity === 'high' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      {aiAnalysis.severity === 'medium' && <Clock className="w-4 h-4 text-yellow-400" />}
                      {aiAnalysis.severity === 'low' && <CheckCircle className="w-4 h-4 text-green-400" />}
                      <Badge variant={aiAnalysis.severity === 'high' ? 'destructive' : aiAnalysis.severity === 'medium' ? 'default' : 'secondary'}>
                        {aiAnalysis.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-white/80">Urgency Level:</Label>
                    <p className="text-sm bg-white/5 rounded-xl p-3 mt-2 font-medium text-white/90 border border-white/10">{aiAnalysis.urgencyLevel}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-white/80 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Estimated Cost:
                    </Label>
                    <p className="text-sm bg-white/5 rounded-xl p-3 mt-2 font-medium text-white/90 border border-white/10">{aiAnalysis.estimatedCost}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-white/80">Possible Causes:</Label>
                  <ul className="text-sm list-disc list-inside space-y-2 bg-white/5 rounded-xl p-4 mt-2 border border-white/10">
                    {aiAnalysis.possibleCauses.map((cause: string, index: number) => (
                      <li key={index} className="text-white/80">{cause}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-white/80">Recommended Actions:</Label>
                  <ul className="text-sm list-disc list-inside space-y-2 bg-white/5 rounded-xl p-4 mt-2 border border-white/10">
                    {aiAnalysis.suggestedActions.map((action: string, index: number) => (
                      <li key={index} className="text-white/80">{action}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button 
            onClick={submitIssue} 
            className="w-full holographic-button py-4 text-lg font-semibold" 
            disabled={!issueText.trim() || isProcessing || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <div className="loading-cyber w-6 h-6"></div>
                Submitting Issue...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Send className="w-6 h-6" />
                Submit Issue Report
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}