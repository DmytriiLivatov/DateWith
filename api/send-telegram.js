export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { date, time, place, wish } = req.body;

    // Считываем токены из безопасных переменных окружения Vercel
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const text = 
        `💌 ПРИГЛАШЕНИЕ\n\n` +
        `📅 ${date || 'Не указана'}\n` +
        `⏰ ${time || 'Не указано'}\n` +
        `📍 ${place || 'Сюрприз'}\n` +
        `💭 ${wish || 'Без пожеланий'}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: 'Failed to send message' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}