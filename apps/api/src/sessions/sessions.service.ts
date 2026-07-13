import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(learnerId: string, expertId: string) {
    return this.prisma.session.create({
      data: { learnerId, expertId, status: 'SCHEDULED' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.session.findMany({
      where: { OR: [{ learnerId: userId }, { expertId: userId }] },
      include: {
        learner: { select: { name: true, email: true } },
        expert: { select: { name: true, profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: {
        learner: true,
        expert: { include: { profile: true } },
        messages: true,
        transcript: true,
        review: true,
      },
    });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async updateStatus(id: string, status: string, data?: any) {
    return this.prisma.session.update({
      where: { id },
      data: { status: status as any, ...data },
    });
  }
}
