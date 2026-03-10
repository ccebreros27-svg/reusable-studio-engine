// Pause Before Open
// A restrained ritual instrument with no tracking and no permanent storage.

const PAUSE_DURATION_MS = 10_000;

// --- UI state references ---
const states = {
  entry: document.querySelector('[data-state="entry"]'),
  pause: document.querySelector('[data-state="pause"]'),
  entered: document.querySelector('[data-state="entered"]')
};

const openBtn = document.getElementById('openBtn');
const proceedAnywayBtn = document.getElementById('proceedAnywayBtn');
const continueBtn = document.getElementById('continueBtn');
const resetBtn = document.getElementById('resetBtn');
const reasonInput = document.getElementById('reasonInput');
const hint = document.getElementById('hint');
const promptHeading = document.getElementById('promptHeading');
const urgeLine = document.getElementById('urgeLine');
const chips = Array.from(document.querySelectorAll('.chip'));

// --- Runtime-only values ---
let hasWaited = false;
let choseProceedAnyway = false;
let pauseTimerId = null;
let urgeIntervalId = null;
let holdTimerId = null;

const prompts = [
  'What are you reaching for on your phone right now?',
  'What do you hope this unlock gives you in this moment?',
  'Is this a need, a habit, or an escape right now?'
];

const urgeGuides = [
  'Notice your hand, breath, and pace.',
  'Name the feeling before the feed.',
  'Give the urge one full breath.',
  'You can still continue, just not on autopilot.'
];

function setActiveState(nextState) {
  Object.values(states).forEach((section) => {
    const active = section === states[nextState];
    section.classList.toggle('is-active', active);
    section.setAttribute('aria-hidden', String(!active));
  });

  document.body.classList.toggle('pause-active', nextState === 'pause');
}

function hasValidReason() {
  return reasonInput.value.trim().length >= 5;
}

function canContinue() {
  return hasWaited && (hasValidReason() || choseProceedAnyway);
}

function refreshContinueAvailability() {
  continueBtn.disabled = !canContinue();
}

function chooseRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function startUrgeGuideCycle() {
  let index = 0;
  urgeLine.textContent = urgeGuides[index];

  urgeIntervalId = window.setInterval(() => {
    index = (index + 1) % urgeGuides.length;
    urgeLine.textContent = urgeGuides[index];
  }, 2600);
}

function stopUrgeGuideCycle() {
  if (urgeIntervalId) {
    window.clearInterval(urgeIntervalId);
    urgeIntervalId = null;
  }
}

function resetRitualState() {
  hasWaited = false;
  choseProceedAnyway = false;

  if (pauseTimerId) {
    window.clearTimeout(pauseTimerId);
    pauseTimerId = null;
  }

  if (holdTimerId) {
    window.clearTimeout(holdTimerId);
    holdTimerId = null;
  }

  stopUrgeGuideCycle();

  reasonInput.value = '';
  proceedAnywayBtn.textContent = 'Proceed Anyway';
  continueBtn.classList.remove('is-visible');
  continueBtn.classList.remove('is-holding');
  continueBtn.disabled = true;
  hint.textContent = 'Continue appears after 10 seconds. Then hold for a moment to continue.';
  promptHeading.textContent = chooseRandom(prompts);
  urgeLine.textContent = 'Notice your hand, breath, and pace.';
}

function beginPauseRitual() {
  resetRitualState();
  setActiveState('pause');
  reasonInput.focus();
  startUrgeGuideCycle();

  // Reveal continue after the full pause duration.
  pauseTimerId = window.setTimeout(() => {
    hasWaited = true;
    continueBtn.classList.add('is-visible');
    hint.textContent = 'When ready, hold Continue briefly to enter with intention.';
    refreshContinueAvailability();
    pauseTimerId = null;
  }, PAUSE_DURATION_MS);
}

function completeRitual() {
  if (!canContinue()) return;
  stopUrgeGuideCycle();
  setActiveState('entered');
}

function resetExperience() {
  resetRitualState();
  setActiveState('entry');
}

openBtn.addEventListener('click', beginPauseRitual);

reasonInput.addEventListener('input', () => {
  refreshContinueAvailability();
});

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    reasonInput.value = chip.dataset.chip || '';
    reasonInput.focus();
    refreshContinueAvailability();
  });
});

proceedAnywayBtn.addEventListener('click', () => {
  choseProceedAnyway = true;
  proceedAnywayBtn.textContent = 'Proceeding anyway';
  hint.textContent = 'Noted. Continue when the pause completes.';
  refreshContinueAvailability();
});

// Unique friction: once available, the user must hold briefly to continue.
continueBtn.addEventListener('pointerdown', () => {
  if (!canContinue()) return;

  continueBtn.classList.add('is-holding');
  holdTimerId = window.setTimeout(() => {
    completeRitual();
    holdTimerId = null;
  }, 900);
});

function cancelHold() {
  continueBtn.classList.remove('is-holding');

  if (holdTimerId) {
    window.clearTimeout(holdTimerId);
    holdTimerId = null;
  }
}

continueBtn.addEventListener('pointerup', cancelHold);
continueBtn.addEventListener('pointerleave', cancelHold);
continueBtn.addEventListener('pointercancel', cancelHold);

continueBtn.addEventListener('keydown', (event) => {
  if (!canContinue()) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;

  event.preventDefault();
  continueBtn.classList.add('is-holding');

  holdTimerId = window.setTimeout(() => {
    completeRitual();
    holdTimerId = null;
  }, 900);
});

continueBtn.addEventListener('keyup', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  cancelHold();
});

resetBtn.addEventListener('click', resetExperience);

// Set initial prompt variation.
promptHeading.textContent = chooseRandom(prompts);
