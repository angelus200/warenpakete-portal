import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3001';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL';
  message: string;
  details?: any;
}

const results: TestResult[] = [];

async function testEndpoint(
  method: string,
  endpoint: string,
  expectedStatus: number,
  validator?: (data: any) => { valid: boolean; message: string },
) {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await axios({
      method,
      url,
      validateStatus: () => true, // Don't throw on any status
    });

    if (response.status !== expectedStatus) {
      results.push({
        endpoint,
        method,
        status: 'FAIL',
        message: `❌ Expected status ${expectedStatus}, got ${response.status}`,
        details: { response: response.data },
      });
      return false;
    }

    if (validator) {
      const validation = validator(response.data);
      if (!validation.valid) {
        results.push({
          endpoint,
          method,
          status: 'FAIL',
          message: `❌ ${validation.message}`,
          details: { response: response.data },
        });
        return false;
      }
    }

    results.push({
      endpoint,
      method,
      status: 'PASS',
      message: `✓ ${method} ${endpoint} → ${expectedStatus}`,
    });
    return true;
  } catch (error) {
    results.push({
      endpoint,
      method,
      status: 'FAIL',
      message: `❌ Request failed: ${error.message}`,
    });
    return false;
  }
}

async function testPublicEndpoints() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('PHASE 3: PUBLIC API ENDPOINT TESTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log(`Testing API at: ${API_URL}\n`);

  // Test root endpoint
  await testEndpoint('GET', '/', 200, (data) => {
    if (data.status === 'ok') {
      return { valid: true, message: '' };
    }
    return { valid: false, message: 'Response missing status field' };
  });

  // Test GET /products
  let products: any[] = [];
  await testEndpoint('GET', '/products', 200, (data) => {
    // Handle both direct array and wrapped response
    const responseData = Array.isArray(data) ? data : data.data;

    if (!Array.isArray(responseData)) {
      return { valid: false, message: 'Response is not an array' };
    }

    products = responseData;

    if (responseData.length === 0) {
      return { valid: false, message: 'No products returned (expected at least 5)' };
    }

    // Check first product has required fields
    const product = responseData[0];
    const requiredFields = ['id', 'name', 'price', 'retailValue', 'status', 'palletCount'];
    const missingFields = requiredFields.filter(field => !(field in product));

    if (missingFields.length > 0) {
      return {
        valid: false,
        message: `Products missing fields: ${missingFields.join(', ')}`,
      };
    }

    // Check all prices are > 0
    const invalidPrices = responseData.filter(p => Number(p.price) <= 0);
    if (invalidPrices.length > 0) {
      return {
        valid: false,
        message: `${invalidPrices.length} products have invalid prices (<=0)`,
      };
    }

    // Check all have AVAILABLE status (for test products)
    const notAvailable = responseData.filter(p => p.status !== 'AVAILABLE');
    if (notAvailable.length > 0) {
      return {
        valid: true, // WARN, not FAIL
        message: `${notAvailable.length} products are not AVAILABLE`,
      };
    }

    return { valid: true, message: `${responseData.length} products with valid structure` };
  });

  // Test GET /products/:id for each product
  for (const product of products.slice(0, 3)) {
    // Test first 3 products
    await testEndpoint('GET', `/products/${product.id}`, 200, (data) => {
      if (!data || !data.id) {
        return { valid: false, message: 'Product not found or invalid' };
      }
      return { valid: true, message: 'Product details valid' };
    });
  }

  // Test GET /api/docs (Swagger)
  await testEndpoint('GET', '/api/docs', 200);

  // Test invalid endpoint (should 404)
  await testEndpoint('GET', '/invalid-endpoint-xyz', 404);

  // Print results
  console.log('Endpoint Test Results:');
  console.log('─────────────────────────────────────────────────────────────\n');

  results.forEach(result => {
    console.log(result.message);
    if (result.details) {
      console.log('  Details:', JSON.stringify(result.details, null, 2).slice(0, 200));
    }
  });

  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log('\n─────────────────────────────────────────────────────────────');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    console.error('❌ Public endpoint tests FAILED\n');
    process.exit(1);
  } else {
    console.log('✅ Public endpoint tests PASSED\n');
    process.exit(0);
  }
}

// Wait for API to be ready
async function waitForAPI(maxAttempts = 30) {
  console.log('Waiting for API to be ready...');
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(`${API_URL}/`);
      console.log('API is ready!\n');
      return true;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  console.error('API did not become ready in time');
  return false;
}

waitForAPI()
  .then(ready => {
    if (ready) {
      return testPublicEndpoints();
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
