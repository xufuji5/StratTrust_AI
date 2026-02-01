import { FactorMetadata, FactorSnapshot, Factor } from '@/types';
import { sha256 } from '@/utils/crypto';

/**
 * Validate factor metadata
 */
export function validateFactorMetadata(metadata: Partial<FactorMetadata>): boolean {
  return !!(
    metadata.name &&
    metadata.description &&
    metadata.author &&
    metadata.computeFrequency &&
    metadata.dataSource &&
    metadata.dataSource.length > 0
  );
}

/**
 * Create factor version hash
 */
export function createFactorHash(metadata: FactorMetadata): string {
  const data = JSON.stringify({
    name: metadata.name,
    version: metadata.version,
    dataSource: metadata.dataSource,
    computeFrequency: metadata.computeFrequency,
    computeWindow: metadata.computeWindow,
    dependencies: metadata.dependencies,
  });
  return sha256(data);
}

/**
 * Compare two factors for uniqueness
 */
export function areFactorsEqual(
  factor1: FactorMetadata,
  factor2: FactorMetadata
): boolean {
  return createFactorHash(factor1) === createFactorHash(factor2);
}

/**
 * Filter factors by tags
 */
export function filterFactorsByTags(factors: Factor[], tags: string[]): Factor[] {
  return factors.filter(f => 
    tags.every(tag => f.metadata.tags.includes(tag))
  );
}

/**
 * Sort factors by creation date
 */
export function sortFactorsByDate(factors: Factor[], order: 'asc' | 'desc' = 'desc'): Factor[] {
  return [...factors].sort((a, b) => {
    const timeA = new Date(a.metadata.createdAt).getTime();
    const timeB = new Date(b.metadata.createdAt).getTime();
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });
}

/**
 * Calculate factor correlation matrix
 */
export function calculateFactorCorrelation(
  snapshot1: FactorSnapshot,
  snapshot2: FactorSnapshot
): number {
  const keys1 = Object.keys(snapshot1.values).filter(k => typeof snapshot1.values[k] === 'number');
  const keys2 = Object.keys(snapshot2.values).filter(k => typeof snapshot2.values[k] === 'number');
  const commonKeys = keys1.filter(k => keys2.includes(k));

  if (commonKeys.length === 0) return 0;

  const values1 = commonKeys.map(k => snapshot1.values[k] as number);
  const values2 = commonKeys.map(k => snapshot2.values[k] as number);

  const mean1 = values1.reduce((a, b) => a + b) / values1.length;
  const mean2 = values2.reduce((a, b) => a + b) / values2.length;

  const covariance = values1.reduce((sum, v1, i) => {
    return sum + (v1 - mean1) * (values2[i] - mean2);
  }, 0) / values1.length;

  const std1 = Math.sqrt(values1.reduce((sum, v) => sum + Math.pow(v - mean1, 2), 0) / values1.length);
  const std2 = Math.sqrt(values2.reduce((sum, v) => sum + Math.pow(v - mean2, 2), 0) / values2.length);

  if (std1 === 0 || std2 === 0) return 0;
  return covariance / (std1 * std2);
}

/**
 * Calculate factor importance score
 */
export function calculateFactorImportance(
  factor: Factor,
  historicalReturns: number[]
): number {
  // Simplified importance: based on correlation with returns
  if (!factor.snapshots.length || !historicalReturns.length) return 0;

  const latestSnapshot = factor.snapshots[factor.snapshots.length - 1];
  const numericValues = Object.values(latestSnapshot.values).filter(
    v => typeof v === 'number'
  ) as number[];

  if (numericValues.length === 0) return 0;

  const avgValue = numericValues.reduce((a, b) => a + b) / numericValues.length;
  const avgReturn = historicalReturns.reduce((a, b) => a + b) / historicalReturns.length;

  const covariance = historicalReturns.reduce((sum, r, i) => {
    const val = numericValues[i % numericValues.length];
    return sum + (val - avgValue) * (r - avgReturn);
  }, 0) / Math.min(historicalReturns.length, numericValues.length);

  return Math.abs(covariance);
}

/**
 * Detect factor anomalies
 */
export function detectFactorAnomalies(
  snapshots: FactorSnapshot[],
  threshold: number = 3
): FactorSnapshot[] {
  const anomalies: FactorSnapshot[] = [];

  // Get all numeric values across all keys
  const allValues: number[] = [];
  snapshots.forEach(s => {
    Object.values(s.values).forEach(v => {
      if (typeof v === 'number') allValues.push(v);
    });
  });

  if (allValues.length < 2) return anomalies;

  const mean = allValues.reduce((a, b) => a + b) / allValues.length;
  const std = Math.sqrt(
    allValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / allValues.length
  );

  snapshots.forEach(snapshot => {
    let isAnomaly = false;
    Object.values(snapshot.values).forEach(v => {
      if (typeof v === 'number' && Math.abs(v - mean) > threshold * std) {
        isAnomaly = true;
      }
    });
    if (isAnomaly) anomalies.push(snapshot);
  });

  return anomalies;
}

/**
 * Interpolate missing factor values
 */
export function interpolateFactorValues(
  snapshots: FactorSnapshot[],
  timeGaps: number
): FactorSnapshot[] {
  if (snapshots.length < 2) return snapshots;

  const result: FactorSnapshot[] = [];
  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  for (let i = 0; i < sorted.length - 1; i++) {
    result.push(sorted[i]);

    const current = sorted[i];
    const next = sorted[i + 1];
    const timeDiff = new Date(next.timestamp).getTime() - new Date(current.timestamp).getTime();

    if (timeDiff > timeGaps) {
      const steps = Math.floor(timeDiff / timeGaps);
      for (let step = 1; step < steps; step++) {
        const interpolated: FactorSnapshot = {
          ...current,
          timestamp: new Date(
            new Date(current.timestamp).getTime() + step * timeGaps
          ),
          values: {},
        };

        // Linear interpolation for numeric values
        Object.keys(current.values).forEach(key => {
          const currVal = current.values[key];
          const nextVal = next.values[key];

          if (typeof currVal === 'number' && typeof nextVal === 'number') {
            const ratio = step / steps;
            interpolated.values[key] = currVal + (nextVal - currVal) * ratio;
          } else {
            interpolated.values[key] = currVal;
          }
        });

        result.push(interpolated);
      }
    }
  }

  result.push(sorted[sorted.length - 1]);
  return result;
}
