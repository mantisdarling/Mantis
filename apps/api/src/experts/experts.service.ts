import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpertsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skill?: string, minRating?: number) {
    return this.prisma.user.findMany({
      where: {
        role: 'EXPERT',
        profile: {
          ...(skill ? { skills: { has: skill } } : {}),
          ...(minRating ? { rating: { gte: minRating } } : {}),
        },
      },
      include: { profile: true },
      orderBy: { profile: { rating: 'desc' } },
    });
  }

  async search(q: string) {
    return this.prisma.user.findMany({
      where: {
        role: 'EXPERT',
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { profile: { bio: { contains: q, mode: 'insensitive' } } },
          { profile: { headline: { contains: q, mode: 'insensitive' } } },
        ],
      },
      include: { profile: true },
      take: 10,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        reviewsReceived: {
          include: { learner: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }
}
