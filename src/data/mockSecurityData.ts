import { Finding, SecurityCheck, AttackSurfaceNode, AssessmentMetadata } from '../types/security';

export const initialAssessmentMetadata: AssessmentMetadata = {
  targetUrl: 'https://www.worldmonitor.app',
  targetRepo: 'https://github.com/koala73/worldmonitor',
  assessmentType: 'Authorized Simulated Security Assessment',
  status: 'Completed',
  lastScanTimestamp: '2026-09-29 06:45:12 UTC',
  operator: 'SecOps Automated Agent (SentinelScan v3.4)',
  scope: [
    'Web Application (Frontend Client)',
    'Public Geopolitical Ingestion APIs',
    'Session Token & Cookie Storage',
    'HTTP Security Headers & CSP',
    'RSS/News Parser Sanitization'
  ],
  environment: 'Simulated Sandbox Environment (Local Test Instance)',
  securityScore: 72,
  previousScore: 68,
  scoreDelta: +4,
  totalChecks: 24,
  checksCompleted: 24
};

export const mockFindings: Finding[] = [
  {
    id: 'VULN-001',
    title: 'Missing Standard Security Headers (CSP & HSTS Preload)',
    category: 'Client-Side Security',
    severity: 'Medium',
    cvss: 5.3,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N',
    affectedComponent: 'Client Edge / Cloudflare Reverse Proxy',
    componentPath: 'headers.config.ts / Edge Ingress',
    status: 'Open',
    description: 'The server response does not include a strict Content-Security-Policy (CSP) or Strict-Transport-Security with preload directives. This leaves client browsers more susceptible to cross-site scripting (XSS) injection and downgrade attacks.',
    whyIsThisRisky: 'Without a Content-Security-Policy, if an attacker finds an injection point in dynamic feed descriptions or map tooltips, they could load arbitrary third-party JavaScript into an analyst\'s session.',
    impact: {
      confidentiality: 'Low',
      integrity: 'Medium',
      availability: 'None',
      businessImpact: 'Risk of client-side DOM manipulation or session token harvesting during intelligence monitoring sessions.'
    },
    evidence: {
      type: 'Header',
      requestSnippet: 'GET / HTTP/2\nHost: worldmonitor.app\nUser-Agent: SentinelScan-Audit/1.0',
      responseSnippet: 'HTTP/2 200 OK\nDate: Tue, 29 Sep 2026 06:42:11 GMT\nContent-Type: text/html; charset=utf-8\nX-Powered-By: Next.js\n// MISSING: Content-Security-Policy\n// MISSING: Strict-Transport-Security (includeSubDomains; preload)\n// MISSING: X-Content-Type-Options: nosniff',
      rawLog: 'Edge ingress verification flagged 3 missing standard defense-in-depth headers on root and dashboard routes.'
    },
    poc: {
      name: 'Safe Header Audit Probe',
      safeValidationDescription: 'Perform non-destructive HEAD and OPTIONS requests to evaluate ingress response headers against OWASP Secure Headers benchmark.',
      syntheticCommand: 'sentinelscan headers verify --target https://demo.worldmonitor.local --safe-mode',
      expectedBehavior: 'HTTP/2 200 with CSP, HSTS, X-Frame-Options: DENY, and X-Content-Type-Options: nosniff',
      observedBehavior: 'Header inspection confirms Content-Security-Policy and HSTS Preload headers are absent.',
      steps: [
        'Establish TLS session to test harness gateway.',
        'Issue RFC 9110 compliant HEAD request to root path.',
        'Inspect and parse all returned HTTP response headers.',
        'Compare against OWASP Secure Headers Project baseline recommendations.'
      ],
      logs: [
        '[TEST] Initializing non-destructive header verification...',
        '[TEST] Sending synthetic HEAD / request to test harness...',
        '[TEST] Response Code: 200 OK',
        '[WARN] Content-Security-Policy: NOT FOUND',
        '[WARN] Strict-Transport-Security: Max-age too low or preload missing',
        '[INFO] X-Frame-Options: SAMEORIGIN (Present)',
        '[RESULT] Validation completed. Security header baseline not satisfied.'
      ]
    },
    remediation: {
      summary: 'Configure strict CSP and HSTS headers in your reverse proxy or Next.js headers configuration.',
      priority: 'Medium',
      effort: 'Low',
      steps: [
        'Add a Content-Security-Policy header restricting script-src to trusted sources and nonces.',
        'Enforce Strict-Transport-Security with max-age=31536000; includeSubDomains; preload.',
        'Add X-Content-Type-Options: nosniff to prevent MIME type sniffing.',
        'Verify with browser developer tools or automated CI header checks.'
      ],
      codeSample: {
        language: 'typescript',
        before: '// next.config.mjs\nexport default {\n  reactStrictMode: true,\n};',
        after: '// next.config.mjs\nexport default {\n  headers: async () => [\n    {\n      source: "/:path*",\n      headers: [\n        { key: "Content-Security-Policy", value: "default-src \'self\'; script-src \'self\' https://cdn.jsdelivr.net; style-src \'self\' \'unsafe-inline\'; connect-src \'self\' https://api.worldmonitor.app;" },\n        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },\n        { key: "X-Content-Type-Options", value: "nosniff" },\n        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }\n      ]\n    }\n  ]\n};'
      },
      cwe: 'CWE-693 (Protection Mechanism Failure)',
      owaspCategory: 'A05:2021 - Security Misconfiguration'
    },
    simulated: true,
    discoveredAt: '2026-09-29 06:42:15'
  },
  {
    id: 'VULN-002',
    title: 'Weak Session Cookie Configuration (Missing SameSite / Secure Flags)',
    category: 'Authentication & Sessions',
    severity: 'High',
    cvss: 7.5,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N',
    affectedComponent: 'Auth Cookie Manager / Session Store',
    componentPath: 'src/services/authSession.ts:42',
    status: 'Open',
    description: 'Session authentication tokens issued by the test backend set cookies without the `SameSite=Strict` and `HttpOnly` attributes. Client scripts can read the raw session cookie via document.cookie.',
    whyIsThisRisky: 'If an adversary discovers any secondary XSS vulnerability or induces a cross-site request, the session cookie could be read by client JavaScript or transmitted across origins automatically.',
    impact: {
      confidentiality: 'High',
      integrity: 'Medium',
      availability: 'None',
      businessImpact: 'Account takeover or session hijacking of intelligence dashboard users.'
    },
    evidence: {
      type: 'HTTP',
      requestSnippet: 'POST /api/auth/session HTTP/1.1\nHost: worldmonitor.app\nContent-Type: application/json\n\n{"client_id": "test_analyst_session"}',
      responseSnippet: 'HTTP/1.1 200 OK\nSet-Cookie: wm_session_id=s%3A7a9b1c2d3e4f; Path=/;\n// NOTICE: Missing "HttpOnly", "Secure", and "SameSite=Lax/Strict"',
      rawLog: 'Cookie attributes inspected: HttpOnly=false, Secure=false, SameSite=None'
    },
    poc: {
      name: 'Simulated Session Cookie Flag Validation',
      safeValidationDescription: 'Send a synthetic authentication handshake against the mock test harness and inspect the Set-Cookie response parameters without storing credentials.',
      syntheticCommand: 'sentinelscan auth test-cookie --endpoint /api/auth/session --mock-target',
      expectedBehavior: 'Set-Cookie: wm_session_id=...; Path=/; Secure; HttpOnly; SameSite=Lax',
      observedBehavior: 'Cookie received without HttpOnly and SameSite flags.',
      steps: [
        'Invoke synthetic session generation on test harness.',
        'Extract Set-Cookie header directive tokens.',
        'Assert existence of HttpOnly, Secure, and SameSite attributes.',
        'Generate compliance scorecard.'
      ],
      logs: [
        '[TEST] Initiating controlled session attribute check...',
        '[TEST] Target: Local Test Environment (Mock API)',
        '[TEST] Dispatched synthetic session initialization request...',
        '[EVAL] Parsing Set-Cookie: wm_session_id=s%3A7a9b1c2d3e4f',
        '[FAIL] Flag "HttpOnly" is missing! DOM scripts can access token.',
        '[FAIL] Flag "Secure" is missing! Cookie could transmit over unencrypted transport.',
        '[WARN] Flag "SameSite" missing! Defaulting to lax browser policy.',
        '[RESULT] Test completed. Weak session cookie configuration confirmed.'
      ]
    },
    remediation: {
      summary: 'Ensure all session cookies are created with HttpOnly, Secure, and SameSite=Lax or Strict flags.',
      priority: 'High',
      effort: 'Low',
      steps: [
        'Update server cookie creation flags in session handler.',
        'Store sensitive tokens only in HttpOnly cookies, not in localStorage.',
        'Enforce HTTPS-only transport with Secure flag enabled in all non-local environments.'
      ],
      codeSample: {
        language: 'typescript',
        before: 'res.setHeader("Set-Cookie", `wm_session_id=${token}; Path=/`);',
        after: 'res.setHeader(\n  "Set-Cookie",\n  `wm_session_id=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`\n);'
      },
      cwe: 'CWE-614 (Sensitive Cookie in HTTPS Session Without "Secure" Attribute)',
      owaspCategory: 'A07:2021 - Identification and Authentication Failures'
    },
    simulated: true,
    discoveredAt: '2026-09-29 06:42:30'
  },
  {
    id: 'VULN-003',
    title: 'Insufficient API Authorization Validation on Geopolitical Feeds API',
    category: 'Authorization',
    severity: 'High',
    cvss: 8.1,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N',
    affectedComponent: 'API Feed Ingestion & Subscription Service',
    componentPath: 'src/api/v1/feeds/custom/[feedId].ts',
    status: 'Open',
    description: 'The endpoint for reading and modifying custom intelligence feed parameters does not verify whether the requesting user owns or has permission to view the specified feed resource ID.',
    whyIsThisRisky: 'An authenticated user could alter the query parameters of other analysts\' private alerts or view proprietary watchlists simply by incrementing or guessing the feed identifier.',
    impact: {
      confidentiality: 'High',
      integrity: 'High',
      availability: 'Low',
      businessImpact: 'Unauthorized viewing and tampering of analyst intelligence feeds, watchlists, and alert criteria.'
    },
    evidence: {
      type: 'API',
      requestSnippet: 'GET /api/v1/feeds/custom/feed_analyst_8842 HTTP/1.1\nHost: worldmonitor.app\nAuthorization: Bearer <TEST_ANALYST_TOKEN_USER_B>\nContent-Type: application/json',
      responseSnippet: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "feedId": "feed_analyst_8842",\n  "owner": "user_alpha_lead",\n  "title": "Restricted Maritime Movement Watchlist",\n  "filters": ["chokepoints", "ais_dark_vessels"],\n  "authorized_scope": "private"\n}',
      rawLog: 'IDOR probe returned 200 OK with full resource payload belonging to user_alpha_lead when queried with user_beta credentials.'
    },
    poc: {
      name: 'Simulated BOLA / IDOR Verification Test',
      safeValidationDescription: 'Send two synthetic requests using distinct mock test accounts (User A and User B) to verify tenant isolation boundaries in test environment.',
      syntheticCommand: 'sentinelscan api bola-verify --endpoint /api/v1/feeds/custom/{id} --user-a tokenA --user-b tokenB',
      expectedBehavior: 'HTTP/1.1 403 Forbidden: Requesting user is not authorized to access this resource.',
      observedBehavior: 'HTTP/1.1 200 OK: User B successfully retrieved private feed belonging to User A.',
      steps: [
        'Provision two temporary test identities in mock sandbox.',
        'Create synthetic feed under Account Alpha.',
        'Attempt retrieval of Alpha\'s feed using Beta\'s authentication token.',
        'Evaluate access control enforcement.'
      ],
      logs: [
        '[TEST] Initializing controlled authorization test...',
        '[TEST] Target: Local Test Environment (Mock API)',
        '[TEST] Checking authorization boundary between Tenant A and Tenant B...',
        '[TEST] Sending synthetic request with Tenant B token for Tenant A resource...',
        '[EVAL] Endpoint: GET /api/v1/feeds/custom/mock_feed_9921',
        '[RESPONSE] Status 200 OK received instead of 403 Forbidden',
        '[FAIL] Object-level permission check was bypassed or missing in handler.',
        '[RESULT] Authorization control requires review. BOLA/IDOR pattern identified.'
      ]
    },
    remediation: {
      summary: 'Enforce strict server-side ownership checks before processing or returning feed resource data.',
      priority: 'Urgent',
      effort: 'Medium',
      steps: [
        'Verify that the authenticated user ID matches the feed owner ID in database or role-based ACL.',
        'Reject unauthorized requests with 403 Forbidden or 404 Not Found.',
        'Add automated integration tests asserting multi-tenant authorization boundaries.',
        'Log all unauthorized object access attempts to security event monitoring.'
      ],
      codeSample: {
        language: 'typescript',
        before: '// Insecure handler\nexport async function getFeed(req, res) {\n  const feed = await db.feeds.findById(req.query.feedId);\n  return res.json(feed);\n}',
        after: '// Secure handler with ownership validation\nexport async function getFeed(req, res) {\n  const userId = req.user.id;\n  const feed = await db.feeds.findById(req.query.feedId);\n  if (!feed || (feed.ownerId !== userId && !feed.isPublic)) {\n    return res.status(403).json({ error: "Access denied to requested feed" });\n  }\n  return res.json(feed);\n}'
      },
      cwe: 'CWE-639 (Authorization Bypass Through User-Controlled Key / IDOR)',
      owaspCategory: 'A01:2021 - Broken Access Control'
    },
    simulated: true,
    discoveredAt: '2026-09-29 06:42:55'
  },
  {
    id: 'VULN-004',
    title: 'Missing Input Sanitization on Live Threat Event Query Parser',
    category: 'Input Validation',
    severity: 'Medium',
    cvss: 6.5,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N',
    affectedComponent: 'Search & Filter Query Engine',
    componentPath: 'src/utils/filterParser.ts:89',
    status: 'Open',
    description: 'The search query parser accepts unescaped special characters and unvalidated regex meta-characters without length limits or syntax validation, creating potential for client-side ReDoS or unexpected query behavior.',
    whyIsThisRisky: 'Supplying nested or ambiguous regular expression constructs into the search filter could freeze the analyst\'s UI thread or cause client-side application crashes when processing thousands of live events.',
    impact: {
      confidentiality: 'None',
      integrity: 'Low',
      availability: 'Medium',
      businessImpact: 'Degradation of dashboard responsiveness and situational awareness during critical alert surges.'
    },
    evidence: {
      type: 'Client',
      requestSnippet: 'Query Input: "region:((a+)+)+$ crisis:active"\nParser Output: RegExp object instantiated directly without safety timeout.',
      responseSnippet: 'Client Event Loop Blocked: > 850ms execution delay during event filtering.',
      rawLog: 'Unsafe regex catastrophic backtracking benchmark triggered delay on test client.'
    },
    poc: {
      name: 'Safe ReDoS & Sanitization Test',
      safeValidationDescription: 'Test string filter parsing with bounded complexity payloads in an isolated worker thread to measure parsing latency.',
      syntheticCommand: 'sentinelscan input test-parser --pattern "((.*)+)+" --safe-limit 100ms',
      expectedBehavior: 'Parser should sanitize special regex characters and enforce max token limit.',
      observedBehavior: 'Raw regex string passed directly to RegExp constructor without input validation.',
      steps: [
        'Feed complex filter pattern to query tokenizer.',
        'Inspect compilation and execution flags.',
        'Verify input sanitization rules.',
        'Confirm if escapeRegex utility is utilized.'
      ],
      logs: [
        '[TEST] Initializing query parser validation...',
        '[TEST] Sending synthetic search payload with special characters...',
        '[EVAL] Input length: 48 characters',
        '[WARN] No regex escaping applied prior to filter matching.',
        '[FAIL] High execution time detected on nested wildcard evaluation.',
        '[RESULT] Input validation check failed. Centralized sanitization required.'
      ]
    },
    remediation: {
      summary: 'Sanitize query inputs, escape regex special characters, and set strict length limits on search queries.',
      priority: 'Medium',
      effort: 'Low',
      steps: [
        'Sanitize user search terms using an escape utility before passing to RegExp or search engines.',
        'Enforce a maximum search term length (e.g. 128 characters).',
        'Use pre-compiled, parameterized search filters rather than dynamic evaluation.',
        'Run search filtering within a Web Worker to avoid blocking the main UI thread.'
      ],
      codeSample: {
        language: 'typescript',
        before: 'const regex = new RegExp(userInput, "i");\nreturn events.filter(e => regex.test(e.title));',
        after: 'function escapeRegex(string: string) {\n  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");\n}\nconst safeInput = escapeRegex(userInput.slice(0, 100));\nconst regex = new RegExp(safeInput, "i");\nreturn events.filter(e => regex.test(e.title));'
      },
      cwe: 'CWE-20 (Improper Input Validation)',
      owaspCategory: 'A03:2021 - Injection'
    },
    simulated: true,
    discoveredAt: '2026-09-29 06:43:20'
  },
  {
    id: 'VULN-005',
    title: 'Sensitive Information Exposure in Ingestion Error Traces',
    category: 'Data Protection',
    severity: 'Medium',
    cvss: 5.7,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
    affectedComponent: 'Data Pipeline Feed Connector',
    componentPath: 'src/services/rssIngestion.ts:114',
    status: 'Open',
    description: 'When an upstream RSS or geocoding provider fails, the error handler returns raw internal stack traces, system directory paths, and internal hostnames in client-facing error payloads.',
    whyIsThisRisky: 'Attackers can use internal server paths, framework versions, and network hostnames revealed in stack traces to plan more targeted infrastructure attacks.',
    impact: {
      confidentiality: 'Low',
      integrity: 'None',
      availability: 'None',
      businessImpact: 'Information disclosure aiding reconnaissance and footprinting of internal ingestion architecture.'
    },
    evidence: {
      type: 'HTTP',
      requestSnippet: 'GET /api/v1/ingest/feed?url=invalid%3A%2F%2Fprobe HTTP/1.1\nHost: worldmonitor.app',
      responseSnippet: 'HTTP/1.1 500 Internal Server Error\nContent-Type: application/json\n\n{\n  "error": "FetchError: invalid url",\n  "stack": "FetchError: invalid url\\n    at /app/node_modules/node-fetch/src/index.js:144\\n    at /app/dist/services/rssIngestion.js:114:12\\n    at internal/process/task_queues:95:5",\n  "host": "ip-10-0-4-192.ec2.internal"\n}',
      rawLog: 'Error payload includes raw server stack trace and internal AWS EC2 private hostname.'
    },
    poc: {
      name: 'Safe Error Handling Probe',
      safeValidationDescription: 'Send malformed feed URL parameter to the ingestion endpoint and inspect response body structure for stack traces or internal IP exposure.',
      syntheticCommand: 'sentinelscan probe error-disclosure --endpoint /api/v1/ingest/feed --param url="invalid://test"',
      expectedBehavior: 'HTTP 400 Bad Request with standardized error: { "error": "Invalid URL supplied", "code": "ERR_INVALID_PARAM" }',
      observedBehavior: 'HTTP 500 with full Node.js stack trace and internal EC2 hostname.',
      steps: [
        'Dispatch synthetic malformed query parameter to endpoint.',
        'Capture HTTP response payload.',
        'Scan response content for regex patterns matching stack traces, paths, and internal IPs.',
        'Report sensitive disclosure findings.'
      ],
      logs: [
        '[TEST] Sending safe malformed request to ingestion endpoint...',
        '[TEST] Query: ?url=invalid://probe',
        '[RESPONSE] Status 500 Internal Server Error',
        '[WARN] Detected stack trace in JSON response.',
        '[FAIL] Internal path detected: /app/dist/services/rssIngestion.js',
        '[FAIL] Internal AWS private hostname detected: ip-10-0-4-192.ec2.internal',
        '[RESULT] Sensitive information exposure confirmed in error handling.'
      ]
    },
    remediation: {
      summary: 'Implement a centralized global error handler that returns opaque error codes and logs detailed stack traces internally.',
      priority: 'Medium',
      effort: 'Low',
      steps: [
        'Catch uncaught exceptions in a centralized middleware.',
        'Return generic error messages (e.g. "An error occurred while fetching the feed") with a correlation ID.',
        'Strip stack traces, environment variables, and internal hostnames from all production responses.',
        'Send detailed debug information only to secure centralized log sinks (e.g. Datadog, CloudWatch).'
      ],
      codeSample: {
        language: 'typescript',
        before: '// Insecure error response\napp.use((err, req, res, next) => {\n  res.status(500).json({ error: err.message, stack: err.stack, host: os.hostname() });\n});',
        after: '// Secure error handler\napp.use((err, req, res, next) => {\n  const incidentId = crypto.randomUUID();\n  logger.error({ incidentId, err }); // Log internally\n  res.status(500).json({\n    error: "An internal processing error occurred.",\n    incidentId\n  });\n});'
      },
      cwe: 'CWE-209 (Generation of Error Message Containing Sensitive Information)',
      owaspCategory: 'A04:2021 - Insecure Design'
    },
    simulated: true,
    discoveredAt: '2026-09-29 06:43:40'
  },
  {
    id: 'VULN-006',
    title: 'Insecure Direct Object Reference (IDOR) on Saved Analyst Workspace Layouts',
    category: 'Authorization',
    severity: 'Critical',
    cvss: 9.1,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:N',
    affectedComponent: 'Workspace Customization API',
    componentPath: 'src/api/workspaces/layout/[workspaceId].ts',
    status: 'Open',
    description: 'The endpoint for updating custom map layouts and confidential operational views allows any authenticated user to overwrite or delete other analysts\' workspace definitions by supplying their workspaceId.',
    whyIsThisRisky: 'An unauthorized user could overwrite or corrupt an analyst\'s active tactical monitoring dashboard during an ongoing crisis, leading to operational disruption or data destruction.',
    impact: {
      confidentiality: 'High',
      integrity: 'High',
      availability: 'High',
      businessImpact: 'Tampering or deletion of critical crisis monitoring layouts and operational intel views.'
    },
    evidence: {
      type: 'API',
      requestSnippet: 'PUT /api/workspaces/layout/ws_crisis_009 HTTP/1.1\nHost: worldmonitor.app\nAuthorization: Bearer <GUEST_ANALYST_TOKEN>\nContent-Type: application/json\n\n{"layout": "corrupted_state", "widgets": []}',
      responseSnippet: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "status": "updated",\n  "workspaceId": "ws_crisis_009",\n  "owner": "lead_commander"\n}',
      rawLog: 'PUT request successfully mutated workspace ws_crisis_009 without matching authenticated user credentials.'
    },
    poc: {
      name: 'Simulated Workspace IDOR Mutation Probe',
      safeValidationDescription: 'Test write authorization boundaries using synthetic workspace entities in test environment without altering real user data.',
      syntheticCommand: 'sentinelscan auth test-idor --endpoint /api/workspaces/layout/test_ws_001 --mock-mutation',
      expectedBehavior: 'HTTP 403 Forbidden: Modifying analyst workspace requires ownership.',
      observedBehavior: 'HTTP 200 OK: Mutation accepted for foreign workspace entity.',
      steps: [
        'Create synthetic workspace object in test environment.',
        'Issue PUT request using alternate test token.',
        'Inspect HTTP response status and verification audit.',
        'Confirm absence of ownership validation check.'
      ],
      logs: [
        '[TEST] Initializing safe IDOR mutation check...',
        '[TEST] Setting up synthetic test workspace: ws_test_sandbox_1',
        '[TEST] Submitting synthetic update payload from unauthorized token...',
        '[RESPONSE] Status: 200 OK',
        '[CRITICAL] Mutation was accepted without owner or role validation!',
        '[RESULT] Critical Authorization flaw identified.'
      ]
    },
    remediation: {
      summary: 'Implement robust authorization middleware validating tenant and user identity against resource owner records.',
      priority: 'Urgent',
      effort: 'Medium',
      steps: [
        'Verify session principal matches workspace record author before allowing write/delete.',
        'Use UUIDv4 or randomized unguessable IDs rather than sequential or predictable keys.',
        'Adopt Policy-as-Code (e.g. Casbin or Open Policy Agent) for centralized permission evaluation.'
      ],
      codeSample: {
        language: 'typescript',
        before: 'export async function updateLayout(req, res) {\n  await db.update(req.params.workspaceId, req.body);\n  return res.json({ status: "updated" });\n}',
        after: 'export async function updateLayout(req, res) {\n  const ws = await db.find(req.params.workspaceId);\n  if (!ws || ws.ownerId !== req.user.id) {\n    return res.status(403).json({ error: "Access Denied: You do not own this workspace" });\n  }\n  await db.update(req.params.workspaceId, req.body);\n  return res.json({ status: "updated" });\n}'
      },
      cwe: 'CWE-285 (Improper Authorization)',
      owaspCategory: 'A01:2021 - Broken Access Control'
    },
    simulated: true,
    discoveredAt: '2026-09-29 06:44:00'
  },
  {
    id: 'VULN-007',
    title: 'Permissive Cross-Origin Resource Sharing (CORS) Policy on Metrics Ingestion',
    category: 'API Security',
    severity: 'Medium',
    cvss: 6.1,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N',
    affectedComponent: 'Telemetry & Telemetrics Collector',
    componentPath: 'src/api/telemetry.ts:18',
    status: 'In Review',
    description: 'The telemetry API returns `Access-Control-Allow-Origin: *` while simultaneously accepting ambient credentials on certain reporting endpoints, enabling third-party websites to trigger cross-domain telemetry queries.',
    whyIsThisRisky: 'Malicious sites visited by an analyst could query or pollute internal metrics feeds by issuing cross-origin XMLHttpRequests.',
    impact: {
      confidentiality: 'Low',
      integrity: 'Medium',
      availability: 'None',
      businessImpact: 'Telemetry spoofing and inadvertent information exposure across untrusted web domains.'
    },
    evidence: {
      type: 'HTTP',
      requestSnippet: 'OPTIONS /api/telemetry/events HTTP/1.1\nHost: worldmonitor.app\nOrigin: https://untrusted-external-domain.com',
      responseSnippet: 'HTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: *\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\nAccess-Control-Allow-Headers: Authorization, Content-Type',
      rawLog: 'Wildcard CORS allowed on API endpoint handling sensitive telemetry data.'
    },
    poc: {
      name: 'Safe Pre-flight CORS Audit',
      safeValidationDescription: 'Send synthetic OPTIONS pre-flight request with arbitrary Origin header to inspect CORS headers.',
      syntheticCommand: 'sentinelscan cors probe --url https://demo.worldmonitor.local/api/telemetry/events',
      expectedBehavior: 'Access-Control-Allow-Origin restricted to *.worldmonitor.app or explicit whitelist.',
      observedBehavior: 'Access-Control-Allow-Origin: * returned for untrusted test origin.',
      steps: [
        'Send HTTP OPTIONS pre-flight request with synthetic test origin.',
        'Read Access-Control-Allow-Origin header.',
        'Assert origin against domain whitelist.'
      ],
      logs: [
        '[TEST] Testing CORS preflight headers...',
        '[TEST] Setting Origin: https://untrusted-external-domain.com',
        '[RESPONSE] Access-Control-Allow-Origin: *',
        '[WARN] Wildcard origin accepted.',
        '[RESULT] CORS policy requires domain restriction.'
      ]
    },
    remediation: {
      summary: 'Replace wildcard CORS header with strict origin whitelist validation.',
      priority: 'Medium',
      effort: 'Low',
      steps: [
        'Configure CORS middleware to accept only trusted production and staging domains.',
        'Never return Access-Control-Allow-Origin: * on endpoints that process session tokens or state changes.',
        'Validate the Origin request header against an explicit list.'
      ],
      codeSample: {
        language: 'typescript',
        before: 'app.use(cors({ origin: "*" }));',
        after: 'const whitelist = ["https://www.worldmonitor.app", "https://staging.worldmonitor.app"];\napp.use(cors({\n  origin: (origin, callback) => {\n    if (!origin || whitelist.includes(origin)) {\n      callback(null, true);\n    } else {\n      callback(new Error("CORS policy violation"));\n    }\n  },\n  credentials: true\n}));'
      },
      cwe: 'CWE-346 (Origin Validation Error)',
      owaspCategory: 'A05:2021 - Security Misconfiguration'
    },
    simulated: true,
    discoveredAt: '2026-09-29 06:44:20'
  },
  {
    id: 'VULN-008',
    title: 'Outdated Client-Side Dependency with Known Vulnerability (Fast-XML-Parser)',
    category: 'Client-Side Security',
    severity: 'Low',
    cvss: 4.3,
    cvssVector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:L/A:N',
    affectedComponent: 'RSS Feed Parser Library (package.json)',
    componentPath: 'package.json: "fast-xml-parser": "4.2.4"',
    status: 'Remediated',
    description: 'The front-end client imports an older release of fast-xml-parser that has known prototype pollution vulnerabilities when parsing maliciously crafted RSS feeds.',
    whyIsThisRisky: 'In extreme edge cases, an attacker-controlled external RSS source could trigger prototype pollution in older browser JS engines.',
    impact: {
      confidentiality: 'None',
      integrity: 'Low',
      availability: 'Low',
      businessImpact: 'Minor risk of client-side application unexpected behavior during feed rendering.'
    },
    evidence: {
      type: 'Config',
      requestSnippet: 'SCA Dependency Tree Analysis:\nworldmonitor-frontend@1.0.0\n└── fast-xml-parser@4.2.4 (Vulnerable: CVE-2023-45811)',
      responseSnippet: 'Fixed in fast-xml-parser@4.3.2 and above.',
      rawLog: 'Automated dependency scanner identified 1 out-of-date package matching CVE database.'
    },
    poc: {
      name: 'Safe SCA Dependency Manifest Audit',
      safeValidationDescription: 'Perform static comparison of package.json and lockfile dependencies against national vulnerability database without executing code.',
      syntheticCommand: 'sentinelscan sca audit --manifest package.json --safe',
      expectedBehavior: 'Zero high or medium CVE vulnerabilities in direct dependencies.',
      observedBehavior: 'Identified CVE-2023-45811 in fast-xml-parser@4.2.4.',
      steps: [
        'Parse package.json dependency tree.',
        'Query mock vulnerability advisory database.',
        'Cross-reference semver ranges.',
        'Produce remediation patch version.'
      ],
      logs: [
        '[TEST] Scanning package.json dependencies...',
        '[TEST] Checking 48 installed packages against CVE database...',
        '[WARN] fast-xml-parser@4.2.4 flagged (CVE-2023-45811)',
        '[INFO] Patch available: v4.3.5',
        '[RESULT] Audit complete. 1 advisory identified.'
      ]
    },
    remediation: {
      summary: 'Upgrade fast-xml-parser to version 4.3.5 or latest stable.',
      priority: 'Low',
      effort: 'Low',
      steps: [
        'Run `npm update fast-xml-parser`.',
        'Verify RSS parsing functionality in unit tests.',
        'Commit updated package-lock.json.'
      ],
      codeSample: {
        language: 'bash',
        before: 'npm install fast-xml-parser@4.2.4',
        after: 'npm install fast-xml-parser@^4.3.5'
      },
      cwe: 'CWE-1395 (Dependency on Vulnerable Third-Party Component)',
      owaspCategory: 'A06:2021 - Vulnerable and Outdated Components'
    },
    simulated: true,
    discoveredAt: '2026-09-29 06:44:45'
  }
];

