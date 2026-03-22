import { PrismaClient } from '@prisma/client';
import { IPoolRepository } from '../../../core/ports/outbound/repositories';
import { PoolMember } from '../../../core/domain/Pool';

export class PostgresPoolRepository implements IPoolRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createPool(year: number, members: PoolMember[]): Promise<string> {
    // We use a Prisma transaction to ensure the pool and its members 
    // are saved together. If one fails, the whole operation rolls back.
    const pool = await this.prisma.pool.create({
      data: {
        year,
        members: {
          create: members.map((m) => ({
            ship_id: m.shipId,
            cb_before: m.cbBefore,
            cb_after: m.cbAfter,
          })),
        },
      },
    });

    return pool.id;
  }
}