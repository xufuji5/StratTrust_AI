/**
 * Initialization Module
 * Initializes all services on application startup
 */

import { initializeZGStorage } from '@/lib/0g-storage';
import { initializeTEE } from '@/lib/tee-signature';
import { initializeAudit } from '@/lib/audit';
import { initializeSmartContract } from '@/lib/smart-contract';

let initialized = false;

export async function initializeServices(): Promise<void> {
  if (initialized) {
    console.log('Services already initialized');
    return;
  }

  try {
    // Initialize 0G Storage
    if (process.env['0G_STORAGE_RPC']) {
      initializeZGStorage({
        rpcUrl: process.env['0G_STORAGE_RPC']!,
        chainId: parseInt(process.env['0G_CHAIN_ID'] || '16661', 10),
        storageNodeUrl: process.env['0G_STORAGE_URL'] || 'https://storage-node.0g.ai',
      });
      console.log('✓ 0G Storage initialized');
    }

    // Initialize TEE Signature Service
    if (process.env.TEE_SERVICE_URL) {
      initializeTEE({
        serviceUrl: process.env.TEE_SERVICE_URL,
        attestationProvider: (process.env.TEE_ATTESTATION_PROVIDER as any) || 'mock',
      });
      console.log('✓ TEE Signature Service initialized');
    }

    // Initialize Audit Service
    initializeAudit({
      enableOnChainRecording: process.env.ENABLE_ON_CHAIN_RECORDING === 'true',
      batchSize: parseInt(process.env.AUDIT_BATCH_SIZE || '100', 10),
      batchInterval: parseInt(process.env.AUDIT_BATCH_INTERVAL || '600000', 10),
    });
    console.log('✓ Audit Service initialized');

    // Initialize Smart Contract Manager
    if (process.env.EXECUTION_CONTRACT_ADDRESS) {
      initializeSmartContract({
        address: process.env.EXECUTION_CONTRACT_ADDRESS,
        chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1', 10),
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || '',
        privateKey: process.env.PRIVATE_KEY,
      });
      console.log('✓ Smart Contract Manager initialized');
    }

    initialized = true;
    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize services:', error);
    throw error;
  }
}

/**
 * Check if services are initialized
 */
export function isInitialized(): boolean {
  return initialized;
}

/**
 * Get initialization status
 */
export function getInitializationStatus(): Record<string, boolean> {
  return {
    initialized,
    hasEnv: !!(process.env['0G_STORAGE_RPC'] || process.env.TEE_SERVICE_URL),
  };
}
