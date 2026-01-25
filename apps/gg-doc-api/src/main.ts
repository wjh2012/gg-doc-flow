import { NestFactory } from '@nestjs/core';
import { Logger } from '@app/common-logging';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );
  app.useLogger(app.get(Logger));

  app.enableCors({
    // origin: process.env.ALLOWED_ORIGIN?.split(','),
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('GG-DOC-FLOW API')
    .setDescription('Image Document AI Solution API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}
void bootstrap();
