import { Composer } from "grammy";
import {
  registerMainMenuItem,
  inlineButton,
  inlineKeyboard,
} from "../toolkit/index.js";

registerMainMenuItem({ label: "⏱ Today", data: "today:show", order: 30 });

const composer = new Composer();

composer.callbackQuery("today:show", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("Today's agenda:", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back", "menu:main")]]),
  });
});

export default composer;