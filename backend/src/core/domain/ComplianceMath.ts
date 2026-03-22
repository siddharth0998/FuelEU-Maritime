export const FUEL_EU_CONSTANTS = {
  TARGET_INTENSITY_2025: 89.3368, // gCO₂e/MJ
  ENERGY_CONVERSION_FACTOR: 41000, // MJ/t
} as const;

export class ComplianceMath {
  /**
   * Calculates the energy in scope in Megajoules (MJ).
   * Formula: fuelConsumption * 41000
   */
  static calculateEnergyInScope(fuelConsumptionTonnes: number): number {
    return fuelConsumptionTonnes * FUEL_EU_CONSTANTS.ENERGY_CONVERSION_FACTOR;
  }

  /**
   * Calculates the Compliance Balance (CB).
   * Positive CB = Surplus (Compliant). Negative CB = Deficit (Non-compliant).
   */
  static calculateComplianceBalance(actualIntensity: number, fuelConsumptionTonnes: number): number {
    const energyInScope = this.calculateEnergyInScope(fuelConsumptionTonnes);
    return (FUEL_EU_CONSTANTS.TARGET_INTENSITY_2025 - actualIntensity) * energyInScope;
  }

  /**
   * Calculates the percentage difference between a comparison route and the baseline.
   */
  static calculatePercentDifference(comparisonIntensity: number, baselineIntensity: number): number {
    if (baselineIntensity === 0) {
      throw new Error("Baseline intensity cannot be zero.");
    }
    return ((comparisonIntensity / baselineIntensity) - 1) * 100;
  }
}