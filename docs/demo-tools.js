(() => {
  const bar = document.createElement('aside');
  bar.id = 'demo-bar';
  bar.innerHTML = '<a href="https://github.com/Cel23010997/guild-up">GuildUp / Celeste</a><span>Local demo · sample guild members · saved on this device</span><button id="demo-help" type="button">How to play</button><button id="demo-reset" type="button">Reset demo</button>';
  document.body.append(bar);
  const help = document.createElement('dialog');
  help.id = 'demo-help-dialog';
  help.innerHTML = '<h2>Welcome to your guild!</h2><p>Move with <b>W A S D</b>. Walk up to an object and press <b>E</b> to interact.</p><ul><li><b>Task board:</b> create or pick up a team task.</li><li><b>Cupboard:</b> manage your tasks and complete them for XP.</li><li><b>Assignment planner:</b> distribute tasks by workload.</li><li><b>Main table:</b> compare the guild’s workload and mood.</li></ul><p>This is a single-browser demo. Lumi and Finch are sample members. Online multiplayer, AI and email belong to the original full project.</p><p>No real email or account is needed.</p><form method="dialog"><button>Let’s explore</button></form>';
  document.body.append(help);
  document.getElementById('demo-help').onclick = () => help.showModal();
  document.getElementById('demo-reset').onclick = () => {
    if (confirm('Reset only your GuildUp demo tasks and guild on this device?')) { localStorage.removeItem(DEMO_STORAGE_KEY); location.reload(); }
  };
  window.addEventListener('pagehide', demoSave);
})();
