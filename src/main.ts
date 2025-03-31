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

let yfavWeapons: string[] = [

];

let wfavWeapons: string[] = [

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
    if (message.content === '!bukiy') {
        if (yfavWeapons.length === 0) {
            message.reply('お気に入り武器が登録されていません。 !addbukiy [武器名] で追加してください');
            return;
        }
        const weapon = yfavWeapons[Math.floor(Math.random() * yfavWeapons.length)];
        message.reply(`ギルドは「${weapon}」を用いての狩猟を要請します！`)
    }
    if (message.content === '!bukiw') {
        if (wfavWeapons.length === 0) {
            message.reply('お気に入り武器が登録されていません。 !addbukiw [武器名] で追加してください');
            return;
        }
        const weapon = wfavWeapons[Math.floor(Math.random() * wfavWeapons.length)];
        message.reply(`ギルドは「${weapon}」を用いての狩猟を要請します！`)
    }
    if (message.content.startsWith('!addbukiy ')) {
        const newWeapons = message.content.replace('!addbukiy ', '').trim().split(/\s+/);
        const invalidWeapons = newWeapons.filter(w => !weapons.includes(w));
        const alreadyAdded = newWeapons.filter(w => yfavWeapons.includes(w));
        const validWeapons = newWeapons.filter(w => weapons.includes(w) && !yfavWeapons.includes(w));
        if (invalidWeapons.length > 0) {
            message.reply(`ギルドの認可を受けていない武器があります: ${invalidWeapons.join(', ')}`);
            return;
        }
        if (alreadyAdded.length > 0) {
            message.reply(`すでにお気に入り登録されている武器があります: ${alreadyAdded.join(', ')}`);
            return;
        }

        yfavWeapons.push(...validWeapons);
        message.reply(`「${validWeapons.join(', ')}」をお気に入り武器に追加しました！`);
    }
    if (message.content.startsWith('!addbukiw ')) {
        const newWeapons = message.content.replace('!addbukiw ', '').trim().split(/\s+/);
        const invalidWeapons = newWeapons.filter(w => !weapons.includes(w));
        const alreadyAdded = newWeapons.filter(w => wfavWeapons.includes(w));
        const validWeapons = newWeapons.filter(w => weapons.includes(w) && !wfavWeapons.includes(w));
        if (invalidWeapons.length > 0) {
            message.reply(`ギルドの認可を受けていない武器があります: ${invalidWeapons.join(', ')}`);
            return;
        }
        if (alreadyAdded.length > 0) {
            message.reply(`すでにお気に入り登録されている武器があります: ${alreadyAdded.join(', ')}`);
            return;
        }

        wfavWeapons.push(...validWeapons);
        message.reply(`「${validWeapons.join(', ')}」をお気に入り武器に追加しました！`);
    }
    if (message.content.startsWith('!removebukiy ')) {
        const removeWeapons = message.content.replace('!removebukiy ', '').trim().split(/\s+/);
        const notInFavorites = removeWeapons.filter(w => !yfavWeapons.includes(w));
        const validRemovals = removeWeapons.filter(w => yfavWeapons.includes(w));

        if (notInFavorites.length > 0) {
            message.reply(`お気に入りに登録されていない武器があります: ${notInFavorites.join(', ')}`);
            return;
        }

        yfavWeapons = yfavWeapons.filter(w => !validRemovals.includes(w));
        message.reply(`「${validRemovals.join(', ')}」をお気に入り武器から削除しました。`);
    }
    if (message.content.startsWith('!removebukiw ')) {
        const removeWeapons = message.content.replace('!removebukiw ', '').trim().split(/\s+/);
        const notInFavorites = removeWeapons.filter(w => !wfavWeapons.includes(w));
        const validRemovals = removeWeapons.filter(w => wfavWeapons.includes(w));

        if (notInFavorites.length > 0) {
            message.reply(`お気に入りに登録されていない武器があります: ${notInFavorites.join(', ')}`);
            return;
        }

        wfavWeapons = wfavWeapons.filter(w => !validRemovals.includes(w));
        message.reply(`「${validRemovals.join(', ')}」をお気に入り武器から削除しました。`);
    }
    if (message.content === '!help') {
        message.reply(
            '利用可能なコマンド一覧:\n' +
            '!bukiall - ランダムな武器を選択\n' +
            '!bukiy - yのお気に入りの武器からランダムに選択\n' +
            '!bukiw - わらびのお気に入りの武器からランダムに選択\n' +
            '!addbukiy [武器名1] [武器名2] ... - 武器をyのお気に入りに追加\n' +
            '!addbukiw [武器名1] [武器名2] ... - 武器をわらびのお気に入りに追加\n' +
            '!removebukiy [武器名1] [武器名2] ... - 武器をyのお気に入りから削除\n' +
            '!removebukiw [武器名1] [武器名2] ... - 武器をわらびのお気に入りから削除\n' +
            '!help - コマンド一覧を表示'
        );
    }
})

client.login(process.env.TOKEN)