# TH11 维护指南

## 职责与依赖

`th11_web/cpp/game/` 拥有本作游戏对象、固定逻辑步、菜单、Replay 和资源语义。平台适配提供渲染、输入、音频与文件访问。公共算法来自本作 `third_party/eagler-common` 的 Git 锁定；主项目根 common 更新不会自动改变这里的依赖。

游戏仓库只交付 Runtime。Web 页面、资源安装、房间界面和站点组装统一由主项目维护，不恢复旧 `launcher/` 副本。

## 构建输入与输出

实际入口是 `portable/build.mjs`。建议从主项目使用 `npm run runtime -- th11`，显式提供 Emscripten、Python、字体和资源；本地路径不提交到源码。普通构建及目录 Runtime 通过主项目登记的 build/package 链生成，打包核对实际文件清单。

项目默认 Runtime 输出位于 dist/runtime/th11/<variant>/。编译中间产物仍由本作脚本管理，最终受管目录以暂存、验证、切换的方式更新。

## 本轮验证

普通源码构建、目录 Runtime 打包与验证通过；本轮未重跑多人分支和全流程游玩。

## 多人与诊断

多人实现来自单独的已准备源码，主项目构建必须显式传 `--variant multiplayer --source "<SOURCE>"`。不会自动选择旁边的 worktree，也不会把普通分支标成多人已验收。

## 练习、翻译与 Replay

练习选项、章节定位、重开和 Replay 扩展属于本作生命周期。语言静态包由 Web 准备，游戏读取已挂载资源；构建成功不证明所有文本布局和对话流程。

[Replay Verifier](../tools/replay-verifier/README.md) 使用 WASI 诊断核心。它比较已声明字段，不等同于生产浏览器 Runtime 全内存或渲染一致。本轮没有替换原版 golden。

## 维护顺序

先复现问题并确定状态所有者，修改最小职责边界，再执行对应原生、Runtime 和浏览器验证。升级 common 时记录实际 gitlink 和影响的接口。跨作品抽取需核对实现、ABI 和消费者，不因文件同名就共用。

项目[能力进度](https://github.com/YomotsuHisami/eagler-touhou/blob/main/docs/TOUHOU_PROGRESS.md)区分实现、构建和实测。[输入与 Replay](https://github.com/YomotsuHisami/eagler-touhou/blob/main/docs/playbooks/input-replay.md)、[多人联机](https://github.com/YomotsuHisami/eagler-touhou/blob/main/docs/playbooks/multiplayer.md)说明进一步验证。

## 工具与回归关注点

`th08_web/package.json` 目前只保存被原版字体等诊断脚本消费的工具依赖；其中指向缺失 TH08 文件的命令已移除，不是另一部游戏的可用工程入口。该历史目录命名仍可在完成消费者迁移后整理。

符卡奖励/历史等 HUD 检查应同时验证游戏数据和实际绘制队列，不能只凭计分状态推断文字已经显示。旧整包校验器绑定源码快照、Windows 工具目录和旧部署入口，已由主项目交付链取代。
