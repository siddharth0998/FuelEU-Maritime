import { PrismaClient } from '@prisma/client';
import { IComplianceRepository } from '../../../core/ports/outbound/repositories';

export class PostgresComplianceRepository implements IComplianceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async saveComplianceBalance(shipId: string, year: number, cb: number): Promise<void> {
    await this.prisma.shipCompliance.upsert({
      where: { 
        ship_id_year: { ship_id: shipId, year } 
      },
      update: { cb_gco2eq: cb },
      create: { ship_id: shipId, year, cb_gco2eq: cb }
    });
  }

  async getComplianceBalance(shipId: string, year: number): Promise<number | null> {
    const record = await this.prisma.shipCompliance.findUnique({
      where: { 
        ship_id_year: { ship_id: shipId, year } 
      }
    });
    return record?.cb_gco2eq ?? null;
  }
}