const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const source = fs.readFileSync(require('node:path').join(__dirname, '../docs/demo-store.js'), 'utf8');
function store(saved = new Map()) {
  const ctx = vm.createContext({ crypto: webcrypto, localStorage: {getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)}, document:{documentElement:{dataset:{}}}, fetch:()=>{throw new Error('Network access is forbidden in this demo.');} });
  vm.runInContext(source, ctx);
  return {ctx, saved};
}
test('a visitor can pick up, complete and persist tasks without entering real contact details', async () => {
  const {ctx, saved} = store();
  const team = await ctx.createTeam('Test guild');
  const member = await ctx.createMember('Guest', 'must-not-be-stored@example.com', team.id);
  const tasks = await ctx.fetchTasksByTeam(team.id);
  assert.equal(tasks.length, 3);
  await ctx.acceptTaskById(tasks[0].id, member.id, member.member_name, 'must-not-be-stored@example.com');
  assert.equal((await ctx.fetchCupboardTasks(member.id)).length, 1);
  assert.equal((await ctx.fetchTeamFairness(team.id)).find(m=>m.id===member.id).workload_count, 1);
  await ctx.updateTaskById(tasks[0].id, {status:'completed'});
  await ctx.incrementMemberXP(member.id, 1);
  const restored = store(saved).ctx;
  assert.equal((await restored.fetchCupboardTasks(member.id)).length, 0);
  const stats = (await restored.fetchTeamFairness(team.id)).find(m=>m.id===member.id);
  assert.equal(stats.xp, 1); assert.equal(stats.completed_count, 1);
  assert.equal([...saved.values()].join('').includes('must-not-be-stored'), false);
  assert.equal((await restored.checkLogin('guest','test GUILD')).exists, true);
});
test('personal tasks remain separate from pickup tasks and can be edited or deleted', async () => {
  const {ctx} = store();
  const t = await ctx.createTeam('Solo');
  const m = await ctx.createMember('Player', '', t.id);
  const task = await ctx.createPersonalTask({teamId:t.id, memberId:m.id, memberName:m.member_name, title:'Personal', description:'Local only'});
  assert.equal((await ctx.fetchTasksByTeam(t.id)).some(x=>x.id===task.id), false);
  assert.equal((await ctx.fetchCupboardTasks(m.id)).length, 1);
  await ctx.updateTaskById(task.id, {title:'Updated'});
  assert.equal((await ctx.fetchCupboardTasks(m.id))[0].title, 'Updated');
  await ctx.deleteTaskById(task.id);
  assert.equal((await ctx.fetchCupboardTasks(m.id)).length, 0);
});
test('the local planner spreads tasks and avoids overwhelmed sample members', () => {
  const {ctx}=store();
  const plan=ctx.buildDemoAssignmentPlan([{id:'t1'},{id:'t2'},{id:'t3'}],[{id:'a',member_name:'A',workload_count:0,mood:'fine',xp:0},{id:'b',member_name:'B',workload_count:0,mood:'fine',xp:1},{id:'c',member_name:'C',workload_count:0,mood:'overwhelmed',xp:0}]);
  assert.equal(plan.length,3);assert.equal(plan.some(p=>p.recommended_member_id==='c'),false);assert.equal(new Set(plan.map(p=>p.recommended_member_id)).size,2);
});
