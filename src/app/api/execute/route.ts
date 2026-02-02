import { NextRequest, NextResponse } from 'next/server';
import { ChainVerification } from '@/lib/0g/chain';
import AuditVerifierABI from '@/contracts/AuditVerifier.json';

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const ZEROG_RPC = process.env.ZEROG_RPC_URL || 'https://evmrpc-testnet.0g.ai';
const CONTRACT_ADDRESS = process.env.VERIFIER_CONTRACT || '0x0000000000000000000000000000000000000000';

export async function POST(req: NextRequest) {
  try {
    const { traceId, inputHash, action, confidence, storageRoot, teeSig } = await req.json();
    const chain = new ChainVerification(PRIVATE_KEY, ZEROG_RPC, CONTRACT_ADDRESS, AuditVerifierABI);
    
    const result = await chain.verifySignal(
      traceId,
      inputHash,
      action,
      confidence,
      storageRoot,
      teeSig
    );
    
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
