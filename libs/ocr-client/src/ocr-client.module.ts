import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OcrGrpcClient } from './ocr-grpc.client';

export interface OcrClientModuleOptions {
    url?: string;
}

@Module({})
export class OcrClientModule {
    static register(options: OcrClientModuleOptions = {}): DynamicModule {
        return {
            module: OcrClientModule,
            imports: [
                ClientsModule.register([
                    {
                        name: 'OCR_PACKAGE',
                        transport: Transport.GRPC,
                        options: {
                            package: 'ocr',
                            protoPath: join(__dirname, 'proto/ocr.proto'),
                            url: options.url || process.env.OCR_GRPC_URL || 'localhost:50051',
                        },
                    },
                ]),
            ],
            providers: [OcrGrpcClient],
            exports: [OcrGrpcClient],
        };
    }
}
