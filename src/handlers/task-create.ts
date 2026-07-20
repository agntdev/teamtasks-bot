import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { registerMainMenuItem, inlineButton, inlineKeyboard } from "../toolkit/index.js";

// Registered in create.ts with "Create task" data.

const composer = new Composer<Ctx>();

composer.callbackQuery("task:create", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("Enter a task name:", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back", "create:show")]]),
  });
  (ctx.session as any).taskCreation = (ctx.session as any).taskCreation || {};
});

export default composer;