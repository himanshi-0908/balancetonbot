require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('👋 Welcome! Send me a TON wallet address to get its balance.');
});

async function getTONBalance(address) {
    try {
        const res = await axios.get(`${process.env.TON_API}/blockchain/account/${address}`);
        if (!res.data || typeof res.data.balance !== 'number') {
            return null; // Invalid response structure
        }
        return res.data.balance / 1e9; // Convert from nanoTON to TON
    } catch (err) {
        return null; // Error fetching data
    }
}

bot.on('text', async (ctx) => {
    const address = ctx.message.text.trim();

    // Simple validation: TON addresses start with 'EQ' and have length around 48-52 chars
    if (address.startsWith('EQ') && address.length >= 48 && address.length <= 52) {
        const balance = await getTONBalance(address);
        if (balance !== null) {
            ctx.reply(`💰 Wallet Balance: ${balance} TON`);
        } else {
            ctx.reply('❌ Invalid address or error fetching data.');
        }
    } else {
        ctx.reply('❌ Please send a valid TON wallet address starting with "EQ".');
    }
});

bot.launch().then(() => {
    console.log('🤖 Bot is running...');
});
