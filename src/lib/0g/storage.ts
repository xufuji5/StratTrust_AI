import { ZgFile, Indexer } from '@0glabs/0g-ts-sdk';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

export class TrustStorage {
  private indexer: Indexer;
  
  constructor(privateKey: string, rpcUrl: string, indexerUrl: string) {
    // 根据 SDK 定义，Indexer 需要 4 个参数：url, blockchain_rpc, private_key, flow_contract
    // 注意：这里 flow_contract 地址需要根据 0G 网络的实际地址填入，暂时使用占位符或通过环境变量获取
    const flowContract = process.env.ZEROG_FLOW_CONTRACT || '0x0000000000000000000000000000000000000000';
    this.indexer = new Indexer(indexerUrl, rpcUrl, privateKey, flowContract);
  }

  // 策略快照上传（关键审计数据）
  async uploadStrategyEvidence(data: {
    signal: any;           // AI推理信号
    inputHash: string;     // 输入因子哈希
    modelVersion: string;  // 模型版本
    timestamp: number;
    teeAttestation?: string;
  }): Promise<{ rootHash: string; txHash: string }> {
    
    // 1. 构建紧凑的审计JSON（最小证据集）
    const evidence = {
      trace_id: this.generateTraceId(),
      input_hash: data.inputHash,
      model_ver: data.modelVersion,
      signal: {
        symbol: data.signal.symbol,
        action: data.signal.action,
        confidence: data.signal.confidence,
        factors_hash: this.hashObject(data.signal.factors)
      },
      timestamp: data.timestamp,
      tee_attestation: data.teeAttestation || null
    };
    
    // 2. 写入临时文件
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const tmpPath = path.join(tmpDir, `evidence_${evidence.trace_id}.json`);
    fs.writeFileSync(tmpPath, JSON.stringify(evidence));
    
    try {
      // 3. 创建0G File对象并计算Merkle Tree
      const file = await ZgFile.fromFilePath(tmpPath);
      const [tree, treeErr] = await file.merkleTree();
      if (treeErr || !tree) throw new Error(`Merkle计算失败: ${treeErr}`);
      
      const rootHash = tree.rootHash();
      if (!rootHash) throw new Error('Root hash calculation failed');
      
      // 4. 上传到0G Storage（去中心化存储）
      const [tx, uploadErr] = await this.indexer.upload(
        file,
        0 // segment index
      );
      
      if (uploadErr) throw new Error(`上传失败: ${uploadErr}`);
      
      await file.close();
      return {
        rootHash: rootHash,
        txHash: tx
      };
    } finally {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);  // 清理临时文件
      }
    }
  }

  // 验证存储数据完整性
  async verifyEvidence(rootHash: string, expectedData: any): Promise<boolean> {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const tmpPath = path.join(tmpDir, `verify_${Date.now()}.json`);
    
    try {
      const err = await this.indexer.download(rootHash, tmpPath, true); // true=验证数据
      if (err) return false;
      
      const data = JSON.parse(fs.readFileSync(tmpPath, 'utf-8'));
      return data.input_hash === expectedData.inputHash;
    } catch (e) {
      console.error('Verification failed:', e);
      return false;
    } finally {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    }
  }

  private generateTraceId(): string {
    return `st_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private hashObject(obj: any): string {
    return createHash('sha256').update(JSON.stringify(obj)).digest('hex');
  }
}
