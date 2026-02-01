import { NextApiRequest, NextApiResponse } from 'next';
import { FactorMetadata, ApiResponse } from '@/types';
import { generateTraceId } from '@/utils/crypto';
import { validateFactorMetadata, createFactorHash } from '@/utils/factor';

// In-memory store for MVP (replace with DB in production)
const factorsStore = new Map<string, FactorMetadata>();

/**
 * API handler for /api/factors
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return handlePost(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * GET /api/factors - List all factors with pagination
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const pageSize = parseInt((req.query.pageSize as string) || '10', 10);
    const tag = req.query.tag as string;

    let factors = Array.from(factorsStore.values());

    if (tag) {
      factors = factors.filter(f => f.tags.includes(tag));
    }

    const total = factors.length;
    const start = (page - 1) * pageSize;
    const paginatedFactors = factors.slice(start, start + pageSize);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        items: paginatedFactors,
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
        code: 'LIST_FACTORS_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

/**
 * POST /api/factors - Create a new factor
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, description, author, dataSource, computeFrequency, computeWindow, tags, dependencies } = req.body;

    if (!validateFactorMetadata({ name, description, author, dataSource, computeFrequency })) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FACTOR_METADATA',
          message: 'Missing required factor metadata',
        },
      });
    }

    const factorId = `factor_${generateTraceId()}`;
    const metadata: FactorMetadata = {
      id: factorId,
      name,
      description,
      version: '1.0.0',
      author,
      createdAt: new Date(),
      updatedAt: new Date(),
      dataSource,
      computeFrequency,
      computeWindow: computeWindow || 3600,
      dependencies: dependencies || [],
      tags: tags || [],
      riskLevel: 'medium',
      isPublic: req.body.isPublic !== false,
      owner: author,
      immutableHash: createFactorHash({
        id: factorId,
        name,
        description,
        version: '1.0.0',
        author,
        createdAt: new Date(),
        updatedAt: new Date(),
        dataSource,
        computeFrequency,
        computeWindow: computeWindow || 3600,
        dependencies: dependencies || [],
        tags: tags || [],
        riskLevel: 'medium',
        isPublic: req.body.isPublic !== false,
        owner: author,
      } as FactorMetadata),
    };

    factorsStore.set(factorId, metadata);

    return res.status(201).json({
      success: true,
      data: metadata,
      meta: {
        timestamp: new Date(),
        version: '1.0.0',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_FACTOR_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}
