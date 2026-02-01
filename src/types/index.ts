// Factor related types
export interface FactorMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Computation metadata
  dataSource: string[]; // e.g., ['chain', 'market', 'social']
  computeFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  computeWindow: number; // in seconds
  dependencies: string[]; // IDs of dependent factors
  
  // Tags & classification
  tags: string[]; // e.g., ['sentiment', 'on-chain', 'technical']
  riskLevel: 'low' | 'medium' | 'high';
  
  // Ownership & versioning
  isPublic: boolean;
  owner: string;
  immutableHash?: string; // CID for 0G Storage
}

export interface FactorSnapshot {
  factorId: string;
  version: string;
  timestamp: Date;
  values: Record<string, number | string | boolean>;
  metadataHash: string; // SHA256 of metadata
  merkleRoot?: string; // 0G Storage root hash
}

export interface Factor {
  metadata: FactorMetadata;
  snapshots: FactorSnapshot[];
  historicalData?: Record<string, any>;
}

// AI Inference types
export interface InferenceInput {
  factors: FactorSnapshot[];
  historicalPrices: Record<string, number[]>;
  marketEnvironment: {
    volatility: number;
    fundingRate: number;
    dominance: Record<string, number>;
  };
  riskConfig: {
    maxSlippage: number;
    maxPositionSize: number;
    stopLoss: number;
    takeProfit: number;
  };
}

export interface TradeSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  weight: number; // 0-1, normalized weight in portfolio
  confidence: number; // 0-1
  reason: string;
  expectedReturn?: number;
  riskMetrics?: {
    expectedDrawdown: number;
    sharpeRatio: number;
    maxDD: number;
  };
}

export interface InferenceOutput {
  traceId: string;
  timestamp: Date;
  modelVersion: string;
  modelHash: string;
  signals: TradeSignal[];
  portfolio: {
    totalWeight: number;
    diversification: number;
    expectedReturn: number;
    expectedVolatility: number;
  };
  metadata: {
    inputHash: string;
    confidence: number;
    warnings: string[];
  };
}

// Strategy & Execution types
export interface Strategy {
  id: string;
  name: string;
  version: string;
  factorIds: string[];
  parameters: Record<string, any>;
  inference: InferenceOutput;
  createdAt: Date;
  creator: string;
  
  // On-chain & TEE
  strategyCID?: string; // 0G Storage CID
  teeSignature?: string;
  teeAttestation?: string;
  
  // Audit
  auditHash: string;
}

export interface ExecutionOrder {
  id: string;
  strategyId: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  amount: number;
  expectedPrice: number;
  maxSlippage: number;
  status: 'pending' | 'executed' | 'failed' | 'cancelled';
  txHash?: string;
  createdAt: Date;
  executedAt?: Date;
  simulationResult?: {
    success: boolean;
    outputAmount?: number;
    priceImpact?: number;
    isHoneypot?: boolean;
  };
}

export interface AuditLog {
  id: string;
  traceId: string;
  timestamp: Date;
  action: 'inference' | 'execution' | 'verification' | 'settlement';
  actor: string;
  details: Record<string, any>;
  signature?: string;
  onChainHash?: string;
}

// TEE & Verification types
export interface TEESignature {
  signature: string;
  attestation: string;
  publicKey: string;
  timestamp: Date;
  nonce: string;
}

export interface VerificationProof {
  inputHash: string;
  outputHash: string;
  modelHash: string;
  teeSignature: TEESignature;
  merkleProof?: string[];
  onChainRoot?: string;
}

// Smart Contract types
export interface ExecutionContract {
  address: string;
  network: number;
  abi: Record<string, any>;
  functions: {
    executeStrategy: string;
    recordAudit: string;
    updateRiskLimits: string;
    pause: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    timestamp: Date;
    version: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
