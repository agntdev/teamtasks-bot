import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import {
  registerMainMenuItem,
  inlineButton,
  inlineKeyboard,
} from "../toolkit/index.js";

registerMainMenuItem({ label: "➕ Create task", data: "create:show", order: 10 });

const PROJECTS = [
  { id: "p1", name: "Website redesign" },
  { id: "p2", name: "Mobile app launch" },
  { id: "p3", name: "Documentation update" },
];

const ASSIGNEES = [
  { id: "a1", name: "Sarah (Designer)" },
  { id: "a2", name: "Mike (Developer)" },
  { id: "a3", name: "Emma (Marketing)" },
];

const composer = new Composer<Ctx>();

composer.command("create", async (ctx) => {
  const message = await ctx.reply("Select a project for this task:", {
    reply_markup: createProjectKeyboard(),
  });
});

composer.callbackQuery("create:show", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("Select a project for this task:", {
    reply_markup: createProjectKeyboard(),
  });
});

composer.callbackQuery(/^create:project:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const projectId = ctx.match[1];
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) {
    await ctx.editMessageText("❌ Project not found", {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back", "create:show")]]),
    });
    return;
  }
  await ctx.editMessageText(`Project: ${project.name}\n\nSelect an assignee:`, {
    reply_markup: createAssigneeKeyboard(projectId),
  });
});

composer.callbackQuery(/^create:assignee:(.+):(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const projectId = ctx.match[1];
  const assigneeId = ctx.match[2];
  const project = PROJECTS.find((p) => p.id === projectId);
  const assignee = ASSIGNEES.find((a) => a.id === assigneeId);
  if (!project || !assignee) {
    await ctx.editMessageText("❌ Invalid selection", {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back", "create:show")]]),
    });
    return;
  }
  await ctx.editMessageText(
    `Project: ${project.name}\nAssignee: ${assignee.name}\n\nNow enter a task name:`,
    {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back", "create:project:" + projectId)]]),
    },
  );
  (ctx.session as any).taskCreation = { projectId, assigneeId };
});

function createProjectKeyboard() {
  const rows = [];
  for (let i = 0; i < PROJECTS.length; i += 2) {
    rows.push(
      PROJECTS.slice(i, i + 2).map((p) => inlineButton(p.name, `create:project:${p.id}`)),
    );
  }
  rows.push([inlineButton("⬅️ Back", "menu:main")]);
  return inlineKeyboard(rows);
}

function createAssigneeKeyboard(projectId: string) {
  const rows = [];
  for (let i = 0; i < ASSIGNEES.length; i += 2) {
    rows.push(
      ASSIGNEES
        .slice(i, i + 2)
        .map((a) => inlineButton(a.name, `create:assignee:${projectId}:${a.id}`)),
    );
  }
  rows.push([inlineButton("⬅️ Back", "create:show")]);
  return inlineKeyboard(rows);
}

export default composer;