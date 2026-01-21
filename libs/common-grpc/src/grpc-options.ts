import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcOcrClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'ocr',
    protoPath: join(__dirname, 'proto/ocr.proto'),
    url: process.env.OCR_GRPC_URL || 'localhost:50051',
  },
};

export const grpcDetectionClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'detection',
    protoPath: join(__dirname, 'proto/detection.proto'),
    url: process.env.DETECTION_GRPC_URL || 'localhost:50052',
  },
};
