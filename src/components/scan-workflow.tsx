import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Zap,
  Brain,
  FileText,
  HelpCircle,
  ArrowRight,
  Clock,
  MapPin,
  Wrench,
  Monitor,
  AlertCircle
} from 'lucide-react';
import { mockAnalyserReports, AnalyserReport } from '../data/mock-data';
import { useAuth } from '../contexts/auth-context';

interface ScanWorkflowProps {
  onTrainSelect: (trainId: string) => void;
}

export function ScanWorkflow({ onTrainSelect }: ScanWorkflowProps) {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [currentReport, setCurrentReport] = useState<AnalyserReport | null>(null);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isPlatformSupervisor = user?.role === 'platform_supervisor';

  // Mock scan simulation
  const startScan = async () => {
    setIsScanning(true);
    setProgress(0);
    
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          setScanComplete(true);
          // Use the latest mock report for demo
          setCurrentReport(mockAnalyserReports[1]); // The "replace" scenario
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetScan = () => {
    setScanComplete(false);
    setCurrentReport(null);
    setProgress(0);
  };

  const getSystemStatusIcon = (status: 'normal' | 'warning' | 'fault') => {
    switch (status) {
      case 'normal': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'fault': return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getSystemStatusColor = (status: 'normal' | 'warning' | 'fault') => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'fault': return 'text-red-600 bg-red-50';
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'go_for_service': return 'text-green-600 bg-green-50 border-green-200';
      case 'replace': return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance_required': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'go_for_service': return 'GO FOR SERVICE';
      case 'replace': return 'REPLACE';
      case 'maintenance_required': return 'MAINTENANCE REQUIRED';
      default: return 'UNKNOWN';
    }
  };

  const handleDecision = (decision: 'service' | 'replace') => {
    // Implementation would handle the decision logic
    console.log(`Platform Supervisor decision: ${decision} for train ${currentReport?.trainId}`);
    
    // Reset for next scan
    setTimeout(() => {
      resetScan();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>AI Scanner & Decision Platform</h1>
        <p className="text-muted-foreground">
          {isPlatformSupervisor 
            ? 'Platform Supervisor - Make go/no-go decisions based on AI analysis'
            : 'AI-powered train condition analysis and decision support'
          }
        </p>
      </div>

      {!scanComplete ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera/Scanner Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                AI Train Scanner
              </CardTitle>
              <CardDescription>
                Point the scanner at the train to begin analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock camera feed */}
                <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isScanning ? (
                      <div className="text-center text-white">
                        <div className="animate-pulse">
                          <Zap className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                          <p className="text-lg">AI Analysis in Progress...</p>
                          <Progress value={progress} className="w-64 mx-auto mt-4" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p>Position scanner towards train</p>
                        <p className="text-sm text-gray-400">Press scan to begin analysis</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={startScan} 
                  disabled={isScanning}
                  className="w-full"
                  size="lg"
                >
                  {isScanning ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-pulse" />
                      Scanning... {progress}%
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Start AI Scan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Scanning Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm">1</div>
                  <p className="text-sm">Position the scanner device towards the front of the train</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm">2</div>
                  <p className="text-sm">Ensure good lighting and clear view of the train number</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm">3</div>
                  <p className="text-sm">Press "Start AI Scan" and wait for the analysis to complete</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm">4</div>
                  <p className="text-sm">Review the Analyser Report and make your decision</p>
                </div>
              </div>

              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  The AI analyzes TCMS data, visual inspection, and historical patterns to provide recommendations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Analyser Report Display */
        <div className="space-y-6">
          {currentReport && (
            <>
              {/* Report Header */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Brain className="h-6 w-6 text-blue-600" />
                        AI Analyser Report
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {currentReport.platformId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {currentReport.scanTimestamp.toLocaleString()}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge 
                      className={`text-lg px-4 py-2 ${getRecommendationColor(currentReport.recommendation)}`}
                    >
                      {getRecommendationText(currentReport.recommendation)}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Main Decision Section for Platform Supervisor */}
              {isPlatformSupervisor && (
                <Card className="border-2 border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">Train {currentReport.trainId}</CardTitle>
                    <div className="flex justify-center gap-4 mt-4">
                      <Button 
                        size="lg" 
                        className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700"
                        onClick={() => handleDecision('service')}
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        GO FOR SERVICE
                      </Button>
                      <Button 
                        size="lg" 
                        variant="destructive"
                        className="px-8 py-4 text-lg"
                        onClick={() => handleDecision('replace')}
                      >
                        <XCircle className="mr-2 h-5 w-5" />
                        REPLACE
                      </Button>
                    </div>
                    <div className="text-center mt-4">
                      <Dialog open={explainerOpen} onOpenChange={setExplainerOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Why this Recommendation?
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>AI Decision Explanation</DialogTitle>
                            <DialogDescription>
                              Understanding why the AI recommends this action
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4>Primary Recommendation: {getRecommendationText(currentReport.recommendation)}</h4>
                              <p className="mt-2 text-sm">
                                Based on AI confidence level of {Math.round(currentReport.confidence * 100)}% and risk score of {Math.round(currentReport.aiRiskScore * 100)}%
                              </p>
                            </div>
                            
                            {currentReport.replacementSuggestion && (
                              <div className="p-4 bg-yellow-50 rounded-lg">
                                <h4>Replacement Analysis</h4>
                                <p className="mt-2 text-sm">{currentReport.replacementSuggestion.reason}</p>
                                <p className="mt-2 text-sm">
                                  <strong>Mileage Comparison:</strong> {currentReport.replacementSuggestion.mileageComparison}
                                </p>
                              </div>
                            )}
                            
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4>Key Factors Considered</h4>
                              <ul className="mt-2 text-sm space-y-1">
                                <li>• TCMS system health data</li>
                                <li>• Historical maintenance patterns</li>
                                <li>• Mileage and usage metrics</li>
                                <li>• Current fleet availability</li>
                                <li>• Branding requirements</li>
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                </Card>
              )}

              {/* Detailed Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TCMS Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      TCMS System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(currentReport.tcmsData).map(([system, status]) => (
                        <div key={system} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            {getSystemStatusIcon(status)}
                            <span className="text-sm capitalize">{system.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                          <Badge className={getSystemStatusColor(status)}>
                            {status.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Defects Identified */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Defects Identified
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentReport.defectsIdentified.length > 0 ? (
                        currentReport.defectsIdentified.map((defect, index) => (
                          <div key={index} className="p-3 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">{defect.system}</span>
                              <Badge className={getSeverityColor(defect.severity)}>
                                {defect.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{defect.description}</p>
                            {defect.estimatedRepairTime > 0 && (
                              <div className="flex items-center gap-1 text-xs">
                                <Wrench className="h-3 w-3" />
                                <span>Est. repair time: {defect.estimatedRepairTime}h</span>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p>No critical defects identified</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Confidence & Risk */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Analysis Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence Level</span>
                          <span>{Math.round(currentReport.confidence * 100)}%</span>
                        </div>
                        <Progress value={currentReport.confidence * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Risk Score</span>
                          <span className={currentReport.aiRiskScore > 0.6 ? 'text-red-600' : currentReport.aiRiskScore > 0.3 ? 'text-yellow-600' : 'text-green-600'}>
                            {Math.round(currentReport.aiRiskScore * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={currentReport.aiRiskScore * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={() => onTrainSelect(currentReport.trainId)}
                      >
                        View Full Train Profile
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="w-full" onClick={resetScan}>
                        Scan Another Train
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}