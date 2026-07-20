# Team Task Manager — Bot specification

**Archetype:** workflow

A Telegram bot for mid-size teams (11–50 people) to manage shared project tasks within Telegram. Features include task creation with due dates/priority, assignment, comments, status tracking, and notifications in project channels and direct messages.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- Mid-size internal teams (11–50 people)
- Project managers
- Team leads

## Success criteria

- Tasks visible in project channels with assignee DMs
- End-to-end task lifecycle tracking (create → assign → complete)
- Pagination and filtering of task lists

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open main menu with project/task options
- **/create** (command, actor: user, command: /create) — Initiate task creation flow
  - inputs: project selection, title, due date, priority, assignee
  - outputs: task summary card in channel, assignee DM
- **Create Task** (button, actor: user, callback: task:create) — Open task creation interface
  - inputs: project selection, title, due date, priority, assignee
  - outputs: task summary card in channel, assignee DM
- **/list** (command, actor: user, command: /list) — View task list by project/assignee
  - inputs: filter criteria (project/assignee/due)
  - outputs: paginated task list
- **task:detail** (button, actor: user, callback: task:detail) — Show full task info and comments
  - inputs: task ID
  - outputs: task detail view with action buttons

## Flows

### Onboarding
_Trigger:_ /start

1. Welcome message
2. Project registration (auto-map groups/channels)
3. Team member mapping
4. Admin setup

_Data touched:_ Team, Project

### Task Creation
_Trigger:_ /create or button

1. Project selection
2. Title input
3. Due date picker
4. Priority selection
5. Assignee selection
6. Channel notification posting
7. DM to assignee

_Data touched:_ Task, Notification

### Task Completion
_Trigger:_ /complete or button

1. Status update to Done
2. Channel update posting
3. DM to creator/assignee

_Data touched:_ Task, Notification

### Reminder System
_Trigger:_ 24h before due date

1. Check due dates
2. Send DM reminder
3. Admin toggle handling

_Data touched:_ Task, Notification

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **Team** _(retention: persistent)_ — Organisation/Telegram group with access controls
  - fields: id, telegram_group_id, admin_ids, notification_prefs
- **Project** _(retention: persistent)_ — Task list mapped to Telegram channel/group
  - fields: id, name, telegram_channel_id
- **Task** _(retention: persistent)_ — Action item with status tracking
  - fields: id, title, description, due_date, priority, assignee_id, status, project_id, comments
- **Comment** _(retention: persistent)_ — Threaded discussion on tasks
  - fields: task_id, author_id, timestamp, text
- **Notification** _(retention: session)_ — System messages for task events
  - fields: type, target_channel_id, target_user_id, content
- **User** _(retention: persistent)_ — Telegram user mapping
  - fields: telegram_user_id, team_id

## Integrations

- **Telegram** (required) — Bot API messaging
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Project registration and mapping
- Notification preferences (enable/disable reminders)
- Team member management
- Admin user assignment

## Notifications

- Project channel task updates
- Assignee direct messages
- Due date reminders (24h and on date)

## Permissions & privacy

- Tasks visible to entire team in project channels
- DMs limited to task assignees/creators
- No external data sharing

## Edge cases

- Invalid date formats in due date input
- Assigning to non-team members
- Task updates during pagination
- Reminder suppression for past-due tasks

## Required tests

- End-to-end task creation with channel/DM notifications
- Pagination through 50+ tasks
- Reminder suppression when admin disables
- Assignee change triggers dual notifications

## Assumptions

- Telegram groups map directly to projects
- Priority uses Low/Medium/High
- Date picker UI used where available
- Admin defaults simplify onboarding
