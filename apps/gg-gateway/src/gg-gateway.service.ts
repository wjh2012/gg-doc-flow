import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import fastifyProxy from '@fastify/http-proxy';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { proxyConfigs } from './configs/proxy.config';
import { IncomingHttpHeaders } from 'node:http';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      sub: string;
      role: string;
    };
  }
}

@Injectable()
export class GgGatewayService implements OnModuleInit {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    const instance: FastifyInstance =
      this.adapterHost.httpAdapter.getInstance();

    proxyConfigs.forEach((cfg) => {
      instance.register(fastifyProxy, {
        upstream: cfg.upstream,
        prefix: cfg.prefix,
        rewritePrefix: cfg.prefix,
        preHandler: cfg.authRequired ? this.createPreHandler() : undefined,
        replyOptions: cfg.authRequired ? this.createReplyOptions() : undefined,
      });
    });
  }

  private createPreHandler() {
    return (
      req: FastifyRequest,
      reply: FastifyReply,
      done: (err?: Error) => void,
    ) => {
      this.validateJwt(req.headers.authorization)
        .then((user) => {
          req.user = user;
          done();
        })
        .catch(() => {
          reply.code(401).send({ message: 'Unauthorized' });
        });
    };
  }

  private createReplyOptions() {
    return {
      rewriteRequestHeaders: (req: any, headers: IncomingHttpHeaders) => {
        const fastifyReq = req as FastifyRequest;

        const safeHeaders = { ...headers };
        delete safeHeaders['x-user-id'];
        delete safeHeaders['x-user-role'];

        return {
          ...headers,
          'x-user-id': fastifyReq.user?.sub ?? '',
          'x-user-role': fastifyReq.user?.role ?? '',
        };
      },
    };
  }

  private async validateJwt(authHeader?: string) {
    if (!authHeader?.startsWith('Bearer ')) throw new Error();
    const token = authHeader.replace('Bearer ', '');
    const payload = await this.jwtService.verifyAsync<{
      sub: string;
      role: string;
    }>(token);

    return { sub: payload.sub, role: payload.role };
  }
}
