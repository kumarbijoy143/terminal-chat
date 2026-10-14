let isMicActive = false;
let isSpeakerMuted = false;
let activeBurnIntervals = {};

// Initialize on Load
document.addEventListener("DOMContentLoaded", () => {
  applyStoredStyles();
  updateSettingsSubtitles();
});

function applyStoredStyles() {
  const conf = getUserConfig();
  document.documentElement.style.setProperty("--base-chat-font", conf.fontSize + "px");
}

function updateSettingsSubtitles() {
  const conf = getUserConfig();
  
  const relaySub = document.getElementById("subRelayKey");
  if (relaySub) {
    relaySub.innerText = conf.relayKey ? `••••••••${conf.relayKey.slice(-4)}` : "Not Configured";
  }

  const vaultSub = document.getElementById("subVaultUrl");
  if (vaultSub) {
    vaultSub.innerText = conf.vaultUrl ? "Connected (Script Vault)" : "Not Configured";
  }

  const fontSub = document.getElementById("subFontSize");
  if (fontSub) {
    fontSub.innerText = `${conf.fontSize}px`;
  }
}

// PUBG-Style Mic Toggle
function toggleMic() {
  isMicActive = !isMicActive;
  const btn = document.getElementById("micToggleBtn");
  if (btn) {
    btn.classList.toggle("active-mic", isMicActive);
  }
}

// PUBG-Style Speaker Toggle
function toggleSpeaker() {
  isSpeakerMuted = !isSpeakerMuted;
  const btn = document.getElementById("speakerToggleBtn");
  if (btn) {
    btn.classList.toggle("muted-speaker", isSpeakerMuted);
  }
}

// Append Message with Non-Jittering Countdown
function renderMessage(text, direction = "out", messageId = Date.now()) {
  const chatStream = document.getElementById("chatStream");
  const row = document.createElement("div");
  row.className = `msg-row ${direction}`;
  row.id = `msg_${messageId}`;

  const isSoloEmoji = getUserConfig().bigEmoji && checkIsPureEmoji(text);

  const bubble = document.createElement("div");
  bubble.className = `msg-bubble ${isSoloEmoji ? "emoji-solo" : ""}`;
  
  const contentSpan = document.createElement("span");
  contentSpan.innerText = text;
  bubble.appendChild(contentSpan);

  // Tabular-safe Countdown & Timestamp
  const meta = document.createElement("div");
  meta.className = "bubble-meta";

  let remaining = getUserConfig().burnSec;
  meta.innerHTML = `
    <span class="burn-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="9"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <span class="burn-timer-digit" id="timer_${messageId}">${remaining}</span>
    </span>
  `;
  bubble.appendChild(meta);
  row.appendChild(bubble);
  chatStream.appendChild(row);

  // Auto-scroll
  chatStream.scrollTop = chatStream.scrollHeight;

  // Stable Countdown Routine
  const interval = setInterval(() => {
    remaining--;
    const digitEl = document.getElementById(`timer_${messageId}`);
    if (digitEl) {
      digitEl.innerText = remaining;
    }

    if (remaining <= 0) {
      clearInterval(interval);
      row.style.transition = "opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)";
      row.style.opacity = "0";
      row.style.transform = "scale(0.95)";
      setTimeout(() => row.remove(), 200);
    }
  }, 1000);

  activeBurnIntervals[messageId] = interval;
}

// Settings Modal Controls
function openSettings() {
  updateSettingsSubtitles();
  document.getElementById("settingsModal").style.display = "flex";
}

function closeSettings() {
  document.getElementById("settingsModal").style.display = "none";
}

function promptRelayKey() {
  const current = localStorage.getItem(KEYS.RELAY_API_KEY) || "";
  const val = prompt("Enter PieSocket Relay Key:", current);
  if (val !== null) {
    if (val.trim()) localStorage.setItem(KEYS.RELAY_API_KEY, val.trim());
    else localStorage.removeItem(KEYS.RELAY_API_KEY);
    updateSettingsSubtitles();
  }
}

function promptVaultUrl() {
  const current = localStorage.getItem(KEYS.APPS_SCRIPT_URL) || "";
  const val = prompt("Enter Google Apps Script Dead-Drop URL:", current);
  if (val !== null) {
    if (val.trim()) localStorage.setItem(KEYS.APPS_SCRIPT_URL, val.trim());
    else localStorage.removeItem(KEYS.APPS_SCRIPT_URL);
    updateSettingsSubtitles();
  }
}

function cycleFontSize() {
  const sizes = ["13", "15", "17", "19"];
  let curr = localStorage.getItem(KEYS.BASE_FONT_SIZE) || "15";
  let next = sizes[(sizes.indexOf(curr) + 1) % sizes.length];
  localStorage.setItem(KEYS.BASE_FONT_SIZE, next);
  applyStoredStyles();
  updateSettingsSubtitles();
}
