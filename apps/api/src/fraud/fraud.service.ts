import { Injectable } from '@nestjs/common';

@Injectable()
export class FraudService {
  checkPayment(amount: number, userId: string): { isFraud: boolean; riskScore: number; reason?: string } {
    // Basic heuristics — replace with ML model in production
    if (amount > 10000) return { isFraud: true, riskScore: 0.95, reason: 'Unusually large transaction' };
    if (amount < 0) return { isFraud: true, riskScore: 1.0, reason: 'Negative amount' };
    return { isFraud: false, riskScore: 0.05 };
  }
}
