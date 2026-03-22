import { PrismaClient } from '@prisma/client';
import { IRouteRepository } from '../../../core/ports/outbound/repositories';
import { RouteProps } from '../../../core/domain/Route';

export class PostgresRouteRepository implements IRouteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<RouteProps[]> {
    const routes = await this.prisma.route.findMany();
    // Map database snake_case back to domain camelCase
    return routes.map(r => ({
      routeId: r.route_id,
      vesselType: r.vesselType as any,
      fuelType: r.fuelType as any,
      year: r.year,
      ghgIntensity: r.ghg_intensity,
      fuelConsumption: r.fuelConsumption,
      distance: r.distance,
      totalEmissions: r.totalEmissions,
      isBaseline: r.is_baseline
    }));
  }

  async findById(routeId: string): Promise<RouteProps | null> {
    const r = await this.prisma.route.findUnique({ where: { route_id: routeId } });
    if (!r) return null;
    
    return {
      routeId: r.route_id,
      vesselType: r.vesselType as any,
      fuelType: r.fuelType as any,
      year: r.year,
      ghgIntensity: r.ghg_intensity,
      fuelConsumption: r.fuelConsumption,
      distance: r.distance,
      totalEmissions: r.totalEmissions,
      isBaseline: r.is_baseline
    };
  }

  async setBaseline(routeId: string): Promise<void> {
    // Remove baseline from all, then set it for the specific route
    await this.prisma.route.updateMany({ data: { is_baseline: false } });
    await this.prisma.route.update({ where: { route_id: routeId }, data: { is_baseline: true } });
  }

  async getBaseline(): Promise<RouteProps | null> {
    const r = await this.prisma.route.findFirst({ where: { is_baseline: true } });
    if (!r) return null;

    return {
      routeId: r.route_id,
      vesselType: r.vesselType as any,
      fuelType: r.fuelType as any,
      year: r.year,
      ghgIntensity: r.ghg_intensity,
      fuelConsumption: r.fuelConsumption,
      distance: r.distance,
      totalEmissions: r.totalEmissions,
      isBaseline: r.is_baseline
    };
  }
}