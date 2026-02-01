import { NextApiRequest, NextApiResponse } from 'next';
import { Strategy, ApiResponse } from '@/types';
import { generateTraceId, sha256 } from '@/utils/crypto';
import { getAuditService } from '@/lib/audit';

// In-memory storage for MVP
const strategiesStore = new Map<string, Strategy>();
// const ordersStore = new Map<string, ExecutionOrder>();

/**
 * API handler for /api/strategies
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return handlePost(req, res);
  } else if (req.method === 'GET') {
    return handleGet(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * POST /api/strategies - Create and store a new strategy
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      name,
      version,
      factorIds,
      parameters,
      inference,
      creator,
    } = req.body;

    if (!name || !factorIds || !Array.isArray(factorIds)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STRATEGY',
          message: 'Strategy name and factorIds are required',
        },
      });
    }

    const strategyId = `strat_${generateTraceId()}`;
    const strategy: Strategy = {
      id: strategyId,
      name,
      version: version || '1.0.0',
      factorIds,
      parameters: parameters || {},
      inference,
      createdAt: new Date(),
      creator: creator || 'unknown',
      auditHash: sha256(JSON.stringify({ name, factorIds, parameters })),
    };

    strategiesStore.set(strategyId, strategy);

    // Record in audit
    const auditService = getAuditService();
    auditService.recordStrategyExecution(strategyId, creator || 'system', strategy, {
      action: 'created',
      timestamp: new Date(),
    });

    const response: ApiResponse<Strategy> = {
      success: true,
      data: strategy,
      meta: {
        timestamp: new Date(),
        version: '1.0.0',
      },
    };

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_STRATEGY_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

/**
 * GET /api/strategies - List strategies
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const pageSize = parseInt((req.query.pageSize as string) || '10', 10);

    const strategies = Array.from(strategiesStore.values());
    const total = strategies.length;
    const start = (page - 1) * pageSize;
    const paginatedStrategies = strategies.slice(start, start + pageSize);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        items: paginatedStrategies,
        total,
        page,
        pageSize,
        hasMore: start + pageSize < total,
      },
      meta: {
        timestamp: new Date(),
        version: '1.0.0',
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'LIST_STRATEGIES_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}
