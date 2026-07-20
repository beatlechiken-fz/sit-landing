interface SendTelegramParams {
  text: string;
}

export async function sendTelegramMessage({
  text,
}: SendTelegramParams): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("sendTelegramMessage: faltan TELEGRAM_BOT_TOKEN/CHAT_ID");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      },
    );

    if (!res.ok) {
      console.error("Telegram error:", await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error("sendTelegramMessage error:", err);
    return false;
  }
}
