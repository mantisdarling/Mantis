import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(learnerId: string, sessionId: string, expertId: string, rating: number, comment?: string) {
    const review = await this.prisma.review.create({
      data: { sessionId, learnerId, expertId, rating, comment },
    });
    // Recalculate expert average rating
    const reviews = await this.prisma.review.findMany({ where: { expertId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.prisma.profile.update({
      where: { userId: expertId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });
    return review;
  }

  async findByExpert(expertId: string) {
    return this.prisma.review.findMany({
      where: { expertId },
      include: { learner: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
