import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

dotenv.config();

interface ValidationResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
}

const results: ValidationResult[] = [];

function checkEnvVar(name: string, pattern?: RegExp): boolean {
  const value = process.env[name];

  if (!value) {
    results.push({
      name,
      status: 'FAIL',
      message: `❌ ${name} is not set`,
    });
    return false;
  }

  if (pattern && !pattern.test(value)) {
    results.push({
      name,
      status: 'FAIL',
      message: `❌ ${name} has invalid format`,
    });
    return false;
  }

  results.push({
    name,
    status: 'PASS',
    message: `✓ ${name} is set and valid`,
  });
  return true;
}

async function testDatabaseConnection(): Promise<boolean> {
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.$disconnect();

    results.push({
      name: 'DATABASE_URL',
      status: 'PASS',
      message: '✓ Database connection successful',
    });
    return true;
  } catch (error) {
    results.push({
      name: 'DATABASE_URL',
      status: 'FAIL',
      message: `❌ Database connection failed: ${error.message}`,
    });
    return false;
  }
}

async function testRedisConnection(): Promise<boolean> {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    results.push({
      name: 'REDIS_URL',
      status: 'WARN',
      message: '⚠ REDIS_URL not set (optional)',
    });
    return true; // Redis is optional
  }

  try {
    const client = createClient({ url: redisUrl });
    await client.connect();
    await client.ping();
    await client.disconnect();

    results.push({
      name: 'REDIS_URL',
      status: 'PASS',
      message: '✓ Redis connection successful',
    });
    return true;
  } catch (error) {
    results.push({
      name: 'REDIS_URL',
      status: 'WARN',
      message: `⚠ Redis connection failed: ${error.message}`,
    });
    return true; // Redis is optional, don't fail
  }
}

async function validateEnvironment() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('PHASE 1: ENVIRONMENT VALIDATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Check all required environment variables
  checkEnvVar('DATABASE_URL');
  checkEnvVar('CLERK_SECRET_KEY', /^sk_(live|test)_/);
  checkEnvVar('STRIPE_SECRET_KEY', /^sk_(live|test)_/);
  checkEnvVar('STRIPE_WEBHOOK_SECRET', /^whsec_/);
  checkEnvVar('RESEND_API_KEY', /^re_/);
  checkEnvVar('FRONTEND_URL', /^https?:\/\/.+/);
  checkEnvVar('PORT');

  // Test actual connections
  await testDatabaseConnection();
  await testRedisConnection();

  // Print results
  console.log('Environment Variable Checks:');
  console.log('─────────────────────────────────────────────────────────────\n');

  results.forEach(result => {
    console.log(result.message);
  });

  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warnings = results.filter(r => r.status === 'WARN').length;

  console.log('\n─────────────────────────────────────────────────────────────');
  console.log(`Results: ${passed} passed, ${failed} failed, ${warnings} warnings`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    console.error('❌ Environment validation FAILED\n');
    process.exit(1);
  } else {
    console.log('✅ Environment validation PASSED\n');
    process.exit(0);
  }
}

validateEnvironment().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
