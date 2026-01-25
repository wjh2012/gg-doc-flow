import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export interface DetectionRequest {
    task_id: string;
    image_url: string;
    target_classes?: string[];
    options?: {
        confidence_threshold?: number;
        iou_threshold?: number;
        max_detections?: number;
    };
}

export interface DetectionResponse {
    task_id: string;
    success: boolean;
    objects: DetectedObject[];
    error_message?: string;
}

export interface DetectedObject {
    class_name: string;
    confidence: number;
    bbox: BoundingBox;
    attributes?: Record<string, string>;
}

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface DetectionChunk {
    task_id: string;
    progress: number;
    partial_objects: DetectedObject[];
}

interface DetectionEngineService {
    detectObjects(request: DetectionRequest): Observable<DetectionResponse>;
    detectObjectsStream(request: DetectionRequest): Observable<DetectionChunk>;
}

@Injectable()
export class DetectionGrpcClient implements OnModuleInit {
    private readonly logger = new Logger(DetectionGrpcClient.name);
    private detectionService!: DetectionEngineService;

    constructor(@Inject('DETECTION_PACKAGE') private readonly client: any) { }

    onModuleInit() {
        this.detectionService =
            (this.client as ClientGrpc).getService<DetectionEngineService>('DetectionEngine');
    }

    detectObjects(request: DetectionRequest): Observable<DetectionResponse> {
        this.logger.debug(`Detection 요청: ${request.task_id}`);
        return this.detectionService.detectObjects(request);
    }

    detectObjectsStream(request: DetectionRequest): Observable<DetectionChunk> {
        this.logger.debug(`Detection 스트림 요청: ${request.task_id}`);
        return this.detectionService.detectObjectsStream(request);
    }
}
