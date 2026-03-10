const checkinForm = document.getElementById('checkinForm');
const urgeTypeSelect = checkinForm.elements.urgeType;
const otherUrgeWrap = document.getElementById('otherUrgeWrap');
const otherUrgeText = checkinForm.elements.otherUrgeText;
const intensityInput = checkinForm.elements.intensity;
const intensityValue = document.getElementById('intensityValue');

const choicePoint = document.getElementById('choicePoint');
const choiceText = document.getElementById('choiceText');
const startInterruptBtn = document.getElementById('startInterrupt');
const skipInterruptBtn = document.getElementById('skipInterrupt');

const missionSection = document.getElementById('mission');
const missionText = document.getElementById('missionText');
const missionWhy = document.getElementById('missionWhy');
const timerEl = document.getElementById('timer');
const timerProgress = document.getElementById('timerProgress');
const rerollMissionBtn = document.getElementById('rerollMission');
const missionResponseInput = document.getElementById('missionResponse');
const missionResponseCount = document.getElementById('missionResponseCount');
const saveMissionResponseBtn = document.getElementById('saveMissionResponse');
const preparedResponseEl = document.getElementById('preparedResponse');
const inspirationQuoteEl = document.getElementById('inspirationQuote');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const finishMissionBtn = document.getElementById('finishMission');

const reflectionSection = document.getElementById('reflection');
const reflectionForm = document.getElementById('reflectionForm');
const postIntensityInput = reflectionForm.elements.postIntensity;
const postIntensityValue = document.getElementById('postIntensityValue');

const statsEl = document.getElementById('stats');
const recentNotesEl = document.getElementById('recentNotes');
const clearStatsBtn = document.getElementById('clearStats');
const appMessage = document.getElementById('appMessage');
const logicTraceEl = document.getElementById('logicTrace');
const outputTraceEl = document.getElementById('outputTrace');
const phaseTraceEl = document.getElementById('phaseTrace');
const storageTraceEl = document.getElementById('storageTrace');
const reductionTraceEl = document.getElementById('reductionTrace');

const STORE_KEY = 'creativeSparkInterruptData';
const MISSION_SECONDS = 180;

const missionSupportText = {
  stress: 'Creative focus can lower stress intensity by giving your brain one clear target.',
  boredom: 'Novelty helps interrupt autopilot. Tiny weird ideas count.',
  anxiety: 'Small structure brings your attention back to what is controllable right now.',
  lonely: 'A meaningful prompt can reconnect you to your values and relationships.',
  anger: 'Channeling emotional energy into words can reduce impulsive reactions.',
  sad: 'Creative expression helps feelings move instead of getting stuck.',
  restless: 'Directed movement and pattern-making can settle nervous system overload.',
};

const prompts = {
  stress: {
    low: [
      'Sketch 10 tiny shapes that match your breathing pattern.',
      'Write a 6-line poem using only one-syllable words.',
    ],
    medium: [
      'Design a fictional app icon for calm focus using text symbols.',
      'Write a short "message from future you" 30 days ahead.',
    ],
    high: [
      'Do a 3-minute stream-of-consciousness rant, then underline one useful insight.',
      'Create a mini comic strip with 3 panels about beating this moment.',
    ],
  },
  boredom: {
    low: ['Invent a weird product name and write its one-line ad slogan.'],
    medium: ['Make a list of 12 absurd character names. Pick one and describe them.'],
    high: ['Create a 60-second spoken story where you are the hero resisting this urge.'],
  },
  anxiety: {
    low: ['List 5 things you can control in the next hour.'],
    medium: ['Write a short letter to your nervous system: "I hear you, and..."'],
    high: ['Draw a map of your anxiety monster and label its weak points.'],
  },
  lonely: {
    low: ['Write a kind text draft you could send to one safe person.'],
    medium: ['Create a gratitude haiku about someone who helped you once.'],
    high: ['Record a 1-minute voice note to yourself with encouragement.'],
  },
  anger: {
    low: ['Write a title for your feelings as if this was a movie scene.'],
    medium: ['Do a fast list: 20 words that describe your energy right now.'],
    high: ['Write an unsent letter, then convert one paragraph into a boundary statement.'],
  },
  sad: {
    low: ['List 3 tiny acts of care you can do in 10 minutes.'],
    medium: ['Write a 5-line free verse about what hurts and what helps.'],
    high: ['Create a playlist name and 5 song titles for your comeback arc.'],
  },
  restless: {
    low: ['Draw a geometric pattern for exactly 3 minutes.'],
    medium: ['Create a hand-drumming rhythm pattern on your desk and write it as symbols.'],
    high: ['Invent a 90-second movement routine and give it a name.'],
  },
};

