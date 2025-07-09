require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    await axios.post(process.env.N8N_WEBHOOK_URL, {
      content: message.content,
      authorId: message.author.id,
      authorName: message.author.username,
      channelId: message.channel.id,
    });

    console.log(`📩 Forwarded: "${message.content}"`);
  } catch (err) {
    console.error('❌ Error sending to webhook:', err.message);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
