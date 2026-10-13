// Notifications de l'admin : bot Telegram (instantané) et réglages persistants.
// Le jeton du bot est un secret du Worker (TELEGRAM_BOT_TOKEN) ; le chat de l'admin est relié une fois
// depuis /admin avec un code à usage unique, puis enregistré dans la table settings.

export async function getSetting(env, key) {
  const row = await env.DB.prepare("SELECT value FROM settings WHERE key = ?1").bind(key).first();
  return row ? row.value : null;
}

export async function setSetting(env, key, value) {
  if (value === null) return env.DB.prepare("DELETE FROM settings WHERE key = ?1").bind(key).run();
  return env.DB.prepare(
    "INSERT INTO settings (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
  ).bind(key, value, Date.now()).run();
}

export async function telegram(env, method, payload) {
  if (!env.TELEGRAM_BOT_TOKEN) throw new Error("Secret TELEGRAM_BOT_TOKEN manquant");
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload || {}),
    signal: AbortSignal.timeout(8000),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(`Telegram : ${data.description || res.status}`);
  return data.result;
}

// Envoie un message à l'admin. Ne lève jamais d'erreur : une notification ratée ne doit pas bloquer le site.
export async function notifyAdmin(env, text, buttons = []) {
  try {
    const chat = await getSetting(env, "telegram_chat_id");
    if (!chat || !env.TELEGRAM_BOT_TOKEN) return false;
    const keyboard = buttons.filter((b) => /^https:\/\//.test(b.url || "")).map((b) => [{ text: b.text, url: b.url }]);
    await telegram(env, "sendMessage", {
      chat_id: chat,
      text: text.slice(0, 3900),
      disable_web_page_preview: true,
      ...(keyboard.length ? { reply_markup: { inline_keyboard: keyboard } } : {}),
    });
    return true;
  } catch (e) {
    console.error("notifyAdmin", e);
    return false;
  }
}
