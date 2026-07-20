import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { registerMainMenuItem, inlineButton, inlineKeyboard } from "../toolkit/index.js";

registerMainMenuItem({ label: "📋 My tasks", data: "list:show", order: 20 });

const composer = new Composer<Ctx>();

composer.command("list", async (ctx) => {
  await ctx.reply("Select a filter:", {
    reply_markup: inlineKeyboard([
      [
        inlineButton("All tasks", "list:show"),
        inlineButton("By project", "list:project"),
      ],
      [
        inlineButton("By assignee", "list:assignee"),
        inlineButton("Completed", "list:completed"),
      ],
      [inlineButton("⬅️ Back", "menu:main")],
    ]),
  });
});

composer.callbackQuery("list:show", async (ctx) => {
  await ctx.answerCallbackQuery();
  const tasks: string[] = [];
  await ctx.editMessageText(
    tasks.length > 0
      ? `✅ ${tasks.length} task${tasks.length === 1 ? "" : "s"}:\n${tasks.join("\n")}`
      : "✅ No tasks found. Tap ➕ to create one.",
    {
      reply_markup: inlineKeyboard([
        [inlineButton("⬅️ Back", "menu:main")],
      ]),
    },
  );
});

composer.callbackQuery("list:project", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("Select a project:", {
    reply_markup: inlineKeyboard([
      [
        inlineButton("Website redesign", "list:project:p1"),
        inlineButton("Mobile app", "list:project:p2"),
      ],
      [
        inlineButton("Documentation", "list:project:p3"),
        inlineButton("⬅️ Back", "list:show"),
      ],
    ]),
  });
});

composer.callbackQuery("list:assignee", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("Select an assignee:", {
    reply_markup: inlineKeyboard([
      [inlineButton("Sarah", "list:assignee:a1")],
      [inlineButton("Mike", "list:assignee:a2")],
      [inlineButton("Emma", "list:assignee:a3")],
      [inlineButton("⬅️ Back", "list:show")],
    ]),
  });
});

composer.callbackQuery("list:completed", async (ctx) => {
  await ctx.answerCallbackQuery();
  const completed: string[] = [];
  await ctx.editMessageText(
    completed.length > 0
      ? `✅ Completed tasks:\n${completed.join("\n")}`
      : "✅ No completed tasks yet.",
    {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back", "list:show")]]),
    },
  );
});

export default composer;