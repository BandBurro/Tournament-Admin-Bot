require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, Partials } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});

// In-memory owner map: threadId -> userId who triggered the bot
const threadOwners = new Map();

client.on('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Helper: remove the bot mention from the text to derive the topic / clean question
function stripMention(text, botId) {
  if (!text) return '';
  const re = new RegExp(`<@!?${botId}>`, 'g'); // matches <@id> and <@!id>
  return text.replace(re, '').trim();
}

client.on('messageCreate', async (message) => {
  try {
    if (!message.guild || message.author.bot) return;

    const botId = client.user.id;
    const isThread =
      message.channel.type === ChannelType.PublicThread ||
      message.channel.type === ChannelType.PrivateThread;

    // --- A) We are already inside a thread ---
    if (isThread) {
      const ownerId = threadOwners.get(message.channel.id);
      // If we know who the owner is, only process messages from them
      if (ownerId && message.author.id !== ownerId) return;

      const clean = stripMention(message.content, botId) || message.content;
      await axios.post(process.env.N8N_WEBHOOK_URL, {
        content: clean,
        authorId: message.author.id,
        authorName: message.author.username,
        channelId: message.channel.id, // <-- reply will go to the thread
      });
      console.log(`↪️ Forwarded from thread ${message.channel.id}: "${clean}"`);
      return;
    }

    // --- B) Not in a thread: only react if bot is mentioned ---
    const mentioned = message.mentions.users.has(botId);
    if (!mentioned) return;

    // Topic = message without the mention, trimmed and limited to fit thread name limits
    const topicRaw = stripMention(message.content, botId);
    const topic =
      (topicRaw || `Question from ${message.author.username}`).substring(0, 90);

    // Create a public thread off this message
    const thread = await message.startThread({
      name: topic,
      autoArchiveDuration: 1440, // 24h; adjust as you like (60, 1440, 4320, 10080)
      reason: 'Q&A with bot',
    });

    // Remember who started the conversation so we only respond to them
    threadOwners.set(thread.id, message.author.id);

    // Optional: greet inside the thread
    await thread.send(
      `Hi <@${message.author.id}>! I opened this thread for your question. 👋`
    );

    // Forward the initial question to n8n, targeting the thread for replies
    const clean = topicRaw || message.content;
    await axios.post(process.env.N8N_WEBHOOK_URL, {
      content: clean,
      authorId: message.author.id,
      authorName: message.author.username,
      channelId: thread.id, // <-- IMPORTANT: replies now go in the thread
    });

    console.log(`🧵 Created thread ${thread.id} "${topic}" for ${message.author.tag}`);
  } catch (err) {
    console.error('❌ Bot error:', err.response?.data || err.message);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
