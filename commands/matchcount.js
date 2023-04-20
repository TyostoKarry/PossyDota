const { client } = require("../index");
const db = require("../db");
const { inputCheck, userSearch, getMatchID } = require("../myFunctions");
const fs = require("fs");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const matchcountCommand = async (message) => {
  let matchID = [],
    gamesPlayed = [0, 0, 0, 0, 0, 0, 0],
    dayInSeconds = 86400,
    labelNames = [];
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let lastmonth = new Date(today.getFullYear(), today.getMonth() - 1);
  let secondsSince1970 = Math.floor(today.valueOf() / 1000);

  let params = inputCheck(message);

  if (!params) return;
  let toSearch = params[0];

  let userToSearch = userSearch(toSearch);
  if (!userToSearch) return;

  let reply = await message.reply("Fetching!");

  if (userToSearch) {
    matchID = await getMatchID(userToSearch, 1000, reply, "&date=7");
  } else {
    return reply.edit({ content: "No user found. Please link using !link." });
  }

  //Gets rid of possible undefineds from the array
  matchID = matchID.filter(function (element) {
    return element !== undefined;
  });

  // Counts the games played and adds to an array
  for (let match = 0; match < matchID.length; match++) {
    if (matchID[match].start_time < secondsSince1970 - 6 * dayInSeconds) {
    } else if (
      matchID[match].start_time <
      secondsSince1970 - 5 * dayInSeconds
    ) {
      gamesPlayed[6]++;
    } else if (
      matchID[match].start_time <
      secondsSince1970 - 4 * dayInSeconds
    ) {
      gamesPlayed[5]++;
    } else if (
      matchID[match].start_time <
      secondsSince1970 - 3 * dayInSeconds
    ) {
      gamesPlayed[4]++;
    } else if (
      matchID[match].start_time <
      secondsSince1970 - 2 * dayInSeconds
    ) {
      gamesPlayed[3]++;
    } else if (matchID[match].start_time < secondsSince1970 - dayInSeconds) {
      gamesPlayed[2]++;
    } else if (matchID[match].start_time < secondsSince1970) {
      gamesPlayed[1]++;
    } else if (matchID[match].start_time > secondsSince1970) {
      gamesPlayed[0]++;
    }
  }

  for (let day = 0; day < 7; day++) {
    if (today.getDate() - day > 0) {
      labelNames.push(today.getDate() - day + "." + (today.getMonth() + 1));
    } else if (today.getMonth > 0) {
      labelNames.push(
        lastmonth.getDate() -
          day +
          today.getDate() +
          "." +
          (lastmonth.getMonth() + 1)
      );
    } else {
      labelNames.push(31 - day + today.getDate() + ".12");
    }
  }

  if (matchID) {
    await barChartCreate(gamesPlayed, labelNames);
    const attachment = new AttachmentBuilder(
      "./assets/gamesPlayedImage.png",
      "gamesPlayedImage.png"
    );

    const gamesPlayedEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Games played in past week of user " + userToSearch.DiscordName)
      .setTimestamp();
    gamesPlayedEmbed.setImage("attachment://gamesPlayedImage.png");
    reply.edit({
      content: "",
      embeds: [gamesPlayedEmbed],
      files: [attachment],
    });
  } else
    reply.edit({
      content: "Error occured fething match data.",
    });
};

async function barChartCreate(gamesPlayed, labelNames) {
  const gamesPlayedBarChart = new ChartJSNodeCanvas({
    width: 800,
    height: 300,
  });

  const image = await gamesPlayedBarChart.renderToBuffer({
    type: "bar",
    data: {
      labels: labelNames, // generates labels
      datasets: [
        {
          label: "Games played",
          data: gamesPlayed,
          backgroundColor: "rgb(199, 10, 10)",
          borderColor: "rgb(199, 10, 10)",
        },
      ],
    },
    options: {
      scales: {
        yAxis: {
          ticks: {
            precision: 0, // Forces integer value
          },
        },
      },
    },
  });

  fs.writeFile(
    "./assets/gamesPlayedImage.png",
    image,
    "base64",
    function (err) {
      if (err) throw err;
    }
  );
}

module.exports = { matchcountCommand };
