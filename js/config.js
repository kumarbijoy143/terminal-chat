// LocalStorage Configuration Keys
const KEYS = {
  RELAY_API_KEY: "term_relay_api_key",
  APPS_SCRIPT_URL: "term_vault_url",
  BASE_FONT_SIZE: "term_font_size",
  EMOJI_SCALE: "term_emoji_scale",
  BURN_SECONDS: "term_burn_sec"
};

// Cryptographic Room Hash (Zero-Knowledge)
async function deriveRoomId(passkey) {
  const enc = new TextEncoder();
  const hashBuf = await crypto.subtle.digest("SHA-256", enc.encode(passkey + "_terminal_salt"));
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 18);
}

// WhatsApp-style standalone emoji detection
function checkIsPureEmoji(str) {
  const clean = str.trim();
  const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Presentation}){1,3}$/u;
  return emojiRegex.test(clean);
}

// Retrieve user preferences with defaults
function getUserConfig() {
  return {
    relayKey: localStorage.getItem(KEYS.RELAY_API_KEY) || "",
    vaultUrl: localStorage.getItem(KEYS.APPS_SCRIPT_URL) || "",
    fontSize: localStorage.getItem(KEYS.BASE_FONT_SIZE) || "15",
    bigEmoji: localStorage.getItem(KEYS.EMOJI_SCALE) !== "off",
    burnSec: parseInt(localStorage.getItem(KEYS.BURN_SECONDS) || "10", 10)
  };
}
