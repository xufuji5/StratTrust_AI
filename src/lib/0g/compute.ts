import { createZGComputeNetworkBroker } from '@0glabs/0g-serving-broker';
import { ethers } from 'ethers';
import { z } from 'zod';

// 信号输出Schema（严格类型安全）
export const MemeSignalSchema = z.object({
  symbol: z.string(),
  action: z.enum(['BUY', 'SELL', 'HOLD']),
  confidence: z.number().min(0).max(1),
  sentiment_score: z.number(),
  factors: z.array(z.object({
    name: z.string(),
    value: z.number(),
    weight: z.number()
  })),
  timestamp: z.number(),
  nonce: z.string()
});

export type MemeSignal = z.infer<typeof MemeSignalSchema>;

export class DeAIInference {
  private broker: any;
  private signer: ethers.Wallet;
  
  constructor(privateKey: string, rpcUrl: string) {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, provider);
  }

  async initialize() {
    // 初始化0G Compute Broker（去中心化AI市场）
    this.broker = await createZGComputeNetworkBroker(this.signer);
  }

  // DeAI推理：调用0G网络中的AI服务（如DeepSeek V3）
  async generateSignal(factorData: any): Promise<{
    signal: MemeSignal;
    requestId: string;
    provider: string;
    teeAttestation?: string;  // TEE可信执行证明
  }> {
    // 1. 发现可用的AI服务提供者
    const services = await this.broker.inference.listServices();
    if (!services || services.length === 0) {
      throw new Error('No AI services found in 0G Compute network');
    }
    const provider = services[0].provider; // 选择第一个可用服务
    
    // 2. 确认服务提供者（建立微支付通道）
    await this.broker.inference.acknowledgeProviderSigner(provider);
    
    // 3. 构建提示词（MEME选币专用）
    const prompt = this.buildMemePrompt(factorData);
    
    // 4. 获取请求头（含签名和支付凭证）
    const headers = await this.broker.inference.getRequestHeaders(
      provider,
      'meme-analysis',
      prompt
    );
    
    // 5. 发送推理请求到0G去中心化网络
    const response = await fetch(services[0].url, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-v3',  // 或 'gpt-oss', 'gemma'
        messages: [
          { role: 'system', content: '你是MEME币量化分析专家，返回严格JSON格式' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      })
    });
    
    const result = await response.json();
    
    // 6. 验证响应真实性（0G Compute自动处理支付和验证）
    const isValid = await this.broker.inference.processResponse(result.id);
    if (!isValid) throw new Error('AI推理结果验证失败');
    
    // 7. Zod校验（防止模型幻觉）
    const content = typeof result.choices[0].message.content === 'string' 
      ? JSON.parse(result.choices[0].message.content) 
      : result.choices[0].message.content;
      
    const signal = MemeSignalSchema.parse(content);
    
    return {
      signal,
      requestId: result.id,
      provider: provider,
      teeAttestation: result.attestation  // TEE执行证明（如可用）
    };
  }

  private buildMemePrompt(data: any): string {
    return `基于以下因子生成MEME币交易信号：
- 订单流不平衡(OIF): ${data.oif}
- 社交情绪速度: ${data.sentiment_velocity}
- 链上聪明钱流入: ${data.smart_money}
- 流动性深度: ${data.liquidity}
要求：输出JSON格式，包含symbol, action, confidence, sentiment_score, factors, timestamp, nonce`;
  }
}
