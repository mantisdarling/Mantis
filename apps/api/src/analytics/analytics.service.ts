import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformStats() {
    const [totalUsers, totalExperts, totalSessions, totalRevenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'EXPERT' } }),
      this.prisma.session.count(),
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
    ]);
    return {
      totalUsers,
      totalExperts,
      totalLearners: totalUsers - totalExperts,
      totalSessions,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  }
}
