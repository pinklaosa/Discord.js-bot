const { Client, Intents, MessageEmbed } = require("discord.js");
const dotenv = require("dotenv");
const Canvas = require("canvas");
const axios = require("axios");
dotenv.config();
const infoCH = "961681327839645706";
const coinCH = "962329898108743720";
const testCH = "961673528166477844";
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.on("ready", () => {
  console.log("Ready");
});

// client.on("messageCreate", async (msg) => {
//   const ch = msg.guild.channels.cache.get(testCH);
//   if (msg.content == "a") {
//     const res = await axios
//       .create({
//         headers: {
//           "X-CMC_PRO_API_KEY": process.env.API_KEY,
//         },
//       })
//       .get(
//         "https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=1&&symbol=TITA&&convert=THB"
//       );
//     if (res.status == "200") {
//       console.log(res.data.data.quote.THB.price);
//     }
//   }
// });

client.on("messageCreate", async (msg) => {
  const ch = msg.guild.channels.cache.get(coinCH);
  const command = "Command | c amount coinname THB | ex. c 1 TITA THB";
  if (msg.channelId === coinCH) {
    const splitContent = msg.content.split(" ");
    if (splitContent.length == 4) {
      if (
        splitContent[0] === "c" &&
        splitContent[1] &&
        splitContent[2] &&
        splitContent[3]
      ) {
        // console.log(splitContent[0]);
        const amount = splitContent[1];
        const coinname = splitContent[2].toUpperCase();
        const fait = splitContent[3].toUpperCase();
        const resPrice = await axios
          .create({
            headers: {
              "X-CMC_PRO_API_KEY": process.env.API_KEY,
            },
          })
          .get("https://pro-api.coinmarketcap.com/v1/tools/price-conversion", {
            params: {
              amount: amount,
              symbol: coinname,
              convert: fait,
            },
          });

        const resinfo = await axios
          .create({
            headers: {
              "X-CMC_PRO_API_KEY": process.env.API_KEY,
            },
          })
          .get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/info", {
            params: {
              symbol: coinname,
            },
          });

        if (resPrice && resinfo) {
          if (resPrice.status == "200" && resinfo.status == "200") {
            const website = resinfo.data.data[coinname].urls.website[0];
            const coinName = resinfo.data.data[coinname].symbol;
            const logo = resinfo.data.data[coinname].logo;
            const name = resinfo.data.data[coinname].name;
            const address = resinfo.data.data[coinname].platform.token_address;
            const price = resPrice.data.data.quote[fait].price;
            const exampleEmbed = new MessageEmbed()
              .setColor("#0099ff")
              .setTitle(name)
              .setURL(website)
              .setAuthor({
                name: "$" + coinName,
                iconURL: logo,
              })
              .addFields(
                { name: "Coin Price (THB)", value: "" + (price / amount).toFixed(2) },
                { name: "Amount", value: amount, inline: true },
                { name: "Total Price", value: price.toFixed(2) + " " + fait, inline: true }
              )
              .setDescription(address)
              .setThumbnail(logo);
            ch.send({ embeds: [exampleEmbed] });
          } else {
            ch.send("Something went wrong");
          }
        }
      }
    } else if (msg.author.bot === false) {
      ch.send(command);
    }
  } else if (msg.channelId === testCH) {
    const ch = msg.guild.channels.cache.get(testCH);
    if (msg.author.bot === false) {
      if (msg.content) {
        
      }
    }
  }
});

client.on("guildMemberAdd", (member) => {
  const msg =
    "ยินดีต้อนรับคุณ <@" + member.id + "> เข้าเป็นสมาชิกชมรมคนชอบ... \n";
  const ch = member.guild.channels.cache.get(infoCH);
  ch.send(msg + member.user.avatarURL());
});

client.on("guildMemberRemove", (member) => {
  const msg =
    "ไม่ว่าม้าจะเร็วสักแค่ไหนสุดท้ายก็ต้องแพ้ลาเพราะ ลาไปก่อน ไว้พบกันใหม่ คุณ <@" +
    member.id +
    ">\n";
  const ch = member.guild.channels.cache.get(infoCH);
  ch.send(msg + member.user.avatarURL());
});

client.login(process.env.TOKEN);
