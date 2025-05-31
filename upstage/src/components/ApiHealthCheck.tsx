import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2, Info, RefreshCw } from 'lucide-react';
import { api } from '../api/service';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface ApiHealthCheckProps {
  showWhenHealthy?: boolean;
  autoRetry?: boolean;
  retryInterval?: number; // in seconds
}

interface HealthStatus {
  healthy: boolean;
  data?: any;
  error?: string;
}

export const ApiHealthCheck: React.FC<ApiHealthCheckProps> = ({ 
  showWhenHealthy = false,
  autoRetry = true,
  retryInterval = 30
}) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkHealth = async (isManual = false) => {
    if (isManual) {
      setRetryCount(0); // Reset retry count for manual checks
    }
    
    setIsChecking(true);
    
    try {
      const status = await api.getHealthStatus();
      setHealthStatus(status);
      setLastChecked(new Date());
      
      if (status.healthy) {
        setRetryCount(0); // Reset retry count on success
      }
    } catch (err) {
      setHealthStatus({
        healthy: false,
        error: err instanceof Error ? err.message : 'Network error occurred'
      });
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-retry logic
  useEffect(() => {
    if (!autoRetry || !healthStatus || healthStatus.healthy) {
      return;
    }

    const maxRetries = 3;
    if (retryCount >= maxRetries) {
      return;
    }

    const timeout = setTimeout(() => {
      setRetryCount(prev => prev + 1);
      checkHealth();
    }, retryInterval * 1000);

    return () => clearTimeout(timeout);
  }, [healthStatus, retryCount, autoRetry, retryInterval]);

  // Initial health check
  useEffect(() => {
    checkHealth();
  }, []);

  // Don't show anything if healthy and showWhenHealthy is false
  if (healthStatus?.healthy && !showWhenHealthy) {
    return null;
  }

  // Don't show anything while checking initially
  if (healthStatus === null && isChecking) {
    return null;
  }

  const getStatusColor = () => {
    if (healthStatus?.healthy) return 'border-green-500 bg-green-500';
    if (healthStatus?.healthy === false) return 'border-red-500 bg-red-500';
    return 'border-yellow-500 bg-yellow-500';
  };

  const getStatusIcon = () => {
    if (isChecking) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
    if (healthStatus?.healthy) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking API Connection...';
    if (healthStatus?.healthy) return 'API Connected';
    return 'API Connection Failed';
  };

  const getStatusTextColor = () => {
    if (healthStatus?.healthy) return 'text-green-300';
    if (healthStatus?.healthy === false) return 'text-red-300';
    return 'text-yellow-300';
  };

  const formatLastChecked = () => {
    if (!lastChecked) return '';
    return `Last checked: ${lastChecked.toLocaleTimeString()}`;
  };

  return (
    <Card className={`p-4 mb-4 ${getStatusColor()} bg-opacity-10`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getStatusIcon()}
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className={`font-medium ${getStatusTextColor()}`}>
                {getStatusText()}
              </h3>
              {retryCount > 0 && (
                <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                  Retry {retryCount}/3
                </span>
              )}
            </div>
            
            {/* Health data display */}
            {healthStatus?.healthy && healthStatus.data && (
              <div className="mt-2 text-sm text-green-400">
                <div className="flex items-center space-x-4">
                  <span>Service: {healthStatus.data.service || 'API'}</span>
                  {healthStatus.data.version && (
                    <span>Version: {healthStatus.data.version}</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Error display */}
            {healthStatus?.error && (
              <div className="mt-2">
                <p className="text-sm text-red-400">{healthStatus.error}</p>
                
                <div className="text-sm text-red-400 mt-2 space-y-1">
                  <p>• Make sure your backend server is running on <code className="bg-gray-700 px-1 rounded">http://localhost:8080</code></p>
                  <p>• Check that the server has started completely (look for "Started Phas1Application" in logs)</p>
                  <p>• Using mock data for development until API is available</p>
                </div>
              </div>
            )}
            
            {/* Last checked timestamp */}
            {lastChecked && (
              <p className="text-xs text-gray-500 mt-2">
                {formatLastChecked()}
                {retryCount > 0 && autoRetry && (
                  <span className="ml-2">
                    (Auto-retry in {retryInterval}s)
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {healthStatus?.healthy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('API Health Data:', healthStatus.data)}
              title="View health details"
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => checkHealth(true)}
            disabled={isChecking}
            title="Manual health check"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
};