import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

function validateEnv() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'CLERK_SECRET_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'ADMIN_JWT_SECRET',
    'RESEND_API_KEY',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please ensure all required environment variables are set before starting the application.'
    );
  }

  console.log('✅ All required environment variables are set');
}

async function bootstrap() {
  // Validate environment variables before app initialization
  validateEnv();

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://www.ecommercerente.com',
      'https://ecommercerente.com',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature', 'svix-id', 'svix-timestamp', 'svix-signature'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Warenpakete Portal API')
    .setDescription('B2B Warenpakete Portal API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
