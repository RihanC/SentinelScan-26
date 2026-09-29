export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export type Category = 
  | 'Authentication & Sessions'
  | 'Authorization'
  | 'Input Validation'
  | 'API Security'
  | 'Client-Side Security'
  | 'Secure Communication'
  | 'Data Protection';

export type FindingStatus = 'Open' | 'In Review' | 'Remediated' | 'Accepted Risk';

export interface Finding {
  id: string;
  title: string;
  category: Category;
  severity: Severity;
  cvss: number;
  cvssVector?: string;
  affectedComponent: string;
  componentPath?: string;
  status: FindingStatus;
  description: string;
  whyIsThisRisky: string;
  impact: {
    confidentiality: 'High' | 'Medium' | 'Low' | 'None';
    integrity: 'High' | 'Medium' | 'Low' | 'None';
    availability: 'High' | 'Medium' | 'Low' | 'None';
    businessImpact: string;
  };
  evidence: {
    type: 'HTTP' | 'Header' | 'Config' | 'API' | 'Client';
    requestSnippet?: string;
    responseSnippet?: string;
    rawLog?: string;
    notes?: string;
  };
  poc: {
    name: string;
    safeValidationDescription: string;
    syntheticCommand: string;
    expectedBehavior: string;
    observedBehavior: string;
    steps: string[];
    logs: string[];
  };
  remediation: {
    summary: string;
    priority: 'Urgent' | 'High' | 'Medium' | 'Low';
    effort: 'Low' | 'Medium' | 'High';
    steps: string[];
    codeSample?: {
      language: string;
      before: string;
      after: string;
    };
    cwe: string;
    owaspCategory: string;
  };
  simulated: boolean;
  discoveredAt: string;
}

export interface SecurityCheck {
  id: string;
  name: string;
  category: Category;
  description: string;
  status: 'passed' | 'failed' | 'warning' | 'running' | 'pending';
  executionTimeMs?: number;
  findingId?: string;
}

export interface CategorySummary {
  category: Category;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  riskLevel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' | 'CRITICAL RISK';
  score: number;
}

export interface AttackSurfaceNode {
  id: string;
  label: string;
  type: 'target' | 'layer' | 'component' | 'endpoint' | 'datastore';
  status: 'healthy' | 'warning' | 'critical';
  checksCount: number;
  passedCount: number;
  findingsCount: number;
  parentId?: string;
  details: string;
  technologies: string[];
}

export interface AssessmentMetadata {
  targetUrl: string;
  targetRepo: string;
  assessmentType: string;
  status: 'Completed' | 'In Progress' | 'Ready';
  lastScanTimestamp: string;
  operator: string;
  scope: string[];
  environment: string;
  securityScore: number;
  previousScore: number;
  scoreDelta: number;
  totalChecks: number;
  checksCompleted: number;
}
