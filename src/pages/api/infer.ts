import { NextApiRequest, NextApiResponse } from 'next';
import { InferenceOutput, TradeSignal, ApiResponse } from '@/types';
import { generateTraceId, sha256 } from '@/utils/crypto';

// In-memory inference results store
const inferenceStore = new Map<string, InferenceOutput>();

/**
 * API handler for /api/infer
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
 * POST /api/infer - Generate AI inference and trading signals
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { factorSnapshots, marketEnvironment, riskConfig } = req.body;

    if (!factorSnapshots || !Array.isArray(factorSnapshots)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INFERENCE_INPUT',
          message: 'Factor snapshots are required',
        },
      });
    }

    const traceId = generateTraceId();
    
    // Mock inference logic - replace with actual AI model
    const signals: TradeSignal[] = generateMockSignals();
    
    // Create input hash
    const inputHash = sha256(JSON.stringify({
      factorSnapshots: factorSnapshots.map(f => f.metadataHash),
      marketEnvironment,
    }));

    const inference: InferenceOutput = {
      traceId,
      timestamp: new Date(),
      modelVersion: 'v1.0',
      modelHash: 'model_hash_v1.0',
      signals,
      portfolio: {
        totalWeight: signals.reduce((sum, s) => sum + s.weight, 0),
        diversification: calculateDiversification(signals),
        expectedReturn: calculateExpectedReturn(signals),
        expectedVolatility: marketEnvironment?.volatility || 0.25,
      },
      metadata: {
        inputHash,
        confidence: calculateConfidence(signals),
        warnings: generateWarnings(signals, riskConfig),
      },
    };

    inferenceStore.set(traceId, inference);

    const response: ApiResponse<InferenceOutput> = {
      success: true,
      data: inference,
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
        code: 'INFERENCE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

/**
 * GET /api/infer - Get inference result by trace ID
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const traceId = req.query.traceId as string;

    if (!traceId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_TRACE_ID',
          message: 'traceId query parameter is required',
        },
      });
    }

    const inference = inferenceStore.get(traceId);

    if (!inference) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'INFERENCE_NOT_FOUND',
          message: `Inference with traceId ${traceId} not found`,
        },
      });
    }

    const response: ApiResponse<InferenceOutput> = {
      success: true,
      data: inference,
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
        code: 'GET_INFERENCE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

// Helper functions

function generateMockSignals(): TradeSignal[] {
  // Mock implementation - replace with actual AI model inference
  const signals: TradeSignal[] = [
    {
      symbol: 'PEPE',
      action: 'BUY',
      weight: 0.4,
      confidence: 0.82,
      reason: 'High sentiment + technical breakout',
      expectedReturn: 0.15,
      riskMetrics: {
        expectedDrawdown: 0.08,
        sharpeRatio: 2.1,
        maxDD: 0.12,
      },
    },
    {
      symbol: 'DOGE',
      action: 'BUY',
      weight: 0.3,
      confidence: 0.75,
      reason: 'Strong on-chain activity',
      expectedReturn: 0.12,
      riskMetrics: {
        expectedDrawdown: 0.1,
        sharpeRatio: 1.8,
        maxDD: 0.15,
      },
    },
    {
      symbol: 'SHIB',
      action: 'HOLD',
      weight: 0.2,
      confidence: 0.65,
      reason: 'Mixed signals, awaiting confirmation',
      expectedReturn: 0.05,
      riskMetrics: {
        expectedDrawdown: 0.12,
        sharpeRatio: 0.9,
        maxDD: 0.18,
      },
    },
    {
      symbol: 'FLOKI',
      action: 'SELL',
      weight: 0.1,
      confidence: 0.88,
      reason: 'Negative sentiment + resistance level',
      expectedReturn: -0.08,
      riskMetrics: {
        expectedDrawdown: 0.15,
        sharpeRatio: -1.2,
        maxDD: 0.25,
      },
    },
  ];

  return signals;
}

function calculateDiversification(signals: TradeSignal[]): number {
  // Herfindahl-Hirschman Index based diversification score
  const hhi = signals.reduce((sum, s) => sum + Math.pow(s.weight, 2), 0);
  return 1 - hhi; // Normalized to 0-1 range
}

function calculateExpectedReturn(signals: TradeSignal[]): number {
  return signals.reduce((sum, s) => sum + (s.expectedReturn || 0) * s.weight, 0);
}

function calculateConfidence(signals: TradeSignal[]): number {
  const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
  const diversification = calculateDiversification(signals);
  return avgConfidence * 0.7 + diversification * 0.3; // Weighted average
}

function generateWarnings(signals: TradeSignal[], riskConfig: any): string[] {
  const warnings: string[] = [];

  const negativeSignals = signals.filter(s => s.action === 'SELL').length;
  if (negativeSignals > signals.length * 0.5) {
    warnings.push('More than 50% sell signals - consider risk reduction');
  }

  const lowConfidence = signals.filter(s => s.confidence < 0.6).length;
  if (lowConfidence > 0) {
    warnings.push(`${lowConfidence} signal(s) with confidence below 60%`);
  }

  const expectedDD = signals.reduce((sum, s) => 
    sum + (s.riskMetrics?.expectedDrawdown || 0) * s.weight, 0
  );
  if (expectedDD > (riskConfig?.maxDrawdown || 0.2)) {
    warnings.push(`Expected drawdown ${(expectedDD * 100).toFixed(1)}% exceeds limit`);
  }

  return warnings;
}
