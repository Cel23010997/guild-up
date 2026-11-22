// Portfolio demo adapter. The original team project used Supabase and Express.
// This edition keeps task data in this browser; it makes no service requests.
const DEMO_STORAGE_KEY = 'celeste-guildup-demo-v1';
let demoData;
try { demoData = JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY)); } catch {}
if (!demoData || !Array.isArray(demoData.teams) || !Array.isArray(demoData.members) || !Array.isArray(demoData.tasks)) {
  demoData = { teams: [], members: [], tasks: [], positions: [] };
}
demoData.positions ||= [];
const demoClone = value => JSON.parse(JSON.stringify(value));
const demoId = () => crypto.randomUUID();
const demoNow = () => new Date().toISOString();
function demoSave() {
  try { localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoData)); }
  catch { document.documentElement.dataset.memoryOnly = 'true'; }
}
function demoMember(id) {
  const member = demoData.members.find(m => m.id === id);
  if (!member) throw new Error('Demo guild member not found.');
  return member;
}
async function checkLogin(memberName, teamName) {
  const team = demoData.teams.find(t => t.team_name.toLowerCase() === teamName.toLowerCase());
  if (!team) return { exists: false, teamExists: false };
  const member = demoData.members.find(m => m.team_id === team.id && m.member_name.toLowerCase() === memberName.toLowerCase());
  return member ? { exists: true, member: demoClone(member), team: demoClone(team) } : { exists: false, teamExists: true, teamId: team.id };
}
async function createTeam(teamName) {
  const team = { id: demoId(), team_name: teamName };
  demoData.teams.push(team); demoSave(); return demoClone(team);
}
async function createMember(memberName, ignoredEmail, teamId, teammates = []) {
  const member = { id: demoId(), member_name: memberName, email: 'demo@example.invalid', team_id: teamId, character_class: null, xp: 0, mood: 'fine' };
  demoData.members.push(member);
  const seedNames = teammates.length ? teammates : ['Lumi', 'Finch'];
  if (demoData.members.filter(m => m.team_id === teamId).length === 1) {
    seedNames.forEach((name, i) => demoData.members.push({ id: demoId(), member_name: name, email: 'demo@example.invalid', team_id: teamId, character_class: null, xp: i + 1, mood: i ? 'busy' : 'fine' }));
    const examples = [
      ['Plan the guild’s next quest', 'Choose a small goal for your team to work towards.', 'MED'],
      ['Sketch a friendly mascot', 'Explore three expressions for a little guild companion.', 'LOW'],
      ['Playtest the task board', 'Pick up a task, finish it in My Tasks, and earn XP.', 'HIGH']
    ];
    for (let i = 0; i < examples.length; i++) {
      const [title, description, priority] = examples[i];
      demoData.tasks.push({ id: demoId(), team_id: teamId, created_by_member_id: member.id, created_by_name: memberName, created_by_email: 'demo@example.invalid', title, description, image_index: i, deadline: null, priority, task_type: 'pickup', status: 'open', created_at: demoNow() });
    }
  }
  demoSave(); return demoClone(member);
}
async function updateCharacterClass(id, character_class) { const m = demoMember(id); m.character_class = character_class; demoSave(); return demoClone(m); }
async function updateMemberEmail(id) { return demoClone(demoMember(id)); }
async function updateMemberMood(id, mood) { const m = demoMember(id); m.mood = mood; demoSave(); return demoClone(m); }
async function upsertPosition(memberId, teamId, characterClass, x, y) {
  const row = { member_id: memberId, team_id: teamId, character_class: characterClass, x, y, updated_at: demoNow() };
  const at = demoData.positions.findIndex(p => p.member_id === memberId);
  if (at === -1) demoData.positions.push(row); else demoData.positions[at] = row;
  // Positions stay in memory; saving tasks also persists the latest position.
}
async function getTeamPositions(teamId) { return demoClone(demoData.positions.filter(p => p.team_id === teamId)); }
function subscribeToPositions() { return { close() {} }; }
async function fetchTasksByTeam(teamId) { return demoClone(demoData.tasks.filter(t => t.team_id === teamId && t.task_type === 'pickup' && t.status === 'open').reverse()); }
async function fetchPlannerUnassignedTasks(teamId) { return fetchTasksByTeam(teamId); }
async function createTask(input) {
  const task = { id: demoId(), team_id: input.teamId, created_by_member_id: input.memberId, created_by_name: input.memberName, created_by_email: 'demo@example.invalid', title: input.title, description: input.description, image_index: input.imageIndex || 0, deadline: input.deadline || null, priority: input.priority || 'MED', task_type: 'pickup', status: 'open', created_at: demoNow() };
  demoData.tasks.push(task); demoSave(); return demoClone(task);
}
async function updateTaskById(id, updates) {
  const task = demoData.tasks.find(t => t.id === id);
  if (!task) throw new Error('Task not found.');
  const allowed = ['title','description','deadline','priority','status','accepted_by_member_id','accepted_by_name','accepted_at','completed_at'];
  for (const key of allowed) if (key in updates) task[key] = updates[key];
  demoSave(); return demoClone(task);
}
async function acceptTaskById(id, memberId, memberName) {
  return updateTaskById(id, { accepted_by_member_id: memberId, accepted_by_name: memberName, accepted_at: demoNow(), status: 'in_progress' });
}
async function deleteTaskById(id) { demoData.tasks = demoData.tasks.filter(t => t.id !== id); demoSave(); }
async function fetchCupboardTasks(id) {
  return demoClone(demoData.tasks.filter(t => t.status === 'in_progress' && (t.task_type === 'personal' ? t.created_by_member_id === id : t.accepted_by_member_id === id)).reverse());
}
async function fetchTeamMemberClasses(teamId) { return Object.fromEntries(demoData.members.filter(m => m.team_id === teamId).map(m => [m.id, m.character_class])); }
async function fetchTeamMemberNames(teamId) { return Object.fromEntries(demoData.members.filter(m => m.team_id === teamId).map(m => [m.id, m.member_name])); }
async function incrementMemberXP(id, amount) { demoMember(id).xp += amount; demoSave(); }
async function createPersonalTask(input) {
  const created = await createTask(input);
  const task = demoData.tasks.find(t => t.id === created.id);
  Object.assign(task, { task_type: 'personal', status: 'in_progress', accepted_by_member_id: input.memberId, accepted_by_name: input.memberName, accepted_at: demoNow() });
  demoSave(); return demoClone(task);
}
async function fetchTeamFairness(teamId) {
  return demoData.members.filter(m => m.team_id === teamId).map(m => {
    const owned = demoData.tasks.filter(t => t.team_id === teamId && (t.task_type === 'personal' ? t.created_by_member_id : t.accepted_by_member_id) === m.id);
    return { id: m.id, member_name: m.member_name, xp: m.xp || 0, character_class: m.character_class || '', mood: m.mood || 'fine', workload_count: owned.filter(t => t.status === 'in_progress').length, completed_count: owned.filter(t => t.status === 'completed').length };
  });
}
async function sendTaskAcceptedEmail() { /* Email is not part of the local demo. */ }
function buildDemoAssignmentPlan(tasks, members) {
  const available = members.filter(m => m.mood !== 'overwhelmed');
  const pool = (available.length ? available : members).map(m => ({...m}));
  if (!pool.length) return [];
  return tasks.map(task => {
    pool.sort((a,b) => (a.workload_count || 0) - (b.workload_count || 0) || (a.xp || 0) - (b.xp || 0));
    const picked = pool[0]; picked.workload_count = (picked.workload_count || 0) + 1;
    return {task_id:task.id,recommended_member_id:picked.id,recommended_member_name:picked.member_name,reason:'Lowest available workload in the local demo.',group_label:'Guild tasks',confidence:'MEDIUM',reason_tags:['workload balance','local demo']};
  });
}
