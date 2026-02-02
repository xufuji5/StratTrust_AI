import { NextRequest, NextResponse } from 'next/server';
import { DeAIInference } from '@/lib/0g/compute';
import { TrustStorage } from '@/lib/0g/storage';
import { ChainVerification } from '@/lib/0g/chain';
import { ethers } from 'ethers';
import AuditVerifierABI from '@/contracts/AuditVerifier.json';

// 环境配置
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const ZEROG_RPC = process.env.ZEROG_RPC_URL || 'https://evmrpc-testnet.0g.ai';
const ZEROG_INDEXER = process.env.ZEROG_INDEXER_URL || 'https://indexer-storage-testnet-turbo.0g.ai';
const CONTRACT_ADDRESS = process.env.VERIFIER_CONTRACT || '0x0000000000000000000000000000000000000000'; // 替换为实际部署的地址

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { factors } = body;

    if (!factors) {
      return NextResponse.json({ error: 'Missing factors data' }, { status: 400 });
    }

    // 1. DeAI推理 (0G Compute)
    const inference = new DeAIInference(PRIVATE_KEY, ZEROG_RPC);
    await inference.initialize();
    
    const { signal, requestId, provider, teeAttestation } = await inference.generateSignal(factors);
    
    // 2. 计算输入指纹 (Input Hash)
    const inputHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(factors)));
    
    // 3. 可信存储 (0G Storage)
    const storage = new TrustStorage(PRIVATE_KEY, ZEROG_RPC, ZEROG_INDEXER);
    const { rootHash, txHash: storageTx } = await storage.uploadStrategyEvidence({
      signal,
      inputHash,
      modelVersion: 'deepseek-v3-0g',
      timestamp: Date.now(),
      teeAttestation
    });
    
    // 4. 链上验证 (0G Chain)
    const chain = new ChainVerification(PRIVATE_KEY, ZEROG_RPC, CONTRACT_ADDRESS, AuditVerifierABI);
    const traceId = ethers.keccak256(ethers.toUtf8Bytes(requestId));
    
    const chainResult = await chain.verifySignal(
      traceId,
      inputHash,
      signal.action,
      signal.confidence,
      rootHash,
      teeAttestation || '0x'
    );
    
    // 5. 返回结果
    return NextResponse.json({
      success: true,
      signal: {
        symbol: signal.symbol,
        action: signal.action,
        confidence: signal.confidence,
        reasoning: `Analysis based on ${signal.factors.length} factors using DeAI.`
      },
      provenance: {
        traceId: requestId,
        deaiProvider: provider,
        storageRoot: rootHash,
        storageTx: storageTx,
        chainTx: chainResult.txHash,
        verifiedAt: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('DeAI Inference Pipeline Failed:', error);
    return NextResponse.json(
      { 
        error: 'Inference or Provable Storage failed', 
        detail: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
