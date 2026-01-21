import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DocController } from './doc.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DOC_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.DOC_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.DOC_SERVICE_PORT || '9000', 10),
        },
      },
    ]),
  ],
  controllers: [DocController],
})
export class DocModule {}
