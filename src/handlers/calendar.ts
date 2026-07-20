import { Composer } from "grammy";
import {
  registerMainMenuItem,
  inlineButton,
  inlineKeyboard,
} from "../toolkit/index.js";

registerMainMenuItem({ label: "📅 My calendar", data: "calendar:show", order: 40 });

const composer = new Composer();

composer.callbackQuery("calendar:show", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("📅 My calendar:", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back", "menu:main")]]),
  });
});

export default composer;