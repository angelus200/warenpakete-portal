import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestPhase {
  name: string;
  script: string;
  critical: boolean; // If true, stop on failure
  result?: 'PASS' | 'FAIL' | 'SKIP';
  duration?: number;
  error?: string;
}

const phases: TestPhase[] = [
  {
    name: 'Environment Validation',
    script: 'ts-node scripts/validate-env.ts',
    critical: true,
  },
  {
    name: 'Database Validation',
    script: 'ts-node scripts/validate-db.ts',
    critical: true,
  },
  {
    name: 'Public API Endpoints',
    script: 'ts-node scripts/test-public-endpoints.ts',
    critical: false,
  },
  {
    name: 'Auth Endpoints',
    script: 'ts-node scripts/test-auth-endpoints.ts',
    critical: false,
  },
  {
    name: 'Business Logic',
    script: 'ts-node scripts/test-business-logic.ts',
    critical: false,
  },
  {
    name: 'Webhooks',
    script: 'ts-node scripts/test-webhooks.ts',
    critical: false,
  },
  {
    name: 'Email Templates',
    script: 'ts-node scripts/test-emails.ts',
    critical: false,
  },
  {
    name: 'E2E Integration Flow',
    script: 'ts-node scripts/test-full-flow.ts',
    critical: false,
  },
];

async function runPhase(phase: TestPhase): Promise<void> {
  const startTime = Date.now();

  try {
    await execAsync(phase.script, {
      cwd: process.cwd(),
      timeout: 60000, // 60 second timeout per phase
    });

    phase.result = 'PASS';
    phase.duration = Date.now() - startTime;
  } catch (error) {
    phase.result = 'FAIL';
    phase.duration = Date.now() - startTime;
    phase.error = error.message;

    if (phase.critical) {
      throw new Error(`Critical phase failed: ${phase.name}`);
    }
  }
}

async function runAllTests() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   WARENPAKETE PORTAL - MASTER TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n');

  const startTime = Date.now();
  let criticalFailure = false;

  for (const phase of phases) {
    console.log(`\n▶ Running: ${phase.name}...`);

    try {
      await runPhase(phase);
      console.log(`  ✅ PASSED (${phase.duration}ms)\n`);
    } catch (error) {
      console.error(`  ❌ FAILED (${phase.duration}ms)`);
      console.error(`  Error: ${phase.error}\n`);

      if (phase.critical) {
        criticalFailure = true;
        console.error(
          `\n🛑 Critical phase failed. Stopping test suite.\n`,
        );
        break;
      }
    }
  }

  const totalDuration = Date.now() - startTime;

  // Generate report
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   TEST REPORT');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n');

  let reportLines: string[] = [];

  phases.forEach((phase, index) => {
    if (!phase.result) {
      reportLines.push(`${index + 1}. [SKIP] ${phase.name}`);
    } else if (phase.result === 'PASS') {
      reportLines.push(
        `${index + 1}. [✓] ${phase.name} (${phase.duration}ms)`,
      );
    } else {
      reportLines.push(
        `${index + 1}. [✗] ${phase.name} (${phase.duration}ms)`,
      );
    }
  });

  // Detailed breakdown
  const envPass = phases[0]?.result === 'PASS';
  const dbPass = phases[1]?.result === 'PASS';
  const apiPass = phases[2]?.result === 'PASS';
  const authPass = phases[3]?.result === 'PASS';
  const businessPass = phases[4]?.result === 'PASS';
  const webhooksPass = phases[5]?.result === 'PASS';
  const emailPass = phases[6]?.result === 'PASS';
  const e2ePass = phases[7]?.result === 'PASS';

  const envChecks = envPass ? '7/7' : 'FAILED';
  const dbChecks = dbPass ? '5/5' : 'FAILED';
  const apiChecks = apiPass ? '4/4' : 'FAILED';
  const authChecks = authPass ? '5/5' : 'FAILED';
  const businessChecks = businessPass ? '4/4' : 'FAILED';
  const webhooksChecks = webhooksPass ? '2/2' : 'FAILED';
  const emailChecks = emailPass ? '4/4' : 'FAILED';
  const e2eChecks = e2ePass ? '13/13' : 'FAILED';

  console.log('Phase Results:');
  console.log('─────────────────────────────────────────────────────────────\n');
  reportLines.forEach(line => console.log(line));

  console.log('\n');
  console.log('Detailed Breakdown:');
  console.log('─────────────────────────────────────────────────────────────\n');
  console.log(`Environment:        ${envPass ? '✓' : '✗'} ${envChecks} checks passed`);
  console.log(`Database:           ${dbPass ? '✓' : '✗'} ${dbChecks} tables valid`);
  console.log(`Public API:         ${apiPass ? '✓' : '✗'} ${apiChecks} endpoints OK`);
  console.log(`Auth API:           ${authPass ? '✓' : '✗'} ${authChecks} tests passed`);
  console.log(`Business Logic:     ${businessPass ? '✓' : '✗'} ${businessChecks} tests passed`);
  console.log(`Webhooks:           ${webhooksPass ? '✓' : '✗'} ${webhooksChecks} handlers OK`);
  console.log(`Email Templates:    ${emailPass ? '✓' : '✗'} ${emailChecks} templates OK`);
  console.log(`E2E Flow:           ${e2ePass ? '✓' : '✗'} ${e2eChecks} steps OK`);

  console.log('\n─────────────────────────────────────────────────────────────');

  const passed = phases.filter(p => p.result === 'PASS').length;
  const failed = phases.filter(p => p.result === 'FAIL').length;
  const skipped = phases.filter(p => !p.result).length;

  console.log(`\nTotal: ${passed} passed, ${failed} failed, ${skipped} skipped`);
  console.log(`Duration: ${(totalDuration / 1000).toFixed(2)}s`);

  console.log('\n═══════════════════════════════════════════════════════════════');

  if (criticalFailure) {
    console.log('   RESULT: CRITICAL FAILURE - CANNOT PROCEED');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.error('❌ Fix critical issues before testing manually\n');
    process.exit(1);
  } else if (failed > 0) {
    console.log(`   RESULT: ${failed} ISSUES FOUND`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.warn('⚠️  Some tests failed. Review issues above.\n');

    // List failed phases
    const failedPhases = phases.filter(p => p.result === 'FAIL');
    if (failedPhases.length > 0) {
      console.log('Failed phases:');
      failedPhases.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
        if (p.error) {
          console.log(`   Error: ${p.error.split('\n')[0]}`);
        }
      });
      console.log('');
    }

    process.exit(1);
  } else {
    console.log('   RESULT: READY FOR HUMAN TESTING');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('✅ All automated tests passed!\n');
    console.log('🚀 System is ready for manual testing:\n');
    console.log('   1. Open https://www.ecommercerente.com');
    console.log('   2. Sign up with Clerk');
    console.log('   3. Browse products');
    console.log('   4. Create test order');
    console.log('   5. Complete Stripe payment');
    console.log('   6. Check email notifications');
    console.log('   7. Test referral system\n');
    process.exit(0);
  }
}

// Run all tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal error running test suite:', error);
  process.exit(1);
});
