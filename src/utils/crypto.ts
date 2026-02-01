import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate SHA256 hash for data
 */
export function sha256(data: string | Buffer): string {
  if (typeof data === 'string') {
    data = Buffer.from(data, 'utf-8');
  }
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate unique trace ID for audit tracking
 */
export function generateTraceId(): string {
  return uuidv4();
}

/**
 * Generate nonce for replay protection
 */
export function generateNonce(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify TEE signature format
 */
export function isValidTEESignature(signature: string): boolean {
  return /^0x[0-9a-fA-F]{128,}$/.test(signature);
}

/**
 * Calculate Merkle root from hashes
 */
export function calculateMerkleRoot(hashes: string[]): string {
  if (hashes.length === 0) {
    return '';
  }
  
  if (hashes.length === 1) {
    return hashes[0];
  }

  const tree: string[] = [...hashes];

  while (tree.length > 1) {
    const newLevel: string[] = [];
    for (let i = 0; i < tree.length; i += 2) {
      const left = tree[i];
      const right = tree[i + 1] || tree[i];
      const combined = left + right;
      const hash = sha256(combined);
      newLevel.push(hash);
    }
    tree.length = 0;
    tree.push(...newLevel);
  }

  return tree[0];
}

/**
 * Calculate volatility from price data
 */
export function calculateVolatility(prices: number[], period: number = 20): number {
  if (prices.length < 2) return 0;

  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const sliced = returns.slice(-period);
  const mean = sliced.reduce((a, b) => a + b) / sliced.length;
  const variance = sliced.reduce((a, b) => a + Math.pow(b - mean, 2)) / sliced.length;

  return Math.sqrt(variance) * Math.sqrt(252); // Annualized
}

/**
 * Calculate dynamic slippage based on volatility
 */
export function calculateDynamicSlippage(
  volatility: number,
  baseFee: number = 0.003,
  volatilityMultiplier: number = 0.5
): number {
  return baseFee + volatility * volatilityMultiplier;
}

/**
 * Format large numbers with suffix (K, M, B)
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
  return num.toFixed(decimals);
}

/**
 * Parse environment variables safely
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value || defaultValue || '';
}

/**
 * Create JSON structure for 0G Storage upload
 */
export function createUploadPayload(data: any, metadata: Record<string, any>) {
  return {
    data,
    metadata,
    timestamp: new Date(),
    hash: sha256(JSON.stringify(data)),
  };
}

/**
 * Batch operations by size
 */
export function batchArray<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Validate Ethereum address format
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate chain ID
 */
export function isValidChainId(chainId: number): boolean {
  const validChains = [1, 5, 137, 42161, 8453, 16661]; // mainnet, goerli, polygon, arbitrum, base, 0g-mainnet
  return validChains.includes(chainId);
}
