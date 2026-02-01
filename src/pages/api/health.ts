import { NextApiRequest, NextApiResponse } from 'next';
import { initializeServices, getInitializationStatus } from '@/lib/initialize';

/**
 * GET /api/health - Health check and service status
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize services if not already done
    await initializeServices().catch(err => {
      console.warn('Service initialization failed:', err);
    });

    const status = getInitializationStatus();

    return res.status(200).json({
      success: true,
      status: 'ok',
      services: {
        initialized: status.initialized,
        hasEnvironment: status.hasEnv,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
