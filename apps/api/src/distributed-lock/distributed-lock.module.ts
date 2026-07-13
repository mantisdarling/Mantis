import { Module } from '@nestjs/common';
import { DistributedLockService } from './distributed-lock.service';

@Module({ providers: [DistributedLockService], exports: [DistributedLockService] })
export class DistributedLockModule {}