const urgePrompts = {
  'social-scroll': {
    low: ['Write 5 post captions you would never publish but make you laugh.'],
    medium: ['Draft a 7-line “offline flex” list of things you did without posting.'],
    high: ['Create a fake feed in text: 6 posts from your future focused self.'],
  },
  substance: {
    low: ['Write a 3-line promise to your body for the next hour.'],
    medium: ['Design a mini “clean streak badge” with a name and motto.'],
    high: ['Write a scene where you fast-forward 24 hours and thank yourself.'],
  },
  gambling: {
    low: ['List 6 things in your life that are not games of chance.'],
    medium: ['Create a fake “certainty menu”: guaranteed wins in the next 20 minutes.'],
    high: ['Write a short script: “I don’t bet today because…” with 5 lines.'],
  },
  porn: {
    low: ['Write 8 words describing the type of person you are becoming.'],
    medium: ['Create a 60-second reset routine name and 4 steps.'],
    high: ['Write an unsent note to your future partner about self-respect today.'],
  },
  gaming: {
    low: ['Design a real-life side quest with 3 tiny objectives right now.'],
    medium: ['Invent a “focus character build” with 4 stats and levels.'],
    high: ['Write a boss battle narration where urge is the boss and you win phase by phase.'],
  },
  shopping: {
    low: ['Make a “want vs need” list with 3 items each.'],
    medium: ['Write an ad for something free you already own and love.'],
    high: ['Create a 5-line script for closing all tabs and keeping your money mission.'],
  },
  other: {
    low: ['Name this urge, then give it a silly mascot and weakness.'],
    medium: ['Write a one-minute action plan for this exact urge pattern.'],
    high: ['Turn this urge into a villain monologue, then write your hero comeback line.'],
  },
};

let currentCheckin = null;
let timerId = null;
let secondsLeft = MISSION_SECONDS;
let lastMission = '';
let messageTimeoutId = null;

function updateMissionResponseCount() {
  const count = missionResponseInput.value.trim().length;
  missionResponseCount.textContent = `${count} / 400`;
}

function loadData() {
  const fallback = {
    sessions: [],
    skips: 0,
    completed: 0,
    streakDays: [],
  };
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
    return parsed ? { ...fallback, ...parsed } : fallback;
  } catch {
    return fallback;
  }
}

function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function updateSystemMap({
  phase = 'idle',
  logic = 'Waiting for check-in. No rule has fired yet.',
  output = 'No choice point yet. The tool is idle.',
} = {}) {
  const data = loadData();
  const lastSession = data.sessions[data.sessions.length - 1];
  const lastDrop = lastSession
    ? Math.max(0, lastSession.preIntensity - lastSession.postIntensity)
    : null;

  phaseTraceEl.textContent = `Phase: ${phase}`;
  logicTraceEl.textContent = logic;
  outputTraceEl.textContent = output;
  storageTraceEl.textContent = `Storage: local only · sessions saved: ${data.sessions.length} · API calls: 0`;
  reductionTraceEl.textContent = lastDrop === null
    ? 'Last recorded reduction: none yet.'
    : `Last recorded reduction: ${lastDrop} point${lastDrop === 1 ? '' : 's'}.`;
}

function updateStatsUI() {
  const data = loadData();
  const total = data.sessions.length;
  const streak = getCurrentStreak(data.sessions);
  const avgDrop = data.sessions.length
    ? (data.sessions.reduce((sum, s) => sum + (s.preIntensity - s.postIntensity), 0) / data.sessions.length).toFixed(1)
    : '0.0';
  const bestDrop = data.sessions.length
    ? Math.max(...data.sessions.map((s) => Math.max(0, s.preIntensity - s.postIntensity)))
    : 0;

  const lines = [
    `Completed interrupts: ${data.completed}`,
    `Skips: ${data.skips}`,
    `Total reflections saved: ${total}`,
    `Current streak (days): ${streak}`,
    `Average urge reduction: ${avgDrop}`,
    `Best single-session reduction: ${bestDrop}`,
  ];

  statsEl.innerHTML = lines.map((line) => `<p>${line}</p>`).join('');
  renderRecentNotes(data.sessions);
}

