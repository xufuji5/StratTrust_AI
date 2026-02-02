import { ethers } from 'ethers';

export class ChainVerification {
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(privateKey: string, rpcUrl: string, contractAddress: string, abi: any) {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, provider);
    this.contract = new ethers.Contract(contractAddress, abi, this.signer);
  }

  async verifySignal(
    traceId: string,
    inputHash: string,
    action: string,
    confidence: number,
    storageRoot: string,
    teeSig: string = '0x'
  ) {
    // 转换 traceId 为 bytes32 (如果已经是 hex 字符串则确保格式正确)
    const formattedTraceId = traceId.startsWith('0x') ? traceId : ethers.keccak256(ethers.toUtf8Bytes(traceId));
    const formattedInputHash = inputHash.startsWith('0x') ? inputHash : ethers.keccak256(ethers.toUtf8Bytes(inputHash));
    const formattedStorageRoot = storageRoot.startsWith('0x') ? storageRoot : `0x${storageRoot}`;

    const tx = await this.contract.verifySignal(
      formattedTraceId,
      formattedInputHash,
      action,
      Math.floor(confidence * 100), // 转换为整数百分比
      formattedStorageRoot,
      teeSig
    );

    const receipt = await tx.wait();
    return {
      txHash: tx.hash,
      status: receipt.status,
      blockNumber: receipt.blockNumber
    };
  }

  async isVerified(traceId: string): Promise<boolean> {
    const formattedTraceId = traceId.startsWith('0x') ? traceId : ethers.keccak256(ethers.toUtf8Bytes(traceId));
    return await this.contract.isVerified(formattedTraceId);
  }

  async getSignal(traceId: string) {
    const formattedTraceId = traceId.startsWith('0x') ? traceId : ethers.keccak256(ethers.toUtf8Bytes(traceId));
    return await this.contract.signals(formattedTraceId);
  }
}
