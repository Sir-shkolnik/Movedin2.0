import React, { useState, useEffect } from 'react';
import './SystemMonitoring.css';

interface SystemHealth {
  status: string;
  timestamp: string;
  version: string;
}

interface VendorLiveStatus {
  timestamp: string;
  system_status: string;
  vendors: Record<string, any>;
  data_sources: {
    google_sheets: {
      status: string;
      last_check: string;
      dispatchers_available: number;
    };
    database: {
      status: string;
      vendors_count: number;
    };
  };
}

interface DataValidation {
  timestamp: string;
  overall_status: string;
  vendors: Record<string, any>;
  system_health: {
    google_sheets_connection: boolean;
    database_connection: boolean;
    api_endpoints: boolean;
  };
  summary: {
    total_vendors: number;
    validated_vendors: number;
    errors_found: number;
    warnings: string[];
  };
}

interface APIEndpoint {
  name: string;
  url: string;
  method: string;
  status: 'healthy' | 'warning' | 'error' | 'checking';
  response_time_ms: number;
  status_code?: number;
  last_check: string;
  error?: string;
  data_sample?: any;
}

interface SystemMetrics {
  total_requests: number;
  average_response_time: number;
  error_rate: number;
  uptime_percentage: number;
  active_connections: number;
}

const SystemMonitoring: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [vendorStatus, setVendorStatus] = useState<VendorLiveStatus | null>(null);
  const [dataValidation, setDataValidation] = useState<DataValidation | null>(null);
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Define all API endpoints to monitor
  const endpointsToMonitor: Omit<APIEndpoint, 'status' | 'response_time_ms' | 'last_check'>[] = [
    {
      name: 'System Health',
      url: 'http://localhost:8000/health',
      method: 'GET'
    },
    {
      name: 'Vendor Live Status',
      url: 'http://localhost:8000/admin/vendors/live-status',
      method: 'GET'
    },
    {
      name: 'Data Validation',
      url: 'http://localhost:8000/admin/vendors/data-validation',
      method: 'GET'
    },
    {
      name: 'Vendor Locations',
      url: 'http://localhost:8000/admin/vendors/locations',
      method: 'GET'
    },
    {
      name: 'Vendor Logic (Let\'s Get Moving)',
      url: 'http://localhost:8000/admin/vendors/lets-get-moving/logic',
      method: 'GET'
    },
    {
      name: 'Bulk Availability',
      url: 'http://localhost:8000/admin/vendors/availability/bulk?vendor_slug=lets-get-moving&start_date=2025-08-01&end_date=2025-08-07',
      method: 'GET'
    },
    {
      name: 'Leads API',
      url: 'http://localhost:8000/api/leads/',
      method: 'GET'
    },
    {
      name: 'Quote Generation',
      url: 'http://localhost:8000/api/generate',
      method: 'POST'
    }
  ];

  useEffect(() => {
    loadAllSystemData();
    
    if (autoRefresh) {
      const interval = setInterval(loadAllSystemData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadAllSystemData = async () => {
    try {
      setLoading(true);
      setError(null);
      setLastUpdate(new Date().toLocaleString());

      // Load system health
      await loadSystemHealth();
      
      // Load vendor live status
      await loadVendorLiveStatus();
      
      // Load data validation
      await loadDataValidation();
      
      // Check all API endpoints
      await checkAllAPIEndpoints();
      
      // Calculate system metrics
      calculateSystemMetrics();

    } catch (err) {
      console.error('Error loading system data:', err);
      setError('Failed to load system monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const loadSystemHealth = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        const data = await response.json();
        setSystemHealth(data);
      } else {
        throw new Error(`Health check failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading system health:', error);
    }
  };

  const loadVendorLiveStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/vendors/live-status');
      if (response.ok) {
        const data = await response.json();
        setVendorStatus(data);
      } else {
        throw new Error(`Vendor status check failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading vendor live status:', error);
    }
  };

  const loadDataValidation = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/vendors/data-validation');
      if (response.ok) {
        const data = await response.json();
        setDataValidation(data);
      } else {
        throw new Error(`Data validation check failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading data validation:', error);
    }
  };

  const checkAllAPIEndpoints = async () => {
    const endpointChecks = endpointsToMonitor.map(async (endpoint) => {
      const startTime = Date.now();
      let status: 'healthy' | 'warning' | 'error' | 'checking' = 'checking';
      let responseTime = 0;
      let statusCode: number | undefined;
      let errorMessage: string | undefined;
      let dataSample: any = undefined;

      try {
        const options: RequestInit = {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json'
          }
        };

        // Add body for POST requests
        if (endpoint.method === 'POST') {
          options.body = JSON.stringify({
            origin_address: "123 Main St, Toronto, ON",
            destination_address: "456 Oak Ave, Mississauga, ON",
            move_date: "2025-08-15",
            move_time: "Morning",
            total_rooms: 3
          });
        }

        const response = await fetch(endpoint.url, options);
        responseTime = Date.now() - startTime;
        statusCode = response.status;

        if (response.ok) {
          status = responseTime < 1000 ? 'healthy' : 'warning';
          try {
            const data = await response.json();
            dataSample = data;
          } catch {
            // Ignore JSON parsing errors for data sample
          }
        } else {
          status = 'error';
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
      } catch (error) {
        responseTime = Date.now() - startTime;
        status = 'error';
        errorMessage = error instanceof Error ? error.message : 'Network error';
      }

      return {
        ...endpoint,
        status,
        response_time_ms: responseTime,
        status_code: statusCode,
        last_check: new Date().toISOString(),
        error: errorMessage,
        data_sample: dataSample
      };
    });

    const results = await Promise.all(endpointChecks);
    setApiEndpoints(results);
  };

  const calculateSystemMetrics = () => {
    if (apiEndpoints.length === 0) return;

    const totalRequests = apiEndpoints.length;
    const healthyEndpoints = apiEndpoints.filter(ep => ep.status === 'healthy').length;
    const errorEndpoints = apiEndpoints.filter(ep => ep.status === 'error').length;
    const averageResponseTime = apiEndpoints.reduce((sum, ep) => sum + ep.response_time_ms, 0) / totalRequests;
    const errorRate = (errorEndpoints / totalRequests) * 100;
    const uptimePercentage = (healthyEndpoints / totalRequests) * 100;

    setSystemMetrics({
      total_requests: totalRequests,
      average_response_time: averageResponseTime,
      error_rate: errorRate,
      uptime_percentage: uptimePercentage,
      active_connections: healthyEndpoints
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'valid':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
      case 'failed':
        return '#ef4444';
      case 'checking':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'valid':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
      case 'failed':
        return '❌';
      case 'checking':
        return '🔄';
      default:
        return '❓';
    }
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderSystemOverview = () => (
    <div className="system-overview">
      <div className="overview-header">
        <h2>System Overview</h2>
        <div className="overview-controls">
          <button 
            onClick={loadAllSystemData}
            className="refresh-btn"
            disabled={loading}
          >
            {loading ? '🔄 Refreshing...' : '🔄 Refresh Now'}
          </button>
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (30s)
          </label>
        </div>
      </div>

      {lastUpdate && (
        <div className="last-update">
          Last updated: {lastUpdate}
        </div>
      )}

      {systemHealth && (
        <div className="health-status">
          <div className="status-indicator">
            <span className="status-icon">{getStatusIcon(systemHealth.status)}</span>
            <span className="status-text">System Status: {systemHealth.status}</span>
          </div>
          <div className="version-info">
            Version: {systemHealth.version} | Timestamp: {formatTimestamp(systemHealth.timestamp)}
          </div>
        </div>
      )}
    </div>
  );

  const renderSystemMetrics = () => {
    if (!systemMetrics) return null;

    return (
      <div className="system-metrics">
        <h3>System Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <span className="metric-value">{systemMetrics.total_requests}</span>
              <span className="metric-label">Total Endpoints</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">⚡</div>
            <div className="metric-content">
              <span className="metric-value">{formatResponseTime(systemMetrics.average_response_time)}</span>
              <span className="metric-label">Avg Response Time</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">🔗</div>
            <div className="metric-content">
              <span className="metric-value">{systemMetrics.active_connections}</span>
              <span className="metric-label">Active Connections</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <span className="metric-value">{systemMetrics.uptime_percentage.toFixed(1)}%</span>
              <span className="metric-label">Uptime</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">⚠️</div>
            <div className="metric-content">
              <span className="metric-value">{systemMetrics.error_rate.toFixed(1)}%</span>
              <span className="metric-label">Error Rate</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAPIEndpoints = () => (
    <div className="api-endpoints">
      <h3>API Endpoints Status</h3>
      <div className="endpoints-grid">
        {apiEndpoints.map((endpoint, index) => (
          <div key={index} className={`endpoint-card ${endpoint.status}`}>
            <div className="endpoint-header">
              <div className="endpoint-info">
                <span className="endpoint-name">{endpoint.name}</span>
                <span className="endpoint-method">{endpoint.method}</span>
              </div>
              <div className="endpoint-status">
                <span className="status-icon">{getStatusIcon(endpoint.status)}</span>
                <span className="status-text">{endpoint.status}</span>
              </div>
            </div>
            
            <div className="endpoint-details">
              <div className="detail-row">
                <span className="label">URL:</span>
                <span className="value">{endpoint.url}</span>
              </div>
              <div className="detail-row">
                <span className="label">Response Time:</span>
                <span className="value">{formatResponseTime(endpoint.response_time_ms)}</span>
              </div>
              {endpoint.status_code && (
                <div className="detail-row">
                  <span className="label">Status Code:</span>
                  <span className="value">{endpoint.status_code}</span>
                </div>
              )}
              {endpoint.error && (
                <div className="detail-row error">
                  <span className="label">Error:</span>
                  <span className="value">{endpoint.error}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="label">Last Check:</span>
                <span className="value">{formatTimestamp(endpoint.last_check)}</span>
              </div>
            </div>

            {endpoint.data_sample && (
              <div className="data-sample">
                <details>
                  <summary>View Response Sample</summary>
                  <pre>{JSON.stringify(endpoint.data_sample, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderVendorStatus = () => {
    if (!vendorStatus) return null;

    return (
      <div className="vendor-status">
        <h3>Vendor System Status</h3>
        <div className="vendor-status-grid">
          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">{getStatusIcon(vendorStatus.system_status)}</span>
              <span className="status-title">Overall System</span>
            </div>
            <div className="status-details">
              <p>Status: {vendorStatus.system_status}</p>
              <p>Timestamp: {formatTimestamp(vendorStatus.timestamp)}</p>
            </div>
          </div>

          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">{getStatusIcon(vendorStatus.data_sources.google_sheets.status)}</span>
              <span className="status-title">Google Sheets</span>
            </div>
            <div className="status-details">
              <p>Status: {vendorStatus.data_sources.google_sheets.status}</p>
              <p>Dispatchers: {vendorStatus.data_sources.google_sheets.dispatchers_available}</p>
              <p>Last Check: {formatTimestamp(vendorStatus.data_sources.google_sheets.last_check)}</p>
            </div>
          </div>

          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">{getStatusIcon(vendorStatus.data_sources.database.status)}</span>
              <span className="status-title">Database</span>
            </div>
            <div className="status-details">
              <p>Status: {vendorStatus.data_sources.database.status}</p>
              <p>Vendors: {vendorStatus.data_sources.database.vendors_count}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDataValidation = () => {
    if (!dataValidation) return null;

    return (
      <div className="data-validation">
        <h3>Data Validation</h3>
        <div className="validation-grid">
          <div className="validation-card">
            <div className="validation-header">
              <span className="validation-icon">{getStatusIcon(dataValidation.overall_status)}</span>
              <span className="validation-title">Overall Status</span>
            </div>
            <div className="validation-details">
              <p>Status: {dataValidation.overall_status}</p>
              <p>Total Vendors: {dataValidation.summary.total_vendors}</p>
              <p>Validated: {dataValidation.summary.validated_vendors}</p>
              <p>Errors: {dataValidation.summary.errors_found}</p>
            </div>
          </div>

          <div className="validation-card">
            <div className="validation-header">
              <span className="validation-icon">{getStatusIcon(dataValidation.system_health.google_sheets_connection ? 'healthy' : 'error')}</span>
              <span className="validation-title">Google Sheets</span>
            </div>
            <div className="validation-details">
              <p>Connection: {dataValidation.system_health.google_sheets_connection ? 'Connected' : 'Disconnected'}</p>
            </div>
          </div>

          <div className="validation-card">
            <div className="validation-header">
              <span className="validation-icon">{getStatusIcon(dataValidation.system_health.database_connection ? 'healthy' : 'error')}</span>
              <span className="validation-title">Database</span>
            </div>
            <div className="validation-details">
              <p>Connection: {dataValidation.system_health.database_connection ? 'Connected' : 'Disconnected'}</p>
            </div>
          </div>

          <div className="validation-card">
            <div className="validation-header">
              <span className="validation-icon">{getStatusIcon(dataValidation.system_health.api_endpoints ? 'healthy' : 'error')}</span>
              <span className="validation-title">API Endpoints</span>
            </div>
            <div className="validation-details">
              <p>Status: {dataValidation.system_health.api_endpoints ? 'Operational' : 'Issues Detected'}</p>
            </div>
          </div>
        </div>

        {dataValidation.summary.warnings.length > 0 && (
          <div className="validation-warnings">
            <h4>Warnings</h4>
            <ul>
              {dataValidation.summary.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (loading && !systemHealth) {
    return (
      <div className="system-monitoring">
        <div className="system-container">
          <div className="system-content">
            <div className="system-monitoring-main">
              <div className="loading-section">
                <div className="loading-spinner">🔄</div>
                <p>Loading system monitoring data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="system-monitoring">
        <div className="system-container">
          <div className="system-content">
            <div className="system-monitoring-main">
              <div className="error-section">
                <span>⚠️ {error}</span>
                <button onClick={loadAllSystemData}>Retry</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="system-monitoring">
      <div className="system-container">
        <div className="system-content">
          <div className="system-monitoring-main">
            <div className="page-header">
              <h1>System Monitoring</h1>
              <p>Real-time monitoring of all APIs and system health</p>
            </div>

            {renderSystemOverview()}
            {renderSystemMetrics()}
            {renderAPIEndpoints()}
            {renderVendorStatus()}
            {renderDataValidation()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring; 