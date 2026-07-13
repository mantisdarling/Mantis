import { Injectable } from '@nestjs/common';

enum CircuitState { CLOSED = 'CLOSED', OPEN = 'OPEN', HALF_OPEN = 'HALF_OPEN' }

@Injectable()
export class CircuitBreakerService {
  private circuits = new Map<string, { state: CircuitState; failures: number; lastFailure: number }>();

  isOpen(service: string): boolean {
    const circuit = this.circuits.get(service);
    if (!circuit) return false;
    if (circuit.state === CircuitState.OPEN) {
      // Auto-reset after 30 seconds
      if (Date.now() - circuit.lastFailure > 30000) {
        circuit.state = CircuitState.HALF_OPEN;
        return false;
      }
      return true;
    }
    return false;
  }

  recordFailure(service: string) {
    const circuit = this.circuits.get(service) || { state: CircuitState.CLOSED, failures: 0, lastFailure: 0 };
    circuit.failures += 1;
    circuit.lastFailure = Date.now();
    if (circuit.failures >= 5) circuit.state = CircuitState.OPEN;
    this.circuits.set(service, circuit);
  }

  recordSuccess(service: string) {
    this.circuits.set(service, { state: CircuitState.CLOSED, failures: 0, lastFailure: 0 });
  }
}
