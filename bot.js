console.log("Conectando...")
const Discord = require('discord.js');
const jimp = require('jimp');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const bot = new Discord.Client({fetchAllMembers: true});

const PREFIX = "!";
const COR = "#d885db";
const LOGO = "";

const youtube = new YouTube(process.env.GOOGLE_API_KEY);

const queue = new Map();

bot.login(process.env.TOKEN);

//ready & Gamer bot//
bot.on("ready", async => {
    console.log(`${bot.user.username} Conectado com sucesso!`)
    console.log(`${bot.user.id}`)
    bot.user.setPresence({ status: 'STREAMING', game: { name: `valleyshop.com.br`, url: "https://www.twitch.tv/gustavoluii"}});
});

bot.on("guildMemberAdd", member => {
    console.log(`${member.user.username} entrou no servidor.`);
    var role = member.guild.roles.find("name", "👤 Membro");
    member.addRole(role)
});

//commands & events//
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;


    let prefix = PREFIX;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === `${prefix}ping`) {
        if (!message.member.hasPermission("ADMINISTRATOR"));
        message.channel.send(`:exclamation:| Meu ping está ${Date.now() - message.createdTimestamp} ms.`)
        
    }
    
        if(cmd === `${prefix}a`){
        if (message.member.hasPermission("ADMINISTRATOR")){
        message.channel.send(new Discord.RichEmbed().setColor(COR).setDescription("**Está com problemas ou dúvidas? clique na reação que deseja e aguarde o suporte.**\n\n<:Steve:510973155548856330> - Problemas com a sua conta.\n<:Boleto:510970296510054410> - Problemas com compras\n<:Cliente:510970368534773781> Solicitar TAG cliente.\n<:form:496404450286632960> Outras dúvidas.")).then(async msg => {
            const emoji = bot.emojis.find(c => c.name == "Steve");
            const emoji2 = bot.emojis.find(c => c.name == "Boleto");
            const emoji3 = bot.emojis.find(c => c.name == "Cliente");
            const emoji4 = bot.emojis.find(c => c.name == "form");
            await msg.react(emoji)
            await msg.react(emoji2)
            await msg.react(emoji3)
            await msg.react(emoji4)
            const collector = msg.createReactionCollector((r, u) => (r.emoji.name === "Steve", "Boleto", "Cliente", "form" && u.id === message.author.id))
            collector.on("collect", async r => {
                let title
                switch (r.emoji.name) {
                    case "Steve":
                        title = "Conta"
                        break
                    case "Boleto":
                        title = "Pagamentos"
                        break
                    case "Cliente":
                        title = "Cliente"
                        break
                    case "form":
                        title = "Dúvidas"
                        break
                }
                let category = message.guild.channels.find(c => c.name === "tickets")
                if (!category || category.type !== "category")
                    category = await message.guild.createChannel("tickets", "category")
                let channel = await message.guild.createChannel(`ticket-${title}`, "text", [{
                    id: bot.user.id,
                    allowed: ["VIEW_CHANNEL", "MANAGE_CHANNELS"]
                }, {
                    id: message.author.id,
                    allowed: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }, {
                    id: message.guild.roles.find(c => c.name === "👤 Suporte").id,
                    allowed: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                }, {
                    id: message.guild.defaultRole.id,
                    denied: Discord.Permissions.ALL
                }])
                await channel.setParent(category.id)
            })
        })
    }
}
    
    if(cmd === `${prefix}fecharticket`){
        if (message.member.hasPermission("MANAGE_MESSAGES")){
        message.channel.delete();
        }
    }
    
    if(cmd === `${prefix}skin`){
        let reason = args.slice(0).join(' ');
        if (reason.length < 1) return message.reply("`❌ Use: !skin <nick>`");

        let skinembed = new Discord.RichEmbed()
        .setImage(`https://mc-heads.net/body/${args[0]}`)
        .setColor(COR)
        message.channel.send(skinembed);

    }

    if(cmd === `${prefix}head`){
        let reason = args.slice(0).join(' ');
        if (reason.length < 1) return message.reply("`❌ Use: !head <nick>`");

        let skinembed = new Discord.RichEmbed()
        .setImage(`https://mc-heads.net/head/${args[0]}`)
        .setColor(COR)
        message.channel.send(skinembed);

    }

    if(cmd === `${prefix}avatar`){
        let reason = args.slice(0).join(' ');
        if (reason.length < 1) return message.reply("`❌ Use: !avatar <nick>`");

        let skinembed = new Discord.RichEmbed()
        .setImage(`https://mc-heads.net/avatar/${args[0]}`)
        .setColor(COR)
        message.channel.send(skinembed);

    }
    
        if(cmd === `${prefix}ban`){
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.channel.send("`❌ Membro não encontrado`").then(msg => msg.delete(10000));
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("`❌ Você não tem permissão!`");
        if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("`❌ Eu não posso banir essa pessoa.`");
     
        let banEmbed = new Discord.RichEmbed()
        .setThumbnail(bUser.user.displayAvatarURL)
        .addField("`👤 | Membro Banido:`", `${bUser}`, true)
        .addField("`👨‍💼 | Banido por:`", `<@${message.author.id}>`, true)
        .addField("`📦 | Membro ID:`", `${bUser.id}`, true)
        .addField("`📋 | Banido no canal:`", `${message.channel}`, true)
        .addField("`📂 | Motivo:`", `${bReason}`, true)
        .setColor("#b70f0f")
     
        let incidentchannel = message.guild.channels.find(c => c.name == "🔴punições");
        if(!incidentchannel) return message.channel.send("`❌ Não foi possível encontrar o canal de punições.`");
        
        message.delete();
        message.guild.member(bUser).ban(bReason);
        incidentchannel.send(banEmbed);
        message.channel.send("`🔴 Membro Banido!`").then(msg => msg.delete(10000));
        return;
      }

    if(cmd === `${prefix}limpar`){

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
    if(!args[0]) return message.channel.send("Especifique quantas linhas.").then(msg => msg.delete(5000));
      message.channel.bulkDelete(args[0]).then(() => {
      message.channel.send(`Limpei ${args[0]} mensagens.`).then(msg => msg.delete(5000));
    });
    }

    if(cmd === `${prefix}anunciar`){
        if (message.member.hasPermission("ADMINISTRATOR")) {

            const text = args.slice(0.5).join(" ");
             if (text.length < 0.5) return message.channel.send("Você precisa por alguma mensagem!").then((value) => {
               setTimeout(() => {
                    value.delete();
                }, 3000);
            });
            const embed = new Discord.RichEmbed()
            .setColor(COR)
            .setAuthor(`Anúncio - ${message.guild.name}`, "https://i.imgur.com/qX4nK3l.gif")
            .setFooter(`Anúncio feito por: ${message.author.username}`, message.member.user.displayAvatarURL)
            .setTimestamp(new Date())
            .setDescription(text);
            message.channel.send("@everyone")
            message.delete().catch();
            message.channel.send({embed}).then(msg=> {
            msg.react('📢');
                
          });
        }
    }

    if(cmd === `${prefix}votação`){
        if (message.member.hasPermission("ADMINISTRATOR")) {
            const text = args.slice(0.5).join(" ");
             if (text.length < 0.5) return message.channel.send("Você precisa por alguma mensagem!").then((value) => {
               setTimeout(() => {
                    value.delete();
                }, 5000);
            });
            const embed = new Discord.RichEmbed()
            .setColor(COR)
            .setAuthor("Votação:", `https://i.imgur.com/DRE2Syf.gif`)
            .setFooter(`Votação iniciada por: ${message.author.username}`,message.member.user.displayAvatarURL)
            .setDescription(text);
            message.delete().catch();
            message.channel.send("@everyone")
            let msg = await message.channel.send({embed})
            await msg.react('👍');
            await msg.react('👎');

        }
    }

    if(cmd === `${prefix}mute`){
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("❌ | Você não tem permissão!")
        
        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!toMute) return message.channel.sendMessage("Você não especificou o membro.");
    
        let role = message.guild.roles.find(r => r.name === "🔇 Mutado");
        if(!role) {
          try{
            role = await message.guild.createRole({
              name: "🔇 Mutado",
              color: "#030303",
              permissions: []
            });
    
            message.guild.channels.forEach(async (channel, id) => {
              await channel.overwritePermissions(role, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
               });
            });
          } catch(e) {
              console.log(e.stack);
          }
        }
      if(toMute.roles.has(role.id)) return message.channel.sendMessage("Membro mutado com sucesso.");
      
      await toMute.addRole(role);
      message.channel.sendMessage("🔇 | Membro Mutado!");
      
        return;
    }
    
    if(cmd === `${prefix}cliente`) { 
        if(!message.member.hasPermission("MANAGE_ROLES")) return;
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!rMember) return message.reply("`❌ Não foi possível encontrar esse usuário.`").then(a=>a.delete(5000));
        let gRole = message.guild.roles.find(c => c.name == `💸 Clientes`);
  
        if(rMember.roles.has(gRole.id)) return message.reply("`❌ Esse membro já possui um cargo.`").then(a=>a.delete(5000));
        await(rMember.addRole(gRole.id));
        message.delete();
        message.channel.send(`\`⭐ | ${rMember.user.username} Foi definido como 💸 Cliente!\``); //.then(a=>a.delete(15000));
  
        try{
            let msg = new Discord.RichEmbed()
            .setDescription("Parabéns! Agora você é um `💸 Cliente` em nossa loja :slight_smile:\n\n:tickets: **__Referências__**:\nAgora você pode deixar seu opinião em nosso canal de referências contando como foi sua experiência com nossa loja :wink:\n\n:star: **__Privilégios:__**\nAgora você possui acesso ao nosso canal de chat/voz e ao nosso Discord exclusivo para clientes!\n\n<:checklist:497189747865944074> **__Informações:__**\n**Site:** [__valleyshop.com.br__](https://valleyshop.com.br/)\n**Twitter:** [__@LojaValleyShop__](https://twitter.com/lojaValleyShop)\n**Discord Clientes:** __https://discord.gg/7E8MMnk__")
            .setColor(COR)
            await rMember.send(msg)
        }catch(e){
            message.channel.send(` `)
        }
  
        return;
    }


    if(cmd === `${prefix}cargo`){ 
      if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("`❌ Você não tem permissão!`");
      let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
      if(!rMember) return message.reply("`❌ Membro não encontrado`");
      let role = args.join(" ").slice(22);
      if(!role) return message.reply("`❌ Informe o cargo!`");
      let gRole = message.guild.roles.find(c => c.name == role);
      if(!gRole) return message.reply("`❌ Eu não encontrei esse cargo.`");
    
      if(rMember.roles.has(gRole.id)) return message.reply("`❌ Esse membro já possui esse cargo.`");
      await(rMember.addRole(gRole.id));
      message.channel.send("`✅ Cargo definido com sucesso!`");
    
      try{
        await rMember.send("Parabéns, agora você possui o cargo `" + gRole.name +"` em nosso Discord.")
      }catch(e){
        message.channel.send()
      }
    
      return;
    }

    if(cmd === `${prefix}testeban`){
        if(message.author.id !== "231611977053503488") return;
        let testeban = new Discord.RichEmbed()
        .setThumbnail(message.author.displayAvatarURL)
        .addField("`👤 | Membro Banido:`", `<@231611977053503488>`, true)
        .addField("`👨‍💼 | Banido por:`", `<@231611977053503488>`, true)
        .addField("`📦 | Membro ID:`", `231611977053503488`, true)
        .addField("`📋 | Banido no canal:`", `${message.channel}`, true)
        .addField("`📂 | Motivo:`", `Estou testando! isso é apenas uma mensagem de teste.`, true)
        .setColor("#b70f0f")
        message.channel.send(testeban);
    
    }




});

