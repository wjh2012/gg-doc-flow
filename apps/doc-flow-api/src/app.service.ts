import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('hello_tcp') private client: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }

  test(): void {
    const payload = {
      message: 'hello',
      timestamp: Date.now(),
    };
    this.client.emit('test_event', payload);
    console.log('이벤트를 성공적으로 전송했습니다.');
  }
}
