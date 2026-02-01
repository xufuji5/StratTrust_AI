/**
 * TEE (Trusted Execution Environment) Integration Module
 * Handles signature generation, verification, and attestation
 */

import crypto from 'crypto';
import { TEESignature, VerificationProof } from '@/types';
import { sha256, generateNonce, isValidTEESignature } from '@/utils/crypto';

export interface TEEConfig {
  serviceUrl: string;
  publicKey?: string;
  privateKey?: string;
  attestationProvider?: 'intel-sgx' | 'amd-sev' | 'arm-cca' | 'mock';
}

export interface SignatureRequest {
  data: string | Buffer;
  metadata?: Record<string, any>;
  nonce?: string;
}

export interface VerificationResult {
  valid: boolean;
  signer: string;
  timestamp: Date;
  attestationChain?: string[];
}

class TEESignatureService {
  private config: TEEConfig;
  private signatureCache: Map<string, TEESignature> = new Map();

  constructor(config: TEEConfig) {
    this.config = config;
  }

  /**
   * Generate signature for inference result
   */
  async signInferenceResult(
    inferenceData: any,
    modelHash: string,
    inputHash: string
  ): Promise<TEESignature> {
    try {
      const nonce = generateNonce();
      const timestamp = new Date();

      // Create signable message
      const message = {
        type: 'inference_result',
        modelHash,
        inputHash,
        dataHash: sha256(JSON.stringify(inferenceData)),
        timestamp: timestamp.toISOString(),
        nonce,
      };

      const messageString = JSON.stringify(message);
      const signature = this.generateSignature(messageString);

      const teeSignature: TEESignature = {
        signature,
        attestation: await this.generateAttestation(signature),
        publicKey: this.config.publicKey || 'mock_public_key',
        timestamp,
        nonce,
      };

      // Cache signature
      const cacheKey = sha256(messageString);
      this.signatureCache.set(cacheKey, teeSignature);

      return teeSignature;
    } catch (error) {
      throw new Error(`Failed to sign inference result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate signature for strategy execution
   */
  async signStrategy(strategy: any, executor: string): Promise<TEESignature> {
    try {
      const nonce = generateNonce();
      const timestamp = new Date();

      const message = {
        type: 'strategy_execution',
        strategyHash: sha256(JSON.stringify(strategy)),
        executor,
        timestamp: timestamp.toISOString(),
        nonce,
      };

      const messageString = JSON.stringify(message);
      const signature = this.generateSignature(messageString);

      return {
        signature,
        attestation: await this.generateAttestation(signature),
        publicKey: this.config.publicKey || 'mock_public_key',
        timestamp,
        nonce,
      };
    } catch (error) {
      throw new Error(`Failed to sign strategy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify a TEE signature
   */
  async verifySignature(signature: TEESignature, data: string): Promise<VerificationResult> {
    try {
      if (!isValidTEESignature(signature.signature)) {
        return {
          valid: false,
          signer: '',
          timestamp: new Date(),
        };
      }

      // const dataHash = sha256(data);
      const cacheKey = sha256(data);

      const cached = this.signatureCache.get(cacheKey);
      const isValid = cached?.signature === signature.signature;

      return {
        valid: isValid,
        signer: signature.publicKey,
        timestamp: signature.timestamp,
        attestationChain: signature.attestation ? [signature.attestation] : [],
      };
    } catch (error) {
      throw new Error(`Failed to verify signature: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create verification proof for on-chain recording
   */
  async createVerificationProof(
    input: any,
    output: any,
    modelHash: string
  ): Promise<VerificationProof> {
    try {
      const inputHash = sha256(JSON.stringify(input));
      const outputHash = sha256(JSON.stringify(output));

      const signature = await this.signInferenceResult(output, modelHash, inputHash);

      return {
        inputHash,
        outputHash,
        modelHash,
        teeSignature: signature,
        merkleProof: [],
        onChainRoot: undefined,
      };
    } catch (error) {
      throw new Error(`Failed to create verification proof: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify complete proof chain
   */
  async verifyProofChain(proof: VerificationProof, expectedOutput: any): Promise<boolean> {
    try {
      const outputHash = sha256(JSON.stringify(expectedOutput));

      if (outputHash !== proof.outputHash) {
        return false;
      }

      const verification = await this.verifySignature(
        proof.teeSignature,
        JSON.stringify({ input: proof.inputHash, output: proof.outputHash })
      );

      return verification.valid;
    } catch (error) {
      console.error('Proof chain verification failed:', error);
      return false;
    }
  }

  /**
   * Generate mock attestation (replace with real TEE attestation)
   */
  private async generateAttestation(signature: string): Promise<string> {
    const attestation = {
      type: this.config.attestationProvider || 'mock',
      version: '1.0',
      signature,
      timestamp: new Date().toISOString(),
      quotes: [], // Intel SGX quotes, AMD SEV snp reports, etc.
    };

    return `0x${sha256(JSON.stringify(attestation))}`;
  }

  /**
   * Generate mock signature (replace with real signing)
   */
  private generateSignature(data: string): string {
    // Mock: In production, use actual HSM or TEE signing
    const hash = sha256(data);
    return `0x${hash}${crypto.randomBytes(32).toString('hex')}`;
  }

  /**
   * Get attestation provider type
   */
  getAttestationProvider(): string {
    return this.config.attestationProvider || 'mock';
  }

  /**
   * Verify TEE attestation validity
   */
  async verifyAttestation(attestation: string): Promise<boolean> {
    try {
      if (!attestation.startsWith('0x')) {
        return false;
      }

      // Additional verification could be implemented
      return attestation.length > 10;
    } catch (error) {
      console.error('Attestation verification failed:', error);
      return false;
    }
  }
}

// Singleton instance
let teeService: TEESignatureService | null = null;

export function initializeTEE(config: TEEConfig): TEESignatureService {
  if (!teeService) {
    teeService = new TEESignatureService(config);
  }
  return teeService;
}

export function getTEEService(): TEESignatureService {
  if (!teeService) {
    throw new Error('TEE Service not initialized. Call initializeTEE first.');
  }
  return teeService;
}

export default TEESignatureService;
