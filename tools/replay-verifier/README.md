# TH11 Replay Verifier

本作使用 common 的流式 trace、生命周期校验、逐步比较和不可变 golden 文件。候选是当前 WASI 诊断游戏核心，不是生产浏览器 Runtime 的全状态验收。

先配置 `WASI_SDK_ROOT`，从本游戏根目录编译诊断核心：

```text
node th11_web/scripts/cpp/build.mjs
```

显式捕获原版与候选：

```text
node tools/replay-verifier/run-oracle.mjs --lane all --output artifacts/replay-verifier/oracle
node tools/replay-verifier/run-gate.mjs --capture-root artifacts/replay-verifier/oracle --report artifacts/replay-verifier/oracle-result.json
```

审查完整原版/候选结果后，才可用 `--accept-golden NEW_DIRECTORY` 建立新的基准。不能覆盖已有清单或用候选替换原版数据。

日常候选比较：

```text
node tools/replay-verifier/capture-candidate.mjs --lane quick --output artifacts/replay-verifier/candidate
node tools/replay-verifier/run-gate.mjs --lane quick --capture-root artifacts/replay-verifier/candidate --golden-root tools/replay-verifier/golden --report artifacts/replay-verifier/quick-result.json
```

quick、daily 和 oracle 的案例由语料清单决定。缺失、额外、乱序 tick 或未完成终止必须失败；拼接阶段不得跳过来源 tick。`--original-root` 可明确使用新捕获的原版目录。

已登记 Demo 和长 Replay 案例只覆盖其声明字段与生命周期；旧验收计数不自动成为当前提交结果。

本轮没有重跑原版捕获或更新 golden。普通游玩、音乐、渲染、移动设备和存档仍在各自的 Runtime/浏览器验证边界。
