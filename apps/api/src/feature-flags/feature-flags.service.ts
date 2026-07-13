import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(key: string, description: string, isEnabled: boolean, percentage?: number) {
    return this.prisma.featureFlag.create({ data: { key, description, isEnabled, percentage } });
  }

  async findAll() {
    return this.prisma.featureFlag.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async evaluate(key: string): Promise<boolean> {
    const flag = await this.prisma.featureFlag.findUnique({ where: { key } });
    if (!flag || !flag.isEnabled) return false;
    if (flag.percentage === null || flag.percentage === undefined) return true;
    return Math.random() * 100 < flag.percentage;
  }

  async update(key: string, data: any) {
    return this.prisma.featureFlag.update({ where: { key }, data });
  }

  async delete(key: string) {
    return this.prisma.featureFlag.delete({ where: { key } });
  }
}
