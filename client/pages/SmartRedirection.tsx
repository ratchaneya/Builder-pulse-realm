import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, Brain, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataDashboard } from "@/components/ui/data-dashboard";
import { AlertSystem } from "@/components/ui/alert-system";
import { RecommendationEngine } from "@/components/ui/recommendation-engine";
import { GamificationPanel } from "@/components/ui/gamification-panel";

const mockAlerts = [
  {
    id: "alert-1",
    type: "combined" as const,
    severity: "danger" as const,
    title: "Critical Congestion Alert",
    message:
      "Nimman area has exceeded safe thresholds for both traffic and air quality. Immediate redirection recommended.",
    timestamp: "14:25",
    metrics: {
      crowdLevel: 85,
      pm25Level: 78,
      trafficScore: 2.3,
    },
  },
];

const userInterests = ["Cafés", "Nature", "Photography"];

export default function SmartRedirection() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lineNotificationSent, setLineNotificationSent] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  const handleNotifyLine = () => {
    setLineNotificationSent(true);
    // In a real app, this would integrate with LINE Notify API
    setTimeout(() => setLineNotificationSent(false), 3000);
  };

  const handleSelectDestination = (destinationId: string) => {
    console.log(`Redirecting to destination: ${destinationId}`);
    // In a real app, this would trigger navigation
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">
                    Smart Engine
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    AI-powered redirection
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {lineNotificationSent && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  <MessageSquare className="h-3 w-3" />
                  Sent!
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* System Overview */}
        <section className="bg-card rounded-xl border border-border p-4">
          <h2 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Intelligent Tourism Redirection
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Our AI system continuously monitors crowd density, air quality, and
            traffic patterns to proactively suggest better destinations for
            sustainable tourism.
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="font-bold text-primary">Real-time</div>
              <div className="text-xs text-muted-foreground">
                Data integration
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="font-bold text-primary">1-2 hours</div>
              <div className="text-xs text-muted-foreground">
                Prediction window
              </div>
            </div>
          </div>
        </section>

        {/* Real-time Data Dashboard */}
        <DataDashboard
          location="Nimman Road, Chiang Mai"
          lastUpdated="2 minutes ago"
        />

        {/* Alert System */}
        <AlertSystem
          alerts={alerts}
          onDismiss={handleDismissAlert}
          onNotifyLine={handleNotifyLine}
        />

        {/* Recommendation Engine */}
        {alerts.length > 0 && (
          <RecommendationEngine
            userInterests={userInterests}
            recommendations={[]}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {/* Gamification Panel */}
        <GamificationPanel
          userPoints={1247}
          level={3}
          nextLevelPoints={1500}
          todaySavings={{
            co2: 2.3,
            time: 35,
            pm25Avoided: 142,
          }}
        />

        {/* System Info */}
        <section className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-card-foreground mb-3">
            Data Sources & Integration
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Crowd Density</span>
              <span className="text-green-600 font-medium">
                WiFi/Bluetooth tracking
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Air Quality</span>
              <span className="text-green-600 font-medium">AirVisual API</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Traffic Data</span>
              <span className="text-green-600 font-medium">
                Google Directions API
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Historical Analysis</span>
              <span className="text-green-600 font-medium">ML Forecasting</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Threshold Configuration:</strong> Alerts trigger when
              traffic score &ge; 2.0 AND PM2.5 &gt; 90 &mu;g/m&sup3;.
              Predictions use 30-day historical patterns with real-time
              adjustments.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Smart redirection engine • Powered by sustainable tourism AI
          </p>
        </footer>
      </main>
    </div>
  );
}
