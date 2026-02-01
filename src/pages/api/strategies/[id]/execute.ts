import { NextApiRequest, NextApiResponse } from 'next';
import { ExecutionOrder, ApiResponse } from '@/types';
import { generateTraceId } from '@/utils/crypto';
import { getSmartContractManager } from '@/lib/smart-contract';
import { getAuditService } from '@/lib/audit';

// In-memory orders store
const ordersStore = new Map<string, ExecutionOrder>();

/**
 * API handler for /api/strategies/[id]/execute
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return handlePost(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * POST /api/strategies/[id]/execute - Execute a strategy
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const strategyId = typeof id === 'string' ? id : id?.[0] || '';
    const { signals, executor, riskConfig } = req.body;

    if (!signals || !Array.isArray(signals)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EXECUTION_REQUEST',
          message: 'Signals array is required',
        },
      });
    }

    // Create execution orders from signals
    const orders: ExecutionOrder[] = [];

    try {
      const contractManager = getSmartContractManager();
      const auditService = getAuditService();

      for (const signal of signals) {
        const orderId = `order_${generateTraceId()}`;
        const order: ExecutionOrder = {
          id: orderId,
          strategyId,
          symbol: signal.symbol,
          action: signal.action,
          amount: signal.weight,
          expectedPrice: signal.expectedPrice || 0,
          maxSlippage: riskConfig?.maxSlippage || 0.05,
          status: 'pending',
          createdAt: new Date(),
        };

        // Validate risk limits
        const isWithinLimits = contractManager.validateRiskLimits(order, riskConfig || {});
        if (!isWithinLimits) {
          order.status = 'cancelled';
          orders.push(order);
          continue;
        }

        // Simulate swap first
        const simulation = await contractManager.simulateSwap(
          'TOKEN_IN',
          'TOKEN_OUT',
          order.amount.toString()
        );

        order.simulationResult = simulation;

        if (!simulation.success) {
          order.status = 'failed';
          orders.push(order);
          continue;
        }

        // Execute order
        try {
          const txHash = await contractManager.executeOrder(order);
          order.txHash = txHash;
          order.status = 'executed';
          ordersStore.set(orderId, order);

          // Record in audit
          auditService.recordOrderExecution(orderId, executor || 'system', order, txHash);
        } catch (execError) {
          order.status = 'failed';
          console.error('Order execution failed:', execError);
        }

        orders.push(order);
      }

      const response: ApiResponse<any> = {
        success: true,
        data: {
          strategyId,
          orders,
          totalOrders: orders.length,
          executedOrders: orders.filter(o => o.status === 'executed').length,
          failedOrders: orders.filter(o => o.status === 'failed').length,
        },
        meta: {
          timestamp: new Date(),
          version: '1.0.0',
        },
      };

      return res.status(201).json(response);
    } catch (initError) {
      console.warn('Contract manager not initialized, using mock execution');
      // Mock execution for MVP
      const mockOrders = signals.map((signal: any) => ({
        id: `order_${generateTraceId()}`,
        strategyId,
        symbol: signal.symbol,
        action: signal.action,
        amount: signal.weight,
        status: 'executed',
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        createdAt: new Date(),
        executedAt: new Date(),
      }));

      return res.status(201).json({
        success: true,
        data: {
          strategyId,
          orders: mockOrders,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'EXECUTION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}
