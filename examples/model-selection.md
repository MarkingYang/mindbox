# 选模型，别先问哪个最强

适合：AI产品经理。
先定义任务与失败代价，再用自己的样本做选择。

```mermaid
mindmap
  root((选模型，别先问哪个最强))
    先说清产品任务
      把场景写完整
        谁在什么时候用
        输入与可接受输出
      定义不能失败的事
        哪里需要人工复核
        什么情况应该拒答
    拿真实样本比较
      做一个小评测集
        常见任务与困难样本
        保留已知失败案例
          例：客服知识问答
            文档里找不到答案
              合格：说明缺失并转人工
              不合格：补出不存在的规则
            文档中存在冲突版本
              标出冲突并请求确认
      评分依据先写好
        正确性与引用依据
        格式遵循与稳定性
    看用户是否愿意等
      观察完整链路
        首字等待与总耗时
        长输入和高并发体验
      设计降级路径
        超时怎么提示
        失败能否换路径重试
    算每次成功的代价
      不要只看Token单价
        检索和工具调用
        重试与人工修复成本
      比较同一交付目标
        每份合格结果花多少
        质量不足时是否值得便宜
    给选择留退路
      小范围上线观察
        按任务追踪失败
        收集用户纠正
      保留替换能力
        模型配置与业务逻辑分开
        版本变化后重跑评测
```

这是Mindbox编辑的实践范例，不是效果承诺；时间安排与检查项可按实际情况修改。

选题信号（用于说明为何选这个问题，不代表该标题的流量预测）：
- [OpenAI · How people are using ChatGPT](https://openai.com/index/how-people-are-using-chatgpt/) · 2025-09-15
- [Stack Overflow · 2025 Developer Survey / AI](https://survey.stackoverflow.co/2025/ai) · 2025
- [Anthropic Economic Index · Cadences](https://www.anthropic.com/research/economic-index-june-2026-report) · 2026-06-26
