# 模型、RAG、Agent，别再混着叫

适合：技术讲师与概念解释者。
用一个任务区分生成、找资料和带着工具做事。

```mermaid
mindmap
  root((模型、RAG、Agent，别再混着叫))
    模型负责生成与判断
      先看它收到什么
        提示与已有上下文
        输出是建议还是结果
      记住知识的边界
        不能把自信当依据
        需要材料时补上下文
    RAG先找相关资料
      把资料放进回答上下文
        检索与问题相关的片段
        保留出处便于回看
      检索也可能找错
        召回不足会漏信息
        材料质量影响回答
    Agent围绕任务行动
      在反馈中决定下一步
        使用工具并观察结果
        需要明确停止条件
      行动边界需要设计
        权限与人工确认
        失败后的恢复入口
    用一个例子区分
      要写一段产品说明
        模型可起草文字
        RAG补进真实产品文档
          先找相关段落
            再根据段落写说明
            未找到时不要补造规格
      要检查并修改一份文件
        Agent调用工具操作
        结果仍要独立核验
```

这是Mindbox编辑的实践范例，不是效果承诺；时间安排与检查项可按实际情况修改。

选题信号（用于说明为何选这个问题，不代表该标题的流量预测）：
- [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) · 2024-12-19
- [Stack Overflow · 2025 Developer Survey / AI](https://survey.stackoverflow.co/2025/ai) · 2025
