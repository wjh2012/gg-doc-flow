import { initInstrumentation } from '@app/common-logging/otel/instrumentation';
initInstrumentation('doc-flow-api');

import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'view', method: RequestMethod.GET }],
  });

  // web-ui
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'dist/apps/doc-flow-api/views'));
  app.setViewEngine('hbs');

  // microservice listener
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  // swagger
  const config = new DocumentBuilder()
    .setTitle('GG-DOC-FLOW API')
    .setDescription('The GG-DOC-FLOW API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 9000);
}
void bootstrap();
