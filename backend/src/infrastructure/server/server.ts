import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// 1. Import Adapters
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/postgres-route.repository';
import { PostgresComplianceRepository } from '../../adapters/outbound/postgres/postgres-compliance.repository';
import { PostgresPoolRepository } from '../../adapters/outbound/postgres/postgres-pool.repository';
import { PoolsController } from '../../adapters/inbound/http/pool.controller';

// 2. Import Core Use Cases
import { CreatePoolUseCase } from '../../core/application/create-pool.usecase';

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

// --- DEPENDENCY INJECTION (The Hexagonal Wiring) ---

// A. Initialize Database Adapters
const routeRepo = new PostgresRouteRepository(prisma);
const complianceRepo = new PostgresComplianceRepository(prisma);
const poolRepo = new PostgresPoolRepository(prisma);

// B. Inject Adapters into Core Use Case
const createPoolUseCase = new CreatePoolUseCase(routeRepo, complianceRepo, poolRepo);

// C. Inject Use Case into HTTP Controller
const poolsController = new PoolsController(createPoolUseCase);


// --- API ROUTES ---
app.post('/api/pools', poolsController.createPool);

// Add a simple health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Fuel EU Backend is running!' });
});


// --- START SERVER ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`🔌 Hexagonal layers wired successfully.`);
});