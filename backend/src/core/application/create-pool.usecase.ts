import { Pool } from '../domain/Pool';
import { ComplianceMath, FUEL_EU_CONSTANTS } from '../domain/ComplianceMath';
import { IRouteRepository, IComplianceRepository, IPoolRepository } from '../ports/outbound/repositories';

export class CreatePoolUseCase {
  constructor(
    private routeRepo: IRouteRepository,
    private complianceRepo: IComplianceRepository,
    private poolRepo: IPoolRepository
  ) {}

  async execute(shipIds: string[], year: number): Promise<{ poolId: string, members: any[] }> {
    const initialBalances = [];

    // 1. Fetch routes and calculate current CB for all requested ships
    for (const shipId of shipIds) {
      const route = await this.routeRepo.findById(shipId);
      if (!route || route.year !== year) {
        throw new Error(`Route data for ship ${shipId} in year ${year} not found.`);
      }

      const cb = ComplianceMath.calculateComplianceBalance(route.ghgIntensity, route.fuelConsumption);
      initialBalances.push({ shipId, cb });
    }

    // 2. Pass to Domain Logic to calculate pooling
    const pool = new Pool(year);
    const allocatedMembers = pool.allocateBalances(initialBalances);

    // 3. Save the new pool via the outbound port
    const poolId = await this.poolRepo.createPool(year, allocatedMembers);

    // 4. Update the individual ship compliance records
    for (const member of allocatedMembers) {
      await this.complianceRepo.saveComplianceBalance(member.shipId, year, member.cbAfter);
    }

    return { poolId, members: allocatedMembers };
  }
}