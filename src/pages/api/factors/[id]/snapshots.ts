import { NextApiRequest, NextApiResponse } from 'next';
import { FactorSnapshot, ApiResponse } from '@/types';

// In-memory snapshots store (replace with TimeSeries DB in production)
const snapshotsStore = new Map<string, FactorSnapshot[]>();

/**
 * API handler for /api/factors/[id]/snapshots
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const factorId = typeof id === 'string' ? id : id?.[0] || '';

  if (req.method === 'GET') {
    return handleGet(factorId, req, res);
  } else if (req.method === 'POST') {
    return handlePost(factorId, req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * GET /api/factors/[id]/snapshots - Get factor snapshots
 */
async function handleGet(factorId: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const limit = parseInt((req.query.limit as string) || '100', 10);
    const offset = parseInt((req.query.offset as string) || '0', 10);

    const snapshots = snapshotsStore.get(factorId) || [];
    const sliced = snapshots.slice(-limit - offset, -offset || undefined);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        factorId,
        snapshots: sliced,
        total: snapshots.length,
        latest: snapshots[snapshots.length - 1] || null,
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
        code: 'GET_SNAPSHOTS_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

/**
 * POST /api/factors/[id]/snapshots - Record a new factor snapshot
 */
async function handlePost(factorId: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { values, metadataHash } = req.body;

    if (!values || typeof values !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SNAPSHOT_DATA',
          message: 'Snapshot values must be provided as an object',
        },
      });
    }

    const snapshot: FactorSnapshot = {
      factorId,
      version: '1.0.0',
      timestamp: new Date(),
      values,
      metadataHash: metadataHash || '',
      merkleRoot: undefined,
    };

    const existing = snapshotsStore.get(factorId) || [];
    existing.push(snapshot);
    snapshotsStore.set(factorId, existing);

    return res.status(201).json({
      success: true,
      data: snapshot,
      meta: {
        timestamp: new Date(),
        version: '1.0.0',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_SNAPSHOT_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}
