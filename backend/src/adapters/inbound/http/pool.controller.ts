import { Request, Response } from 'express';
import { CreatePoolUseCase } from '../../../core/application/create-pool.usecase';

export class PoolsController {
  // We inject the Use Case here. The controller doesn't know HOW the pool 
  // is created, it just trusts the Use Case to do it.
  constructor(private readonly createPoolUseCase: CreatePoolUseCase) {}

  public createPool = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipIds, year } = req.body;

      // Basic input validation
      if (!shipIds || !Array.isArray(shipIds) || shipIds.length === 0 || !year) {
        res.status(400).json({ 
          error: 'Invalid payload. Required: shipIds (array of strings) and year (number).' 
        });
        return;
      }

      // Execute the core business logic
      const result = await this.createPoolUseCase.execute(shipIds, year);

      // Return the successful response
      res.status(201).json({
        message: 'Pool created successfully',
        data: result
      });

    } catch (error: any) {
      // If the Use Case throws an error (e.g., "Sum of CB < 0"), we catch it here
      res.status(400).json({ 
        error: error.message || 'An error occurred while creating the pool.' 
      });
    }
  };
}