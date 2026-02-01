/**
 * Audit & Traceability Module
 * Handles audit logging, strategy snapshots, and transaction tracking
 */

import { AuditLog, Strategy, ExecutionOrder } from '@/types';
import { generateTraceId, sha256 } from '@/utils/crypto';
import { getZGStorage } from './0g-storage';

export interface AuditConfig {
  enableOnChainRecording?: boolean;
  batchSize?: number;
  batchInterval?: number; // ms
}

class AuditService {
  private config: AuditConfig;
  private auditLogs: AuditLog[] = [];
  private strategies: Map<string, Strategy> = new Map();
  // private executionOrders: Map<string, ExecutionOrder> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;
  private pendingBatch: AuditLog[] = [];

  constructor(config: AuditConfig = {}) {
    this.config = {
      enableOnChainRecording: false,
      batchSize: 100,
      batchInterval: 600000, // 10 minutes
      ...config,
    };

    this.startBatchProcessor();
  }

  /**
   * Record inference execution to audit log
   */
  recordInferenceExecution(
    traceId: string,
    actor: string,
    inferenceData: any,
    result: any
  ): AuditLog {
    const log: AuditLog = {
      id: generateTraceId(),
      traceId,
      timestamp: new Date(),
      action: 'inference',
      actor,
      details: {
        input: {
          hash: sha256(JSON.stringify(inferenceData)),
          timestamp: new Date().toISOString(),
        },
        output: {
          hash: sha256(JSON.stringify(result)),
          signals: result.signals?.length || 0,
          confidence: result.metadata?.confidence,
        },
      },
    };

    this.auditLogs.push(log);
    this.pendingBatch.push(log);
    return log;
  }

  /**
   * Record strategy execution
   */
  recordStrategyExecution(
    strategyId: string,
    actor: string,
    strategy: Strategy,
    executionDetails: Record<string, any>
  ): AuditLog {
    const log: AuditLog = {
      id: generateTraceId(),
      traceId: strategy.id,
      timestamp: new Date(),
      action: 'execution',
      actor,
      details: {
        strategyId,
        strategyVersion: strategy.version,
        factorCount: strategy.factorIds.length,
        execution: executionDetails,
        strategyCID: strategy.strategyCID,
      },
    };

    this.auditLogs.push(log);
    this.pendingBatch.push(log);
    return log;
  }

  /**
   * Record order execution
   */
  recordOrderExecution(
    orderId: string,
    actor: string,
    order: ExecutionOrder,
    txHash?: string
  ): AuditLog {
    const log: AuditLog = {
      id: generateTraceId(),
      traceId: order.id,
      timestamp: new Date(),
      action: 'execution',
      actor,
      details: {
        orderId,
        symbol: order.symbol,
        action: order.action,
        amount: order.amount,
        status: order.status,
        txHash,
        slippage: order.maxSlippage,
      },
    };

    this.auditLogs.push(log);
    this.pendingBatch.push(log);
    return log;
  }

  /**
   * Record verification event
   */
  recordVerification(
    actor: string,
    verificationData: Record<string, any>
  ): AuditLog {
    const log: AuditLog = {
      id: generateTraceId(),
      traceId: generateTraceId(),
      timestamp: new Date(),
      action: 'verification',
      actor,
      details: verificationData,
    };

    this.auditLogs.push(log);
    this.pendingBatch.push(log);
    return log;
  }

  /**
   * Store strategy snapshot
   */
  async storeStrategySnapshot(strategy: Strategy): Promise<string> {
    try {
      this.strategies.set(strategy.id, strategy);

      // Upload to 0G Storage
      const storage = getZGStorage();
      const result = await storage.uploadStrategy(strategy, {
        strategyId: strategy.id,
        version: strategy.version,
        timestamp: new Date().toISOString(),
      });

      // Update strategy with CID
      strategy.strategyCID = result.cid;

      // Record in audit
      this.recordVerification('system', {
        type: 'strategy_snapshot',
        strategyId: strategy.id,
        cid: result.cid,
        merkleRoot: result.merkleRoot,
      });

      return result.cid;
    } catch (error) {
      console.error('Failed to store strategy snapshot:', error);
      throw error;
    }
  }

  /**
   * Retrieve strategy snapshot
   */
  async retrieveStrategySnapshot(strategyId: string): Promise<Strategy | null> {
    const cached = this.strategies.get(strategyId);
    if (cached) return cached;

    try {
      // Could retrieve from 0G Storage by CID
      return null;
    } catch (error) {
      console.error('Failed to retrieve strategy snapshot:', error);
      return null;
    }
  }

  /**
   * Get audit log by trace ID
   */
  getAuditLogByTraceId(traceId: string): AuditLog[] {
    return this.auditLogs.filter(log => log.traceId === traceId);
  }

  /**
   * Get audit logs by actor
   */
  getAuditLogsByActor(actor: string, limit: number = 100): AuditLog[] {
    return this.auditLogs
      .filter(log => log.actor === actor)
      .slice(-limit);
  }

  /**
   * Get audit logs by action
   */
  getAuditLogsByAction(action: AuditLog['action'], limit: number = 100): AuditLog[] {
    return this.auditLogs
      .filter(log => log.action === action)
      .slice(-limit);
  }

  /**
   * Generate audit report
   */
  generateAuditReport(startDate: Date, endDate: Date): Record<string, any> {
    const logs = this.auditLogs.filter(
      log => log.timestamp >= startDate && log.timestamp <= endDate
    );

    const actionCounts = {
      inference: 0,
      execution: 0,
      verification: 0,
      settlement: 0,
    };

    logs.forEach(log => {
      if (log.action in actionCounts) {
        actionCounts[log.action as keyof typeof actionCounts]++;
      }
    });

    const actors = new Set(logs.map(log => log.actor));

    return {
      startDate,
      endDate,
      totalLogs: logs.length,
      actionCounts,
      uniqueActors: actors.size,
      actors: Array.from(actors),
      generatedAt: new Date(),
    };
  }

  /**
   * Start batch processor for efficient storage
   */
  private startBatchProcessor(): void {
    this.batchTimer = setInterval(() => {
      if (this.pendingBatch.length > 0) {
        this.processBatch();
      }
    }, this.config.batchInterval);
  }

  /**
   * Process and upload batch of audit logs
   */
  private async processBatch(): Promise<void> {
    if (this.pendingBatch.length === 0) return;

    try {
      const batch = [...this.pendingBatch];
      this.pendingBatch = [];

      const storage = getZGStorage();
      const result = await storage.uploadAuditBatch(batch, {
        batchSize: batch.length,
        uploadTime: new Date().toISOString(),
      });

      console.log(`Batch uploaded: ${batch.length} logs, Merkle root: ${result.merkleRoot}`);

      // Could record on-chain if enabled
      if (this.config.enableOnChainRecording) {
        // await recordMerkleRootOnChain(result.merkleRoot);
      }
    } catch (error) {
      console.error('Failed to process audit batch:', error);
      // Restore pending batch on failure
      this.pendingBatch = this.auditLogs.slice(-this.config.batchSize!);
    }
  }

  /**
   * Force batch processing
   */
  async flushBatch(): Promise<void> {
    await this.processBatch();
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
  }
}

// Singleton instance
let auditService: AuditService | null = null;

export function initializeAudit(config?: AuditConfig): AuditService {
  if (!auditService) {
    auditService = new AuditService(config);
  }
  return auditService;
}

export function getAuditService(): AuditService {
  if (!auditService) {
    throw new Error('Audit Service not initialized. Call initializeAudit first.');
  }
  return auditService;
}

export default AuditService;
