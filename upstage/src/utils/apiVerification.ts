// src/utils/apiVerification.ts
// Development utility to verify API endpoints are working

import { api } from '../api/service';

interface VerificationResult {
  endpoint: string;
  status: 'success' | 'error' | 'not_tested';
  message: string;
  responseTime?: number;
}

interface LoginResponse {
  token: string;
  user?: any;
}

class ApiVerification {
  private results: VerificationResult[] = [];

  private async testEndpoint(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET',
    testData?: any
  ): Promise<VerificationResult> {
    const startTime = Date.now();
    
    try {
      let response: any;
      switch (method) {
        case 'GET':
          response = await api.get<any>(endpoint);
          break;
        case 'POST':
          response = await api.post<any>(endpoint, testData);
          break;
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint: `${method} ${endpoint}`,
        status: 'success',
        message: `✅ Success (${responseTime}ms)`,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        endpoint: `${method} ${endpoint}`,
        status: 'error',
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        responseTime
      };
    }
  }

  async runBasicHealthChecks(): Promise<VerificationResult[]> {
    console.log('🔍 Running API verification checks...\n');
    
    const checks = [
      // Health endpoints (public)
      () => this.testEndpoint('/health'),
      () => this.testEndpoint('/health/simple'),
      
      // Public exercise endpoints
      () => this.testEndpoint('/exercises/accessible'),
      () => this.testEndpoint('/exercises/popular'),
      () => this.testEndpoint('/exercises/lesson-planning'),
      
      // Auth endpoint (should return proper error without credentials)
      () => this.testEndpoint('/coaches/profile'),
    ];

    const results = [];
    for (const check of checks) {
      try {
        const result = await check();
        results.push(result);
        console.log(`${result.message} - ${result.endpoint}`);
      } catch (error) {
        console.error('Verification check failed:', error);
      }
    }

    return results;
  }

  async runAuthenticatedChecks(token: string): Promise<VerificationResult[]> {
    console.log('\n🔐 Running authenticated API checks...\n');
    
    // Set token for authenticated requests
    api.setAuthToken(token);
    
    const checks = [
      // Profile and user data
      () => this.testEndpoint('/coaches/profile'),
      
      // Core resources
      () => this.testEndpoint('/teams'),
      () => this.testEndpoint('/performers'),
      
      // Lessons
      () => this.testEndpoint('/lessons/upcoming'),
      () => this.testEndpoint('/lessons/recent'),
      () => this.testEndpoint('/lessons/templates'),
      
      // Exercises
      () => this.testEndpoint('/exercises/custom'),
      () => this.testEndpoint('/exercises'),
      
      // Evaluations
      () => this.testEndpoint('/evaluations'),
    ];

    const results = [];
    for (const check of checks) {
      try {
        const result = await check();
        results.push(result);
        console.log(`${result.message} - ${result.endpoint}`);
      } catch (error) {
        console.error('Authenticated check failed:', error);
      }
    }

    return results;
  }

  async testLogin(email: string, password: string): Promise<string | null> {
    console.log('\n🔑 Testing login...\n');
    
    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      console.log('✅ Login successful');
      console.log('Token received:', response.token.substring(0, 20) + '...');
      return response.token;
    } catch (error) {
      console.log('❌ Login failed:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  async testCreateOperations(token: string): Promise<VerificationResult[]> {
    console.log('\n🛠️ Testing create operations...\n');
    
    api.setAuthToken(token);
    
    const checks = [
      // Test team creation (will rollback in real scenario)
      () => this.testEndpoint('/teams', 'POST', {
        name: 'Test Team - API Verification',
        description: 'Temporary team for API testing'
      }),
      
      // Test performer creation
      () => this.testEndpoint('/performers', 'POST', {
        firstName: 'Test',
        lastName: 'Performer',
        email: 'test@example.com',
        experienceLevel: 'Beginner'
      }),
      
      // Test exercise creation
      () => this.testEndpoint('/exercises', 'POST', {
        name: 'Test Exercise - API Verification',
        description: 'Temporary exercise for API testing',
        minimumDurationMinutes: 5,
        focusAreaIds: [1, 2],
        public: false
      }),
    ];

    const results = [];
    for (const check of checks) {
      try {
        const result = await check();
        results.push(result);
        console.log(`${result.message} - ${result.endpoint}`);
      } catch (error) {
        console.error('Create operation check failed:', error);
      }
    }

    return results;
  }

  async runFullVerification(email = 'johndoe@gmail.com', password = 'password123'): Promise<void> {
    console.clear();
    console.log('🚀 Starting Full API Verification\n');
    console.log('='.repeat(50));

    // Step 1: Basic health checks
    const basicResults = await this.runBasicHealthChecks();
    
    // Step 2: Test login
    const token = await this.testLogin(email, password);
    
    if (token) {
      // Step 3: Authenticated checks
      const authResults = await this.runAuthenticatedChecks(token);
      
      // Step 4: Create operations (optional)
      const createResults = await this.testCreateOperations(token);
      
      // Summary
      const allResults = [...basicResults, ...authResults, ...createResults];
      this.printSummary(allResults);
    } else {
      console.log('\n⚠️ Skipping authenticated tests due to login failure');
      this.printSummary(basicResults);
    }
    
    console.log('\n='.repeat(50));
    console.log('✨ API Verification Complete');
  }

  printSummary(results: VerificationResult[]): void {
    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'error').length;
    const avgResponseTime = results
      .filter(r => r.responseTime)
      .reduce((sum, r) => sum + r.responseTime!, 0) / results.filter(r => r.responseTime).length;
    
    console.log('\n📊 Verification Summary:');
    console.log('='.repeat(30));
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((successful / results.length) * 100)}%`);
    console.log(`⚡ Avg Response Time: ${Math.round(avgResponseTime)}ms`);
    
    if (failed > 0) {
      console.log('\n❌ Failed endpoints:');
      results
        .filter(r => r.status === 'error')
        .forEach(r => console.log(`  - ${r.endpoint}: ${r.message}`));
    }

    // Performance warnings
    const slowEndpoints = results.filter(r => r.responseTime && r.responseTime > 1000);
    if (slowEndpoints.length > 0) {
      console.log('\n⚠️ Slow endpoints (>1s):');
      slowEndpoints.forEach(r => 
        console.log(`  - ${r.endpoint}: ${r.responseTime}ms`)
      );
    }
  }
}

// Export singleton instance
export const apiVerification = new ApiVerification();

// Usage in browser console:
// 
// Basic health check:
// apiVerification.runBasicHealthChecks();
// 
// Full verification with default test user:
// apiVerification.runFullVerification();
// 
// Full verification with custom credentials:
// apiVerification.runFullVerification('your-email@example.com', 'your-password');

export default apiVerification;