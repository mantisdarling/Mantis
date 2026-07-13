import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, name: string) {
    const raw = `mantis_live_${crypto.randomBytes(24).toString('hex')}`;
    const prefix = raw.substring(0, 20);
    const keyHash = await bcrypt.hash(raw, 10);
    const apiKey = await this.prisma.apiKey.create({
      data: { userId, name, keyHash, prefix },
    });
    return { ...apiKey, key: raw }; // Raw key shown only once at creation
  }

  async findByUser(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      select: { id: true, name: true, prefix: true, lastUsedAt: true, expiresAt: true, createdAt: true },
    });
  }

  async revoke(id: string) {
    return this.prisma.apiKey.delete({ where: { id } });
  }
}
