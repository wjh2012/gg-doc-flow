import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { TaskService } from './task.service';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern({ cmd: 'create_ocr_task' })
  async createOcrTask(data: { userId: string }) {
    await this.taskService.publishTask('OCR', data.userId);
    return { success: true };
  }

  @MessagePattern({ cmd: 'create_detection_task' })
  async createDetectionTask(data: { userId: string }) {
    await this.taskService.publishTask('DETECTION', data.userId);
    return { success: true };
  }

  @MessagePattern({ cmd: 'get_recent_tasks' })
  async getRecentTasks(data: { limit?: number }) {
    return this.taskService.getRecentTasks(data.limit || 100);
  }

  @EventPattern('task_status_updates')
  handleTaskStatus(data: any) {
    this.taskService.broadcastTaskStatus(data);
  }
}
