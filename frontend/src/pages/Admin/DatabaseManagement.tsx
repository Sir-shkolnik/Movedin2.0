import React, { useState, useEffect } from 'react';
import './DatabaseManagement.css';

interface DatabaseSchema {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

interface TableInfo {
  table_name: string;
  row_count: number;
  size_mb: number;
  last_updated: string;
  columns: DatabaseSchema[];
}

interface DatabaseHealth {
  status: string;
  connection_time_ms: number;
  total_tables: number;
  total_rows: number;
  total_size_mb: number;
  last_backup: string | null;
  replication_status: string;
}

interface DataValidation {
  table_name: string;
  validation_type: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  affected_rows?: number;
  sample_data?: any[];
}

interface QueryResult {
  query: string;
  execution_time_ms: number;
  row_count: number;
  columns: string[];
  data: any[];
  error?: string;
}

const DatabaseManagement: React.FC = () => {
  const [databaseHealth, setDatabaseHealth] = useState<DatabaseHealth | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [schemas, setSchemas] = useState<DatabaseSchema[]>([]);
  const [validations, setValidations] = useState<DataValidation[]>([]);
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadDatabaseInfo();
    if (autoRefresh) {
      const interval = setInterval(loadDatabaseInfo, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadDatabaseInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load database health
      const healthResponse = await fetch('https://movedin-backend.onrender.com/admin/database/health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setDatabaseHealth(healthData);
      }

      // Load table schemas
      const schemasResponse = await fetch('https://movedin-backend.onrender.com/admin/database/schemas');
      if (schemasResponse.ok) {
        const schemasData = await schemasResponse.json();
        setSchemas(schemasData);
      }

      // Load table information
      const tablesResponse = await fetch('https://movedin-backend.onrender.com/admin/database/tables');
      if (tablesResponse.ok) {
        const tablesData = await tablesResponse.json();
        setTables(tablesData);
      }

      // Load data validations
      const validationsResponse = await fetch('https://movedin-backend.onrender.com/admin/database/validate');
      if (validationsResponse.ok) {
        const validationsData = await validationsResponse.json();
        setValidations(validationsData);
      }

    } catch (error) {
      console.error('Error loading database info:', error);
      setError('Failed to load database information');
    } finally {
      setLoading(false);
    }
  };

  const executeCustomQuery = async () => {
    if (!customQuery.trim()) return;

    try {
      const response = await fetch('https://movedin-backend.onrender.com/admin/database/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: customQuery }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setQueryResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 queries
        setCustomQuery('');
      } else {
        setQueryResults(prev => [{
          query: customQuery,
          execution_time_ms: 0,
          row_count: 0,
          columns: [],
          data: [],
          error: result.detail || 'Query failed'
        }, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Error executing query:', error);
      setQueryResults(prev => [{
        query: customQuery,
        execution_time_ms: 0,
        row_count: 0,
        columns: [],
        data: [],
        error: 'Network error'
      }, ...prev.slice(0, 9)]);
    }
  };

  const backupDatabase = async () => {
    try {
      const response = await fetch('https://movedin-backend.onrender.com/admin/database/backup', {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Backup created successfully: ${result.backup_file}`);
        loadDatabaseInfo(); // Refresh to show new backup info
      } else {
        alert('Backup failed');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Backup failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'pass':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
      case 'fail':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'pass':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
      case 'fail':
        return '❌';
      default:
        return '❓';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderDatabaseHealth = () => (
    <div className="database-health">
      <h3>Database Health</h3>
      <div className="health-grid">
        <div className="health-card">
          <div className="health-header">
            <span className="health-icon">{getStatusIcon(databaseHealth?.status || 'unknown')}</span>
            <span className="health-title">Connection Status</span>
          </div>
          <div className="health-details">
            <p>Status: {databaseHealth?.status || 'Unknown'}</p>
            <p>Response Time: {databaseHealth?.connection_time_ms || 0}ms</p>
            <p>Total Tables: {databaseHealth?.total_tables || 0}</p>
            <p>Total Rows: {databaseHealth?.total_rows?.toLocaleString() || 0}</p>
            <p>Total Size: {formatBytes((databaseHealth?.total_size_mb || 0) * 1024 * 1024)}</p>
          </div>
        </div>

        <div className="health-card">
          <div className="health-header">
            <span className="health-icon">💾</span>
            <span className="health-title">Backup Status</span>
          </div>
          <div className="health-details">
            <p>Last Backup: {databaseHealth?.last_backup || 'Never'}</p>
            <p>Replication: {databaseHealth?.replication_status || 'N/A'}</p>
            <button onClick={backupDatabase} className="backup-btn">
              🔄 Create Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTableSchemas = () => (
    <div className="table-schemas">
      <h3>Database Schemas</h3>
      <div className="schemas-grid">
        {tables.map((table) => (
          <div key={table.table_name} className="schema-card">
            <div className="schema-header">
              <h4>{table.table_name}</h4>
              <span className="table-stats">
                {table.row_count.toLocaleString()} rows • {formatBytes(table.size_mb * 1024 * 1024)}
              </span>
            </div>
            <div className="schema-content">
              <table className="schema-table">
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Type</th>
                    <th>Nullable</th>
                    <th>Default</th>
                  </tr>
                </thead>
                <tbody>
                  {schemas
                    .filter(schema => schema.table_name === table.table_name)
                    .map((column, index) => (
                      <tr key={index}>
                        <td>{column.column_name}</td>
                        <td>{column.data_type}</td>
                        <td>{column.is_nullable}</td>
                        <td>{column.column_default || '-'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDataValidations = () => (
    <div className="data-validations">
      <h3>Data Validation</h3>
      <div className="validations-grid">
        {validations.map((validation, index) => (
          <div key={index} className={`validation-card ${validation.status}`}>
            <div className="validation-header">
              <span className="validation-icon">{getStatusIcon(validation.status)}</span>
              <span className="validation-title">{validation.table_name}</span>
              <span className="validation-type">{validation.validation_type}</span>
            </div>
            <div className="validation-details">
              <p>{validation.message}</p>
              {validation.affected_rows && (
                <p>Affected Rows: {validation.affected_rows.toLocaleString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQueryInterface = () => (
    <div className="query-interface">
      <h3>Custom Query Interface</h3>
      <div className="query-input">
        <textarea
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          placeholder="Enter SQL query (SELECT only for safety)..."
          rows={4}
        />
        <button onClick={executeCustomQuery} disabled={!customQuery.trim()}>
          🔍 Execute Query
        </button>
      </div>

      {queryResults.length > 0 && (
        <div className="query-results">
          <h4>Recent Queries</h4>
          {queryResults.map((result, index) => (
            <div key={index} className={`query-result ${result.error ? 'error' : 'success'}`}>
              <div className="query-header">
                <span className="query-text">{result.query}</span>
                <span className="query-meta">
                  {result.execution_time_ms}ms • {result.row_count} rows
                </span>
              </div>
              {result.error ? (
                <div className="query-error">{result.error}</div>
              ) : (
                <div className="query-data">
                  <table>
                    <thead>
                      <tr>
                        {result.columns.map((col, i) => (
                          <th key={i}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.slice(0, 10).map((row, i) => (
                        <tr key={i}>
                          {result.columns.map((col, j) => (
                            <td key={j}>{JSON.stringify(row[col])}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.data.length > 10 && (
                    <p className="query-note">Showing first 10 rows of {result.data.length}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading && !databaseHealth) {
    return (
      <div className="database-management">
        <div className="database-container">
          <div className="database-content">
            <div className="database-management-main">
              <div className="loading-section">
                <div className="loading-spinner">🔄</div>
                <p>Loading database information...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="database-management">
        <div className="database-container">
          <div className="database-content">
            <div className="database-management-main">
              <div className="error-section">
                <span>⚠️ {error}</span>
                <button onClick={loadDatabaseInfo}>Retry</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="database-management">
      <div className="database-container">
        <div className="database-content">
          <div className="database-management-main">
            <div className="page-header">
              <div className="header-content">
                <h1>Database Management</h1>
                <p className="header-subtitle">Monitor database health, schemas, and data integrity</p>
              </div>
              <div className="header-actions">
                <button className="refresh-btn" onClick={loadDatabaseInfo}>
                  🔄 Refresh
                </button>
                <label className="auto-refresh-toggle">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  Auto-refresh
                </label>
              </div>
            </div>

            {renderDatabaseHealth()}
            {renderTableSchemas()}
            {renderDataValidations()}
            {renderQueryInterface()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManagement; 