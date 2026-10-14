const PIESOCKET_CLUSTER_ID = "free.blr2";

function getStoredApiKey() {
  return localStorage.getItem("term_relay_api_key") || "";
}

function updateRelayKeyLabel() {
  const k = getStoredApiKey();
  const el = document.getElementById("current-relay-label");
  if (el) {
    el.innerText = k ? `••••••••${k.slice(-4)}` : "Not Configured";
  }
}

function configureRelayKey() {
  const current = getStoredApiKey();
  const val = prompt("Paste your PieSocket Relay Key:", current);
  if (val !== null) {
    const clean = val.trim();
    if (clean) {
      localStorage.setItem("term_relay_api_key", clean);
    } else {
      localStorage.removeItem("term_relay_api_key");
    }
    updateRelayKeyLabel();
    if (passkey) initRelay();
  }
}

function checkIsSoloEmoji(str) {
  const clean = str.trim();
  const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Presentation}){1,3}$/u;
  return emojiRegex.test(clean);
}
