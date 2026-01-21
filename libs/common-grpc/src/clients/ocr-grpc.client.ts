import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { grpcOcrClientOptions } from '../grpc-options';

export interface OcrRequest {
  task_id: string;
  image_url: string;
  language?: string;
  options?: {
    detect_orientation?: boolean;
    enhance_image?: boolean;
    output_format?: string;
  };
}

export interface OcrResponse {
  task_id: string;
  success: boolean;
  text: string;
  confidence: number;
  regions: TextRegion[];
  error_message?: string;
}

export interface TextRegion {
  text: string;
  confidence: number;
  bbox: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OcrChunk {
  task_id: string;
  partial_text: string;
  progress: number;
}

interface OcrEngineService {
  extractText(request: OcrRequest): Observable<OcrResponse>;
  extractTextStream(request: OcrRequest): Observable<OcrChunk>;
}

@Injectable()
export class OcrGrpcClient implements OnModuleInit {
  private readonly logger = new Logger(OcrGrpcClient.name);
  private ocrService: OcrEngineService;

  @Client(grpcOcrClientOptions)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.ocrService = this.client.getService<OcrEngineService>('OcrEngine');
  }

  extractText(request: OcrRequest): Observable<OcrResponse> {
    this.logger.debug(`OCR 요청: ${request.task_id}`);
    return this.ocrService.extractText(request);
  }

  extractTextStream(request: OcrRequest): Observable<OcrChunk> {
    this.logger.debug(`OCR 스트림 요청: ${request.task_id}`);
    return this.ocrService.extractTextStream(request);
  }
}
