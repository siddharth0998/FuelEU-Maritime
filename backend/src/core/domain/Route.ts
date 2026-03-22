export type FuelType = 'HFO' | 'MGO' | 'LNG';
export type VesselType = 'Container' | 'BulkCarrier' | 'Tanker' | 'RoRo';

export interface RouteProps {
  routeId: string;
  vesselType: VesselType;
  fuelType: FuelType;
  year: number;
  ghgIntensity: number;     // gCO2e/MJ
  fuelConsumption: number;  // tonnes
  distance: number;         // km
  totalEmissions: number;   // tonnes
  isBaseline?: boolean;
}

export class Route {
  constructor(public readonly props: RouteProps) {}

  // Domain behavior: A route is only compliant if its intensity is at or below the target.
  public isCompliant(targetIntensity: number): boolean {
    return this.props.ghgIntensity <= targetIntensity;
  }
}