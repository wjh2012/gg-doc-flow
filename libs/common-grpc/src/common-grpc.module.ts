import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OcrGrpcClient } from './clients/ocr-grpc.client';
import { DetectionGrpcClient } from './clients/detection-grpc.client';

export interface GrpcModuleOptions {
  ocrUrl?: string;
  detectionUrl?: string;
}

@Module({})
export class CommonGrpcModule {
  static forOcr(url?: string): DynamicModule {
    return {
      module: CommonGrpcModule,
      imports: [
        ClientsModule.register([
          {
            name: 'OCR_PACKAGE',
            transport: Transport.GRPC,
            options: {
              package: 'ocr',
              protoPath: join(__dirname, 'proto/ocr.proto'),
              url: url || process.env.OCR_GRPC_URL || 'localhost:50051',
            },
          },
        ]),
      ],
      providers: [OcrGrpcClient],
      exports: [OcrGrpcClient],
    };
  }

  static forDetection(url?: string): DynamicModule {
    return {
      module: CommonGrpcModule,
      imports: [
        ClientsModule.register([
          {
            name: 'DETECTION_PACKAGE',
            transport: Transport.GRPC,
            options: {
              package: 'detection',
              protoPath: join(__dirname, 'proto/detection.proto'),
              url: url || process.env.DETECTION_GRPC_URL || 'localhost:50052',
            },
          },
        ]),
      ],
      providers: [DetectionGrpcClient],
      exports: [DetectionGrpcClient],
    };
  }
}
