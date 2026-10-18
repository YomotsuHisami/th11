import test from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';import{resolve}from'node:path';import{core,memory,root,report}from'./helpers.mjs';
const openResources=c=>{const raw=readFileSync(resolve(root,'../[th11] 东方地灵殿 (汉化版+日文版)/th11.dat')),data=c.allocate(raw.length),source=c.resources_create();memory(c,data,raw.length).set(raw);assert.equal(c.resources_open(source,data,raw.length),1);return{source,data};};
const heardTrack18=(c,s)=>memory(c,c.score_file_data(c.game_session_score_file(s),7)+0x26+17,1)[0];
test('TH11 game-over exit marks the results-screen track heard (begin_end latch control)',async()=>{
 const c=await core(),{source,data}=openResources(c);
 try{const s=c.game_session_create();
  try{assert.equal(c.game_session_begin(s,source,6,0,0,1,0),1);
   assert.equal(heardTrack18(c,s),0,'fresh session leaves track No.18 unheard');
   for(let i=0;i<30;++i)assert.equal(c.game_session_update(s,0,0,0,0,0,0),1);
   c.game_session_loss_probe(s);assert.equal(c.game_session_update(s,0,0,0,0,0,0),1);
   assert.equal(c.game_session_value(s,0),3,'game-over menu phase');
   assert.equal(heardTrack18(c,s),1,'death exit latches the track via PauseMenu::begin_end');
  }finally{c.game_session_delete(s);}
 }finally{c.resources_delete(source);c.release(data);}
});
test('TH11 post-ending results screen marks music-room track No.18 (th10_17) heard',async()=>{
 const c=await core(),{source,data}=openResources(c);let frames=0;
 try{const s=c.game_session_create();
  try{assert.equal(c.game_session_begin(s,source,6,0,0,1,0),1);
   const tick=(held=0)=>{assert.equal(c.game_session_update(s,held,0,0,0,0,0),1);++frames;};
   for(let i=0;i<120;++i)tick();
   c.game_session_end_probe(s,0);tick();assert.equal(c.game_session_value(s,0),5,'ending starts');
   let n=0;while(c.game_session_value(s,0)===5&&n++<24000)tick(n%17===0?1:0);
   assert.equal(c.game_session_value(s,0),0,'ending returns to title');
   const title=c.game_session_title_menu(s);assert.equal(c.title_value(title,0),14,'title opens directly on the results screen');
   assert.equal(heardTrack18(c,s),0,'the ending itself never marks the results track');
   tick();
   assert.equal(heardTrack18(c,s),1,'results entry latches the music-room heard flag for cue 17');
   report('title-results-music',{passed:true,frames,scope:'Post-ending title results entry latches the music-room heard flag for cue 17 (th10_17), mirroring the game-over begin_end latch and the original results screen (0x43f6b0 case 0 calling 0x42a150(0,0x11), which stores gamedata+0x2ddfa+17=1).'});
  }finally{c.game_session_delete(s);}
 }finally{c.resources_delete(source);c.release(data);}
});
