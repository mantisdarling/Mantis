import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, url: string, events: string[]) {
    const secret = crypto.randomBytes(32).toString('hex');
    return this.prisma.webhookEndpoint.create({ data: { userId, url, secret, events } });
  }

  async findByUser(userId: string) {
    return this.prisma.webhookEndpoint.findMany({ where: { userId } });
  }

  async delete(id: string) {
    return this.prisma.webhookEndpoint.delete({ where: { id } });
  }
}
