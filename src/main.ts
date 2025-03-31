import { Client, GatewayIntentBits, Message } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

const weapons = [
    '大剣', '太刀', '片手剣', '双剣', 'ハンマー', '狩猟笛', 'ランス', 'ガンランス',
    'スラッシュアックス', 'チャージアックス', '操虫棍', 'ライトボウガン', 'ヘビィボウガン', '弓'
];

let favWeapons: string[] = [

];

client.once('ready', () => {
        console.log(client.user?.tag)
})

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return
    if (message.content === '!bukiall') {
        const weapon = weapons[Math.floor(Math.random() * weapons.length)];
        message.reply(`ギルドは「${weapon}」を用いての狩猟を要請します！`)
    }
    if (message.content === '!buki') {
        if (favWeapons.length === 0) {
            message.reply('お気に入り武器が登録されていません。 !addbuki [武器名] で追加してください');
            return;
        }
        const weapon = favWeapons[Math.floor(Math.random() * favWeapons.length)];
        message.reply(`ギルドは「${weapon}」を用いての狩猟を要請します！`)
    }
    if (message.content.startsWith('!addbuki ')) {
        const newWeapons = message.content.replace('!addbuki ', '').trim().split(/\s+/);
        const invalidWeapons = newWeapons.filter(w => !weapons.includes(w));
        const alreadyAdded = newWeapons.filter(w => favWeapons.includes(w));
        const validWeapons = newWeapons.filter(w => weapons.includes(w) && !favWeapons.includes(w));
        if (invalidWeapons.length > 0) {
            message.reply(`ギルドの認可を受けていない武器があります: ${invalidWeapons.join(', ')}`);
            return;
        }
        if (alreadyAdded.length > 0) {
            message.reply(`すでにお気に入り登録されている武器があります: ${alreadyAdded.join(', ')}`);
            return;
        }

        favWeapons.push(...validWeapons);
        message.reply(`「${validWeapons.join(', ')}」をお気に入り武器に追加しました！`);
    }
    if (message.content.startsWith('!removebuki ')) {
        const removeWeapons = message.content.replace('!removebuki ', '').trim().split(/\s+/);
        const notInFavorites = removeWeapons.filter(w => !favWeapons.includes(w));
        const validRemovals = removeWeapons.filter(w => favWeapons.includes(w));

        if (notInFavorites.length > 0) {
            message.reply(`お気に入りに登録されていない武器があります: ${notInFavorites.join(', ')}`);
            return;
        }

        favWeapons = favWeapons.filter(w => !validRemovals.includes(w));
        message.reply(`「${validRemovals.join(', ')}」をお気に入り武器から削除しました。`);
    }
    if (message.content === '!help') {
        message.reply(
            '利用可能なコマンド一覧:\n' +
            '!bukiall - ランダムな武器を選択\n' +
            '!buki - お気に入りの武器からランダムに選択\n' +
            '!addbuki [武器名1] [武器名2] ... - 武器をお気に入りに追加\n' +
            '!removebuki [武器名1] [武器名2] ... - 武器をお気に入りから削除\n' +
            '!help - コマンド一覧を表示'
        );
    }
})

client.login(process.env.TOKEN)