function clean(text) {
    if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
    return text;
    }
    
    bot.on("message", message => {
    const args = message.content.split(" ").slice(1);
    
    if (message.content.startsWith(`${PREFIX}eval`)) {
    if(message.author.id !== "231611977053503488") return;
    try {
    const code = args.join(" ");
    let evaled = eval(code);
    
    if (typeof evaled !== "string")
    evaled = require("util").inspect(evaled);
    
    message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
    }
    });


var Jimp = require("jimp");
bot.on("guildMemberAdd", async (member) => {
    Jimp.read("https://i.imgur.com/R7CNKJL.png")
        .then(function (image) {
            Jimp.read("https://i.imgur.com/R7CNKJL.png")
                .then(function (image2) {
                     Jimp.loadFont("fonte.fnt")
                        .then(function (font) {
                            Jimp.read(member.user.displayAvatarURL)
                            .then(function (avatar) {
                                    avatar.resize(210, 210);
                                    image.composite(avatar, 450, 75);
                                    image.composite(image2, 0, 0);
                                    image.print(font, 395, 335, `${member.user.tag}`);
                                    image.getBuffer(Jimp.MIME_PNG, (error, buffer) => {
                                        bot.channels.get("502671445701165082").send({
                                                files: [{
                                                    name: "img.png"
                                                    , attachment: buffer
                        }]
                                            });
                                    });
                                
                                });
                        });
                });
        });
    });



    bot.on('warn', console.warn);

    bot.on('error', console.error);
    
    bot.on('ready', () => console.log('Função de música funcionando!'));
    
    bot.on('disconnect', () => console.log('Eu apenas desconectei, mais já estou reconectando agora...'));
    
    bot.on('reconnecting', () => console.log('Estou me reconectando agora!'));
    
    bot.on('message', async msg => { // eslint-disable-line
        if (msg.author.bot) return undefined;
        if (!msg.content.startsWith(PREFIX)) return undefined;
    
        const args = msg.content.split(' ');
        const searchString = args.slice(1).join(' ');
        const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
        const serverQueue = queue.get(msg.guild.id);
    
        let command = msg.content.toLowerCase().split(' ')[0];
        command = command.slice(PREFIX.length)
    
        if (command === `play`) {
            const voiceChannel = msg.member.voiceChannel;
            if (!voiceChannel) return msg.channel.send("`❌ Você não está em um canal de voz`");
        //	const permissions = voiceChannel.permissionsFor(msg.Client.user);
        //	if (!permissions.has('CONNECT')) {
        //		return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        //	}
        //	if (!permissions.has('SPEAK')) {
        //		return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
        //	}
    
            if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                const playlist = await youtube.getPlaylist(url);
                const videos = await playlist.getVideos();
                for (const video of Object.values(videos)) {
                    const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                    await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
                }
                return msg.channel.send(`✅ Playlist: **${playlist.title}** foi adicionado à lista!`);
            } else {
                try {
                    var video = await youtube.getVideo(url);
                } catch (error) {
                    try {
                        var videos = await youtube.searchVideos(searchString, 10);
                        let index = 0;
                        msg.channel.send(`\`✅ RESULTADO DA PESQUISA:\`\n${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}\n`+"`Forneça um valor para selecionar um dos resultados da pesquisa que vão de 1 a 10.`");
                        // eslint-disable-next-line max-depth
                        try {
                            var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                                maxMatches: 1,
                                time: 20000,
                                errors: ['time']
                            });
                        } catch (err) {
                            console.error(err);
                            return msg.channel.send("`❌ Você não respondeu a Seleção de músicas e o tempo acabou.`");
                        }
                        const videoIndex = parseInt(response.first().content);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    } catch (err) {
                        console.error(err);
                        return msg.channel.send("`❌ Não consegui obter nenhum resultado de pesquisa.`");
                    }
                }
                return handleVideo(video, msg, voiceChannel);
            }
        } else if (command === 'skip') {
            if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("`❌ Você não pode pular músicas!`");
            if (!msg.member.voiceChannel) return msg.channel.send("`❌ Você não está em um canal de voz`");
            if (!serverQueue) return msg.channel.send("`❌ Não há nada tocando.`");
            serverQueue.connection.dispatcher.end('O comando Skip foi usado!');
            return undefined;
        } else if (command === 'stop') {
            if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("`❌ Você não pode pular músicas!`");
            if (!msg.member.voiceChannel) return msg.channel.send("`❌ Você não está em um canal de voz`");
            if (!serverQueue) return msg.channel.send("`❌ Não há nada tocando`");
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end('O comando de parada foi usado!');
            return undefined;
        } else if (command === 'volume') {
            if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("`❌ Você não pode pular músicas!`");
            if (!msg.member.voiceChannel) return msg.channel.send("`❌ Você não está em um canal de voz`");
            if (!serverQueue) return msg.channel.send('Não há nada Tocando.');
            if (!args[1]) return msg.channel.send(`O volume atual é: **${serverQueue.volume}**`);
            serverQueue.volume = args[1];
            serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
            return msg.channel.send(`Eu ajustei o volume para: **${args[1]}**`);
        } else if (command === 'np') {
            if (!serverQueue) return msg.channel.send('Não há nada Tocando.');
            return msg.channel.send(`🎶 Tocando agora: **${serverQueue.songs[0].title}**`);
        } else if (command === 'queue') {
            if (!serverQueue) return msg.channel.send('Não há nada Tocando.');
            return msg.channel.send(`__**Lista de Músicas:**__\n${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}\n\n**Tocando agora:** ${serverQueue.songs[0].title}`);
        } else if (command === 'pause') {
            if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("`❌ Você não pode pular músicas!`");
            if (serverQueue && serverQueue.playing) {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                return msg.channel.send('⏸ Música pausada!');
            }
            return msg.channel.send('Não há nada Tocando.');
        } else if (command === 'resume') {
            if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("`❌ Você não pode pular músicas!`");
            if (serverQueue && !serverQueue.playing) {
                serverQueue.playing = true;
                serverQueue.connection.dispatcher.resume();
                return msg.channel.send('▶ Música não está mais pausada!');
            }
            return msg.channel.send('Não há nada Tocando.');
        }
    
        return undefined;
    });
    
    async function handleVideo(video, msg, voiceChannel, playlist = false) {
        const serverQueue = queue.get(msg.guild.id);
        console.log(video);
        const song = {
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
        };
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: msg.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            queue.set(msg.guild.id, queueConstruct);
    
            queueConstruct.songs.push(song);
    
            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(msg.guild, queueConstruct.songs[0]);
            } catch (error) {
                console.error(`Eu não pude entrar no canal de voz: ${error}`);
                queue.delete(msg.guild.id);
                return msg.channel.send(`Eu não pude entrar no canal de voz: ${error}`);
            }
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            if (playlist) return undefined;
            else return msg.channel.send(`✅ **${song.title}** foi adicionado à Lista!`);
        }
        return undefined;
    }
    
    function play(guild, song) {
        const serverQueue = queue.get(guild.id);
    
        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
        console.log(serverQueue.songs);
    
        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', reason => {
                if (reason === 'O fluxo não está gerando com rapidez suficiente.') console.log('Song ended.');
                else console.log(reason);
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    
        serverQueue.textChannel.send(`🎶 Tocando: **${song.title}**`);
    }
