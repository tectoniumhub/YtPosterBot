const Discord = require("discord.js");
const config = require("./config.json");
const colour = require("colors");
const app = require("express")();
const Parser = require("rss-parser");
const fs = require("fs");

app.get("/", async (req, res) => {
 res.send('<b><a style="text-decoration: none; color: blue" href="https://dsc.gg/upm">Join My Discord Server</a></b>');
});

app.listen(3000);

let Bot = new Discord.Client({ intents: 131071 });
let parser = new Parser();

console.log(colour.bold.blue("[SETUPING]: Setting up..."));

Bot.once("ready", async () => {
 console.log(`${colour.bold.brightGreen("[INFORMATIONS]:")} ${colour.brightGreen(`${Bot.user.tag} Has Been Joined!`)}`);

 setTimeout(Bot.checked, 5 * 1000);
                             
 Bot.user.setPresence({
  activities: [
   {name: "YouTube Servers", type: Discord.ActivityType.Competing}
  ],
  status: "online"
 });
});

let servers = config.ServerId || process.env.ServerId;
let channels = config.channelId || process.env.channelId;
let DscChannels = config.DscChannelId || process.env.DscChannelId;

Bot.checked = async () => {
 let data = await parser.parseURL(`https://youtube.com/feeds/videos.xml?channel_id=${channels}`).catch((error) => console.error(error));
 let rawData = fs.readFileSync(`./video.json`);
 let jsonData = JSON.parse(rawData);

 if(jsonData.id !== data.items[0].id) {
  fs.writeFileSync("./video.json", JSON.stringify({ id: data.items[0].id }));

  let server = await Bot.guilds.fetch(Servers);
  let channel = await server.channels.fetch(DscChannels);

  var {title, link, id} = data.items[0];
  var embed = new Discord.EmbedBuilder({
   title: `${title}`,
   url: link,
   color: Discord.Colors.Red,
   image: {
    url: `https://img.youtube.com/vi/${id.slice(9)}/maxresdefault.jpg`
   }
  });

  await channel.send({ embeds: [embed] }).catch((error) => console.error(error));
 }
}

let token = config.TOKEN || process.env.TOKEN;

Bot.login(token).catch((error) => console.error(`${colour.bold.red("[ERROR]:")} ${colour.red("Please enter Your Bot Token in config.json")}`));
