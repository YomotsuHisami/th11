import assert from 'node:assert/strict';
import createUnicorn from './node_modules/@alexaltea/unicorn-js/dist/unicorn_x86.js';
import { launchBrowser } from './browser-launch.mjs';

// 验证诊断依赖实际执行；不读取原版文件，不代表游戏或画面对照通过。
const unicorn = await createUnicorn();
const cpu = new unicorn.Unicorn(unicorn.ARCH_X86, unicorn.MODE_32);
try {
  cpu.mem_map(0x1000, 0x1000, unicorn.PROT_ALL);
  cpu.mem_write(0x1000, [0xb8, 42, 0, 0, 0]);
  cpu.emu_start(0x1000, 0x1005, 0, 4);
  assert.equal(cpu.reg_read_i32(unicorn.X86_REG_EAX), 42);
} finally { cpu.close(); }

const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  await page.setContent('<button>诊断工具</button>');
  await page.locator('button').click();
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'BUTTON');
} finally { await browser.close(); }

let font = 'Windows-only; not executed';
if (process.platform === 'win32') {
  const { FontOracle, fontParams } = await import('../../th11_web/scripts/native/font-oracle.mjs');
  const oracle = new FontOracle();
  try {
    oracle.select(fontParams(16, 400));
    assert.ok(oracle.advance('Test') > 0);
    assert.ok(oracle.draw('Test').some(pixel => pixel !== 0));
    font = 'GDI offscreen drawing passed';
  } finally { oracle.close(); }
}
console.log(JSON.stringify({ emulator: 'x86 instruction passed', browser: 'focus passed', font }));