function getCurrentStreak(sessions) {
  if (!sessions.length) return 0;

  const dayStamps = new Set(
    sessions.map((session) => {
      const d = new Date(session.completedAt || session.timestamp);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!dayStamps.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function renderRecentNotes(sessions) {
  recentNotesEl.innerHTML = '';
  const recent = sessions
    .filter((session) => session.note)
    .slice(-3)
    .reverse();

  if (!recent.length) {
    const li = document.createElement('li');
    li.textContent = 'No reflections yet. Finish one mission to log your first win.';
    recentNotesEl.append(li);
    return;
  }

  for (const session of recent) {
    const li = document.createElement('li');
    const drop = Math.max(0, session.preIntensity - session.postIntensity);
    li.textContent = `"${session.note}" (${drop} point drop)`;
    recentNotesEl.append(li);
  }
}

function showMessage(text, variant = 'info') {
  if (messageTimeoutId) {
    clearTimeout(messageTimeoutId);
    messageTimeoutId = null;
  }

  appMessage.textContent = text;
  appMessage.classList.remove('hidden', 'message-info', 'message-success');
  appMessage.classList.add(variant === 'success' ? 'message-success' : 'message-info');

  messageTimeoutId = setTimeout(() => {
    appMessage.classList.add('hidden');
  }, 2800);
}

function getPreparedResponse(checkin, responseText = '') {
  if (!checkin) {
    return 'Start a check-in and the rules engine will show the next step here.';
  }

  const text = responseText.toLowerCase();
  const urge = getUrgeLabel(checkin);

  if (text.includes('can\'t') || text.includes('cannot') || text.includes('stuck')) {
    return `You feel stuck, which is valid. Shrink the mission to 60 seconds and complete just the first step for ${urge}.`;
  }
  if (text.includes('anx') || text.includes('panic') || text.includes('stress')) {
    return `Your nervous system needs structure. Breathe 4 slow cycles, then write 3 concrete actions you can do in the next 15 minutes.`;
  }
  if (text.includes('bored') || text.includes('empty')) {
    return 'Add novelty: make your mission weird on purpose. Constraints create momentum fast.';
  }
  if (text.includes('angry') || text.includes('mad')) {
    return 'Convert heat into language: write raw for 90 seconds, then rewrite it as one boundary statement.';
  }
  if (text.includes('lonely') || text.includes('alone')) {
    return 'Connection first: draft one safe outreach message and one self-kind sentence before anything else.';
  }

  if (responseText.trim().length >= 140) {
    return `Excellent detail. Your plan is actionable. Execute step one now, then re-rate intensity after 3 minutes.`;
  }
  if (responseText.trim().length >= 50) {
    return 'Strong start. Add a clear first action + exact time (e.g., “for 3 minutes now”).';
  }
  if (checkin.intensity >= 8) {
    return `High intensity detected (${checkin.intensity}/10). Keep it tiny: one task, one timer, one completion.`;
  }

  return `Good momentum. Make your response specific to ${urge}, then complete it before opening distractions.`;
}

function getLogicTrace(checkin) {
  if (!checkin) {
    return 'Logic trace: waiting for a check-in.';
  }

  return `Logic trace: emotion pack (${checkin.emotion}) + urge pack (${getUrgeLabel(checkin)}) + energy branch (${checkin.energy}) → 3-minute mission.`;
}

function updateCoachPanel(checkin, responseText = '') {
  preparedResponseEl.textContent = getPreparedResponse(checkin, responseText);
  inspirationQuoteEl.textContent = getLogicTrace(checkin);
}

function getMissionPool(checkin) {
  const emotionPack = prompts[checkin.emotion] || prompts.stress;
  const emotionPool = emotionPack[checkin.energy] || emotionPack.medium;

  const urgePack = urgePrompts[checkin.urgeType] || urgePrompts.other;
  const urgePool = urgePack[checkin.energy] || urgePack.medium;

  return Array.from(new Set([...emotionPool, ...urgePool]));
}

function pickMission(checkin, avoidMission = '') {
  const pool = getMissionPool(checkin);
  const filtered = pool.filter((mission) => mission !== avoidMission && mission !== lastMission);
  const options = filtered.length ? filtered : pool.filter((mission) => mission !== avoidMission);
  const pickFrom = options.length ? options : pool;

  const picked = pickFrom[Math.floor(Math.random() * pickFrom.length)];
  lastMission = picked;
  return { mission: picked, poolSize: pool.length };
}

function formatTime(totalSeconds) {
  const min = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const sec = String(totalSeconds % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

function clearTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateTimerProgress() {
  const progressPct = Math.max(0, Math.min(100, (secondsLeft / MISSION_SECONDS) * 100));
  timerProgress.style.width = `${progressPct}%`;
}

function startMissionTimer() {
  clearTimer();
  secondsLeft = MISSION_SECONDS;
  timerEl.textContent = formatTime(secondsLeft);
  updateTimerProgress();
  finishMissionBtn.classList.add('hidden');
  updateSystemMap({
    phase: 'mission active',
    logic: 'Rules engine selected a mission from the current emotion, urge, and energy pool. Timer friction is running.',
    output: 'Mission prompt and countdown are visible. Reflection stays locked until the timer ends.',
  });

  timerId = setInterval(() => {
    secondsLeft -= 1;
    timerEl.textContent = formatTime(secondsLeft);
    updateTimerProgress();

    if (secondsLeft <= 0) {
      clearTimer();
      finishMissionBtn.classList.remove('hidden');
      timerEl.textContent = 'Done';
      updateTimerProgress();
      updateSystemMap({
        phase: 'reflection unlocked',
        logic: 'Timer completed. The tool now asks for post-intensity and one note about what shifted.',
        output: 'Finish button is visible and the reflection step can open.',
      });
      showMessage('Timer complete. Reflect and lock in the win.', 'success');
    }
  }, 1000);
}

function getUrgeLabel(checkin) {
  if (checkin.urgeType !== 'other') {
    return checkin.urgeType.replace('-', ' ');
  }

  return checkin.otherUrgeText || 'other urge';
}

function openChoicePoint(checkin) {
  choicePoint.classList.remove('hidden');
  missionSection.classList.add('hidden');
  reflectionSection.classList.add('hidden');

  choiceText.textContent = `You logged a ${checkin.intensity}/10 urge (${getUrgeLabel(checkin)}). Your next move matters. Choose your path.`;
  updateSystemMap({
    phase: 'choice point',
    logic: 'Check-in captured in runtime memory. The tool pauses before action and presents a visible choice.',
    output: 'Choice point is visible. User can interrupt or skip.',
  });
}

function runInterruptFlow() {
  const { mission } = pickMission(currentCheckin);
  missionText.textContent = mission;
  missionWhy.textContent = missionSupportText[currentCheckin.emotion] || missionSupportText.stress;
  missionResponseInput.value = '';
  updateMissionResponseCount();
  updateCoachPanel(currentCheckin, '');

  missionSection.classList.remove('hidden');
  reflectionSection.classList.add('hidden');

  startMissionTimer();
}

checkinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearTimer();

  const formData = new FormData(checkinForm);
  currentCheckin = {
    urgeType: String(formData.get('urgeType')),
    otherUrgeText: String(formData.get('otherUrgeText') || '').trim(),
    intensity: Number(formData.get('intensity')),
    energy: String(formData.get('energy')),
    emotion: String(formData.get('emotion')),
    timestamp: new Date().toISOString(),
  };

  openChoicePoint(currentCheckin);
  showMessage('Choice point ready. Pick your next move.', 'info');
  updateCoachPanel(currentCheckin, '');
});

startInterruptBtn.addEventListener('click', () => {
  runInterruptFlow();
});

rerollMissionBtn.addEventListener('click', () => {
  if (!currentCheckin) {
    showMessage('Start an interrupt first, then reroll missions.', 'info');
    return;
  }

  const currentMission = missionText.textContent.trim();
  const { mission, poolSize } = pickMission(currentCheckin, currentMission);
  missionText.textContent = mission;

  if (poolSize <= 1) {
    showMessage('Only one mission available for this combination right now.', 'info');
    return;
  }

  showMessage('New mission loaded.', 'success');
  updateCoachPanel(currentCheckin, missionResponseInput.value);
  updateSystemMap({
    phase: 'mission active',
    logic: 'Rules engine rerolled the mission from the same prompt pool without changing the user input.',
    output: 'A different mission is visible. Timer remains active.',
  });
});

missionResponseInput.addEventListener('input', () => {
  updateMissionResponseCount();
  updateCoachPanel(currentCheckin, missionResponseInput.value);
});

saveMissionResponseBtn.addEventListener('click', () => {
  if (!currentCheckin) {
    showMessage('Start an interrupt first, then save your mission response.', 'info');
    return;
  }

  const missionResponse = missionResponseInput.value.trim();
  currentCheckin.missionResponseDraft = missionResponse;

  if (!missionResponse) {
    showMessage('Add a little response first.', 'info');
    return;
  }

  updateCoachPanel(currentCheckin, missionResponse);
  updateSystemMap({
    phase: 'mission response saved',
    logic: 'Mission response draft is stored in runtime memory until reflection is submitted.',
    output: 'The response remains visible in the textarea for the user to revise.',
  });
  showMessage('Mission response saved.', 'success');
});

newQuoteBtn.addEventListener('click', () => {
  updateCoachPanel(currentCheckin, missionResponseInput.value);
  showMessage('Feedback refreshed.', 'info');
});

skipInterruptBtn.addEventListener('click', () => {
  const data = loadData();
  data.skips += 1;
  saveData(data);
  updateStatsUI();

  choicePoint.classList.add('hidden');
  missionSection.classList.add('hidden');
  reflectionSection.classList.add('hidden');

  updateSystemMap({
    phase: 'idle',
    logic: 'Skip count increased. The tool preserved the choice instead of forcing completion.',
    output: 'No mission or reflection is displayed.',
  });

  showMessage('Skip saved. You can restart when ready.', 'info');
});

finishMissionBtn.addEventListener('click', () => {
  reflectionSection.classList.remove('hidden');
  updateSystemMap({
    phase: 'reflection',
    logic: 'Mission phase finished. The system is waiting for post-intensity and one reflection note.',
    output: 'Reflection form is visible.',
  });
});

reflectionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!currentCheckin) return;

  const formData = new FormData(reflectionForm);
  const postIntensity = Number(formData.get('postIntensity'));
  const note = String(formData.get('note')).trim();
  const missionResponse = missionResponseInput.value.trim() || currentCheckin.missionResponseDraft || '';
  if (note.length < 8) {
    showMessage('Add a slightly longer reflection (8+ chars).', 'info');
    return;
  }

  const urgeReduced = postIntensity < currentCheckin.intensity;
  const drop = Math.max(0, currentCheckin.intensity - postIntensity);

  const data = loadData();
  data.completed += 1;
  data.sessions.push({
    ...currentCheckin,
    missionResponse,
    postIntensity,
    note,
    completedAt: new Date().toISOString(),
  });

  saveData(data);
  updateStatsUI();

  reflectionForm.reset();
  postIntensityInput.value = '4';
  postIntensityValue.textContent = '4';
  missionResponseInput.value = '';
  updateMissionResponseCount();
  currentCheckin = null;
  choicePoint.classList.add('hidden');
  missionSection.classList.add('hidden');
  reflectionSection.classList.add('hidden');
  updateSystemMap({
    phase: 'completed',
    logic: 'Session saved to local storage. Metrics and recent notes were recalculated from persistent data.',
    output: 'Progress snapshot updated with the completed reflection.',
  });

  if (urgeReduced) {
    showMessage(`Reflection saved. Big win: -${drop} intensity.`, 'success');
    updateCoachPanel(null, '');
    return;
  }

  showMessage('Reflection saved. Nice work choosing action over autopilot.', 'success');
  updateCoachPanel(null, '');
});

intensityInput.addEventListener('input', () => {
  intensityValue.textContent = intensityInput.value;
});

postIntensityInput.addEventListener('input', () => {
  postIntensityValue.textContent = postIntensityInput.value;
});

urgeTypeSelect.addEventListener('change', () => {
  const isOther = urgeTypeSelect.value === 'other';
  otherUrgeWrap.classList.toggle('hidden', !isOther);
  otherUrgeText.required = isOther;
  if (!isOther) {
    otherUrgeText.value = '';
  }
});

clearStatsBtn.addEventListener('click', () => {
  const shouldClear = confirm('Clear all saved progress and reflections?');
  if (!shouldClear) return;

  localStorage.removeItem(STORE_KEY);
  updateStatsUI();
  updateSystemMap({
    phase: 'idle',
    logic: 'Persistent data cleared. The system returned to an empty starting state.',
    output: 'Progress snapshot reset to zero saved sessions.',
  });
  showMessage('Progress cleared.', 'info');
});

urgeTypeSelect.dispatchEvent(new Event('change'));
updateTimerProgress();
updateMissionResponseCount();
updateCoachPanel(null, '');
updateStatsUI();
updateSystemMap();
