export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export class Pool {
  public members: PoolMember[] = [];

  constructor(public readonly year: number) {}

  /**
   * Evaluates if a pool is valid and allocates surpluses to deficits.
   * Rules: 
   * 1. Sum(CB) >= 0
   * 2. Deficit ship cannot exit worse
   * 3. Surplus ship cannot exit negative
   */
  public allocateBalances(initialBalances: { shipId: string; cb: number }[]): PoolMember[] {
    const totalCb = initialBalances.reduce((sum, ship) => sum + ship.cb, 0);

    // Rule 1: Pool is invalid if the total CB is negative
    if (totalCb < 0) {
      throw new Error("Invalid Pool: Sum of Compliance Balances must be >= 0.");
    }

    // Separate into surplus and deficit arrays
    let surpluses = initialBalances.filter(s => s.cb >= 0).sort((a, b) => b.cb - a.cb); // Descending
    let deficits = initialBalances.filter(s => s.cb < 0).sort((a, b) => a.cb - b.cb);   // Ascending

    const allocatedMembers: PoolMember[] = initialBalances.map(s => ({
      shipId: s.shipId,
      cbBefore: s.cb,
      cbAfter: s.cb // Default to before, will be modified
    }));

    // Greedy Allocation: Transfer surplus to deficits
    for (const deficit of deficits) {
      let needed = Math.abs(deficit.cb);
      const deficitMember = allocatedMembers.find(m => m.shipId === deficit.shipId)!;

      for (const surplus of surpluses) {
        if (needed <= 0) break; // Deficit covered
        
        const surplusMember = allocatedMembers.find(m => m.shipId === surplus.shipId)!;
        
        if (surplusMember.cbAfter > 0) {
          const amountToTransfer = Math.min(surplusMember.cbAfter, needed);
          
          surplusMember.cbAfter -= amountToTransfer; // Take from surplus
          deficitMember.cbAfter += amountToTransfer; // Give to deficit
          needed -= amountToTransfer;
        }
      }
    }

    this.members = allocatedMembers;
    return this.members;
  }
}