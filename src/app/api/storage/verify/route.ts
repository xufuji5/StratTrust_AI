import { NextRequest, NextResponse } from 'next/server';
import { TrustStorage } from '@/lib/0g/storage';

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const ZEROG_RPC = process.env.ZEROG_RPC_URL || 'https://evmrpc-testnet.0g.ai';
const ZEROG_INDEXER = process.env.ZEROG_INDEXER_URL || 'https://indexer-storage-testnet-turbo.0g.ai';

export async function POST(req: NextRequest) {
  try {
    const { rootHash, expectedData } = await req.json();
    const storage = new TrustStorage(PRIVATE_KEY, ZEROG_RPC, ZEROG_INDEXER);
    
    const isValid = await storage.verifyEvidence(rootHash, expectedData);
    
    return NextResponse.json({
      success: true,
      isValid
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