export const mockSecurityChecks: SecurityCheck[] = [
  { id: 'CHK-001', name: 'DNS & SSL/TLS Cipher Suites', category: 'Secure Communication', description: 'Validate TLS 1.3 enforcement and modern cipher suite configuration', status: 'passed', executionTimeMs: 140 },
  { id: 'CHK-002', name: 'HTTP Strict Transport Security (HSTS)', category: 'Client-Side Security', description: 'Verify max-age and preload directives for HTTPS enforcement', status: 'warning', executionTimeMs: 95, findingId: 'VULN-001' },
  { id: 'CHK-003', name: 'Content Security Policy (CSP)', category: 'Client-Side Security', description: 'Check for script-src nonce or hash restrictions', status: 'failed', executionTimeMs: 110, findingId: 'VULN-001' },
  { id: 'CHK-004', name: 'X-Frame-Options Clickjacking Defense', category: 'Client-Side Security', description: 'Ensure frame embedding protection is active', status: 'passed', executionTimeMs: 65 },
  { id: 'CHK-005', name: 'Session Cookie HttpOnly & Secure Flags', category: 'Authentication & Sessions', description: 'Inspect token storage cookie flags', status: 'failed', executionTimeMs: 180, findingId: 'VULN-002' },
  { id: 'CHK-006', name: 'JWT Signature Algorithm Enforcement', category: 'Authentication & Sessions', description: 'Prevent None algorithm or weak symmetric keys in JWTs', status: 'passed', executionTimeMs: 130 },
  { id: 'CHK-007', name: 'Session Inactivity Expiry', category: 'Authentication & Sessions', description: 'Verify automatic session invalidation upon timeout', status: 'passed', executionTimeMs: 155 },
  { id: 'CHK-008', name: 'BOLA / IDOR on Custom Feeds API', category: 'Authorization', description: 'Test object-level authorization across synthetic tenant tokens', status: 'failed', executionTimeMs: 240, findingId: 'VULN-003' },
  { id: 'CHK-009', name: 'Workspace Layout Mutation Authorization', category: 'Authorization', description: 'Check RBAC on dashboard view update endpoints', status: 'failed', executionTimeMs: 215, findingId: 'VULN-006' },
  { id: 'CHK-010', name: 'Admin Dashboard Route Privilege Check', category: 'Authorization', description: 'Ensure regular users cannot access administrative views', status: 'passed', executionTimeMs: 190 },
  { id: 'CHK-011', name: 'Query String Regex ReDoS Validation', category: 'Input Validation', description: 'Test search filters against complex wildcard expressions', status: 'failed', executionTimeMs: 310, findingId: 'VULN-004' },
  { id: 'CHK-012', name: 'SQL/NoSQL Injection Probing', category: 'Input Validation', description: 'Verify parameterized query bindings in data access layer', status: 'passed', executionTimeMs: 280 },
  { id: 'CHK-013', name: 'Cross-Site Scripting (XSS) in Map Tooltips', category: 'Input Validation', description: 'Verify HTML escaping in dynamic map rendering pins', status: 'passed', executionTimeMs: 175 },
  { id: 'CHK-014', name: 'CORS Preflight Policy Validation', category: 'API Security', description: 'Assert origin restriction on state-changing endpoints', status: 'warning', executionTimeMs: 125, findingId: 'VULN-007' },
  { id: 'CHK-015', name: 'API Rate Limiting & Throttling', category: 'API Security', description: 'Test 429 Too Many Requests response under high burst requests', status: 'passed', executionTimeMs: 290 },
  { id: 'CHK-016', name: 'GraphQL Query Depth & Complexity Limit', category: 'API Security', description: 'Prevent nested query denial-of-service', status: 'passed', executionTimeMs: 140 },
  { id: 'CHK-017', name: 'Error Trace Information Exposure', category: 'Data Protection', description: 'Verify stack traces and internal IPs are hidden in 5xx errors', status: 'failed', executionTimeMs: 160, findingId: 'VULN-005' },
  { id: 'CHK-018', name: 'Sensitive API Keys in Client Bundle', category: 'Data Protection', description: 'Scan JS production bundles for hardcoded private secrets', status: 'passed', executionTimeMs: 340 },
  { id: 'CHK-019', name: 'Third-Party Dependency SCA Audit', category: 'Client-Side Security', description: 'Match package.json libraries against known CVEs', status: 'warning', executionTimeMs: 410, findingId: 'VULN-008' },
  { id: 'CHK-020', name: 'Subresource Integrity (SRI) on CDNs', category: 'Client-Side Security', description: 'Verify SRI hashes on external script tags', status: 'passed', executionTimeMs: 90 },
  { id: 'CHK-021', name: 'WebSockets Auth & Origin Handshake', category: 'Secure Communication', description: 'Verify WebSocket connections validate authentication tokens', status: 'passed', executionTimeMs: 195 },
  { id: 'CHK-022', name: 'Cache-Control on Sensitive Data Routes', category: 'Data Protection', description: 'Ensure private intelligence feeds use no-store headers', status: 'passed', executionTimeMs: 85 },
  { id: 'CHK-023', name: 'Open Redirect Validation in Auth Flow', category: 'Authentication & Sessions', description: 'Test returnUrl parameter whitelist enforcement', status: 'passed', executionTimeMs: 115 },
  { id: 'CHK-024', name: 'Robots.txt & Security.txt Compliance', category: 'Client-Side Security', description: 'Verify .well-known/security.txt vulnerability disclosure policy', status: 'passed', executionTimeMs: 70 }
];

