import { Category, Finding, SecurityCheck, CategorySummary } from '../types/security';
import { mockFindings, mockSecurityChecks } from '../data/mockSecurityData';

export interface ScanStage {
  id: string;
  name: string;
  category: Category;
  description: string;
}

export const SCAN_STAGES: ScanStage[] = [
  { id: 'target_cfg', name: 'Target Configuration & TLS Handshake', category: 'Secure Communication', description: 'Auditing SSL/TLS parameters, certificate authorities, cipher suites' },
  { id: 'auth_checks', name: 'Authentication Checks', category: 'Authentication & Sessions', description: 'Testing token signatures, credential transport, session lifecycle' },
  { id: 'session_checks', name: 'Session Storage Checks', category: 'Authentication & Sessions', description: 'Verifying Set-Cookie flags (HttpOnly, Secure, SameSite) and expiration' },
  { id: 'authz_checks', name: 'Authorization & Access Control', category: 'Authorization', description: 'Executing BOLA/IDOR probes against synthetic multi-tenant resources' },
  { id: 'input_checks', name: 'Input Validation & Sanitization', category: 'Input Validation', description: 'Testing query parser bounds, ReDoS thresholds, and injection parameters' },
  { id: 'api_checks', name: 'API Security & CORS Policies', category: 'API Security', description: 'Auditing CORS preflight origins, rate limits, and GraphQL schemas' },
  { id: 'client_checks', name: 'Client-Side & CSP Hardening', category: 'Client-Side Security', description: 'Inspecting Content Security Policy directives and SCA package manifests' },
  { id: 'data_checks', name: 'Data Protection & Error Disclosure', category: 'Data Protection', description: 'Probing error handling pipelines for stack traces and internal secrets' }
];

export class SecurityScannerService {
  public static runAuthenticationChecks(): Finding[] {
    return mockFindings.filter(f => f.category === 'Authentication & Sessions');
  }

  public static runAuthorizationChecks(): Finding[] {
    return mockFindings.filter(f => f.category === 'Authorization');
  }

  public static runInputValidationChecks(): Finding[] {
    return mockFindings.filter(f => f.category === 'Input Validation');
  }

  public static runApiSecurityChecks(): Finding[] {
    return mockFindings.filter(f => f.category === 'API Security');
  }

  public static runClientSecurityChecks(): Finding[] {
    return mockFindings.filter(f => f.category === 'Client-Side Security');
  }

  public static runCommunicationChecks(): Finding[] {
    return mockFindings.filter(f => f.category === 'Secure Communication');
  }

  public static runDataProtectionChecks(): Finding[] {
    return mockFindings.filter(f => f.category === 'Data Protection');
  }

  public static calculateSecurityScore(findings: Finding[]): number {
    // Dynamic calculation based on active findings severity
    const activeFindings = findings.filter(f => f.status === 'Open' || f.status === 'In Review');
    let deduction = 0;
    
    for (const f of activeFindings) {
      switch (f.severity) {
        case 'Critical':
          deduction += 16;
          break;
        case 'High':
          deduction += 8;
          break;
        case 'Medium':
          deduction += 4;
          break;
        case 'Low':
          deduction += 1.5;
          break;
        case 'Informational':
          deduction += 0.5;
          break;
      }
    }

    const score = Math.max(15, Math.min(98, Math.round(100 - deduction)));
    return score;
  }

  public static calculateCategorySummaries(findings: Finding[], checks: SecurityCheck[]): CategorySummary[] {
    const categories: Category[] = [
      'Authentication & Sessions',
      'Authorization',
      'Input Validation',
      'API Security',
      'Client-Side Security',
      'Secure Communication',
      'Data Protection'
    ];

    return categories.map(cat => {
      const catChecks = checks.filter(c => c.category === cat);
      const catFindings = findings.filter(f => f.category === cat && (f.status === 'Open' || f.status === 'In Review'));
      
      const totalChecks = catChecks.length || 3;
      const failedChecks = catChecks.filter(c => c.status === 'failed').length;
      const warningChecks = catChecks.filter(c => c.status === 'warning').length;
      const passedChecks = Math.max(0, totalChecks - failedChecks - warningChecks);

      let riskLevel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' | 'CRITICAL RISK' = 'LOW RISK';
      if (catFindings.some(f => f.severity === 'Critical')) {
        riskLevel = 'CRITICAL RISK';
      } else if (catFindings.some(f => f.severity === 'High')) {
        riskLevel = 'HIGH RISK';
      } else if (catFindings.some(f => f.severity === 'Medium')) {
        riskLevel = 'MEDIUM RISK';
      }

      const score = Math.max(20, Math.round((passedChecks / totalChecks) * 100));

      return {
        category: cat,
        totalChecks,
        passedChecks,
        failedChecks,
        warningChecks,
        riskLevel,
        score
      };
    });
  }

  public static simulateScanStep(
    index: number,
    onProgress: (progress: number, stage: ScanStage, check: SecurityCheck, log: string) => void
  ): Promise<void> {
    return new Promise(resolve => {
      const stage = SCAN_STAGES[index % SCAN_STAGES.length];
      const check = mockSecurityChecks[index % mockSecurityChecks.length];
      const progress = Math.min(100, Math.round(((index + 1) / mockSecurityChecks.length) * 100));
      const log = `[${new Date().toISOString().substring(11, 19)}] Running ${check.name} on ${check.category}...`;
      
      onProgress(progress, stage, check, log);
      setTimeout(resolve, 120);
    });
  }
}
