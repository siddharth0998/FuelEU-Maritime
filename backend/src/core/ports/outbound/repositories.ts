import { RouteProps } from '../../domain/Route';
import { PoolMember } from '../../domain/Pool';

export interface IRouteRepository {
  findAll(): Promise<RouteProps[]>;
  findById(routeId: string): Promise<RouteProps | null>;
  setBaseline(routeId: string): Promise<void>;
  getBaseline(): Promise<RouteProps | null>;
}

export interface IComplianceRepository {
  saveComplianceBalance(shipId: string, year: number, cb: number): Promise<void>;
  getComplianceBalance(shipId: string, year: number): Promise<number | null>;
}

export interface IPoolRepository {
  createPool(year: number, members: PoolMember[]): Promise<string>;
}