export const mockAttackSurfaceNodes: AttackSurfaceNode[] = [
  {
    id: 'root',
    label: 'World Monitor Target',
    type: 'target',
    status: 'warning',
    checksCount: 24,
    passedCount: 16,
    findingsCount: 8,
    details: 'Production web application & intelligence aggregation architecture (worldmonitor.app)',
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Leaflet', 'Cloudflare']
  },
  {
    id: 'web-client',
    parentId: 'root',
    label: 'Web Client Frontend',
    type: 'layer',
    status: 'warning',
    checksCount: 8,
    passedCount: 5,
    findingsCount: 3,
    details: 'Single Page Application UI, dynamic mapping interface, client-side RSS query engine',
    technologies: ['React 18', 'TailwindCSS', 'Web Workers', 'LocalStorage']
  },
  {
    id: 'client-headers',
    parentId: 'web-client',
    label: 'Security Headers & CSP',
    type: 'component',
    status: 'warning',
    checksCount: 4,
    passedCount: 2,
    findingsCount: 1,
    details: 'Edge CDN response header enforcement, HSTS, frame-ancestors, CSP directives',
    technologies: ['Cloudflare Edge Rules']
  },
  {
    id: 'client-deps',
    parentId: 'web-client',
    label: 'Client Dependencies (SCA)',
    type: 'component',
    status: 'healthy',
    checksCount: 2,
    passedCount: 1,
    findingsCount: 1,
    details: 'Third-party client libraries for feed parsing, mapping, UI components',
    technologies: ['npm packages', 'fast-xml-parser']
  },
  {
    id: 'api-layer',
    parentId: 'root',
    label: 'Backend & Ingestion APIs',
    type: 'layer',
    status: 'critical',
    checksCount: 9,
    passedCount: 6,
    findingsCount: 3,
    details: 'REST & GraphQL endpoints for live geopolitical event ingestion, filtering, and subscriptions',
    technologies: ['Node.js', 'Next.js API Routes', 'REST', 'SSE / WebSockets']
  },
  {
    id: 'api-auth',
    parentId: 'api-layer',
    label: 'API Authorization Layer',
    type: 'component',
    status: 'critical',
    checksCount: 4,
    passedCount: 2,
    findingsCount: 2,
    details: 'Object-level permission checking, tenant segregation, workspace mutations',
    technologies: ['JWT Middleware', 'Role Checks']
  },
  {
    id: 'api-telemetry',
    parentId: 'api-layer',
    label: 'Telemetry & Metrics Ingress',
    type: 'endpoint',
    status: 'warning',
    checksCount: 3,
    passedCount: 2,
    findingsCount: 1,
    details: 'Telemetry collector receiving client usage signals and event load metrics',
    technologies: ['CORS Middleware', 'Express / Next.js']
  },
  {
    id: 'auth-layer',
    parentId: 'root',
    label: 'Authentication & Session Service',
    type: 'layer',
    status: 'critical',
    checksCount: 7,
    passedCount: 5,
    findingsCount: 2,
    details: 'User identity management, JWT verification, session cookie issuance',
    technologies: ['HTTP Cookies', 'JWT', 'OAuth2 / Social Auth']
  },
  {
    id: 'auth-cookies',
    parentId: 'auth-layer',
    label: 'Session Cookie Storage',
    type: 'component',
    status: 'critical',
    checksCount: 3,
    passedCount: 2,
    findingsCount: 1,
    details: 'wm_session_id cookie generation, flags (HttpOnly, Secure, SameSite)',
    technologies: ['Set-Cookie Directives']
  }
];
