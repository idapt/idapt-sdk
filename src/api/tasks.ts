

import { type HttpContext, request } from "../http.js";
import type {
  CallOptions,
  DeletedResponse,
  ListEnvelope,
  SingleEnvelope,
} from "../types.js";

export interface TaskList {
  id: string;
  name: string;
  key: string;
  description: string | null;
  icon: string | null;
  public_access: string;
  created_at: string;
  updated_at: string;
}

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Task {
  id: string;
  list_id: string;
  list_key: string;
  item_number: number;
  identifier: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  parent_id: string | null;
  assignee_ids: string[];
  duplicate_of: TaskRef | null;
  start_at: string | null;
  due_at: string | null;
  labels: TaskLabel[];
  child_count: number;
  descendant_count: number;
  descendant_done_count: number;
  blocked_by_count: number;
  blocked_by_done_count: number;
  created_at: string;
  updated_at: string;
}

export interface TaskRef {
  id: string;
  identifier: string;
  item_number: number;
  title: string;
  status: string;
  priority: string;
}

export interface TaskDependencies {
  blocked_by: TaskRef[];
  blocking: TaskRef[];
}

export interface TaskComment {
  id: string;
  task_id: string;
  actor_id: string | null;
  origin: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TaskEvent {
  id: string;
  task_id: string;
  actor_id: string | null;
  origin: string;
  event_type: string;
  previous_value: unknown;
  current_value: unknown;
  created_at: string;
}

export interface TaskListCreateInput {
  name: string;

  key?: string;
  description?: string | null;
  icon?: string | null;
  workspaceId?: string;
}

export interface TaskListUpdateInput {
  name?: string;
  key?: string;
  description?: string | null;
  icon?: string | null;
  publicAccess?: "none" | "unlisted" | "read";
}

export interface TaskLabelCreateInput {
  name: string;
  color: string;
}

export interface TaskLabelUpdateInput {
  name?: string;
  color?: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;

  parent?: string | null;

  assigneeIds?: string[];
  startAt?: string | null;
  dueAt?: string | null;

  labelIds?: string[];
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  parent?: string | null;
  startAt?: string | null;
  dueAt?: string | null;
}

export interface TaskAssignInput {

  assigneeId?: string | null;

  assigneeIds?: string[];
}

export interface TaskListQuery extends CallOptions {

  status?: string[];

  priority?: string[];
  assigneeId?: string;

  parent?: string;

  labelIds?: string[];

  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const enc = encodeURIComponent;

class TaskListsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    workspaceId?: string,
    opts: CallOptions = {},
  ): Promise<TaskList[]> {
    const q = new URLSearchParams();
    if (workspaceId) q.set("workspace_id", workspaceId);
    const qs = q.toString() ? `?${q.toString()}` : "";
    const res = await request<ListEnvelope<TaskList>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tasks/lists${qs}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    input: TaskListCreateInput,
    opts: CallOptions = {},
  ): Promise<TaskList> {
    const res = await request<SingleEnvelope<TaskList>>(this.ctx, {
      method: "POST",
      path: "/api/v1/tasks/lists",
      body: {
        name: input.name,
        key: input.key,
        description: input.description,
        icon: input.icon,
        workspace_id: input.workspaceId,
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async get(ref: string, opts: CallOptions = {}): Promise<TaskList> {
    const res = await request<SingleEnvelope<TaskList>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tasks/lists/${enc(ref)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    ref: string,
    patch: TaskListUpdateInput,
    opts: CallOptions = {},
  ): Promise<TaskList> {
    const res = await request<SingleEnvelope<TaskList>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/tasks/lists/${enc(ref)}`,
      body: {
        name: patch.name,
        key: patch.key,
        description: patch.description,
        icon: patch.icon,
        public_access: patch.publicAccess,
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(ref: string, opts: CallOptions = {}): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/tasks/lists/${enc(ref)}`,
      signal: opts.signal,
    });
  }
}

class TaskLabelsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(listRef: string, opts: CallOptions = {}): Promise<TaskLabel[]> {
    const res = await request<ListEnvelope<TaskLabel>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tasks/lists/${enc(listRef)}/labels`,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    listRef: string,
    input: TaskLabelCreateInput,
    opts: CallOptions = {},
  ): Promise<TaskLabel> {
    const res = await request<SingleEnvelope<TaskLabel>>(this.ctx, {
      method: "POST",
      path: `/api/v1/tasks/lists/${enc(listRef)}/labels`,
      body: { name: input.name, color: input.color },
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    listRef: string,
    labelId: string,
    patch: TaskLabelUpdateInput,
    opts: CallOptions = {},
  ): Promise<TaskLabel> {
    const res = await request<SingleEnvelope<TaskLabel>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/tasks/lists/${enc(listRef)}/labels/${enc(labelId)}`,
      body: { name: patch.name, color: patch.color },
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(
    listRef: string,
    labelId: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/tasks/lists/${enc(listRef)}/labels/${enc(labelId)}`,
      signal: opts.signal,
    });
  }
}

class TaskItemsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(listRef: string, query: TaskListQuery = {}): Promise<Task[]> {
    const q = new URLSearchParams();
    if (query.status?.length) q.set("status", query.status.join(","));
    if (query.priority?.length) q.set("priority", query.priority.join(","));
    if (query.assigneeId) q.set("assignee_id", query.assigneeId);
    if (query.parent) q.set("parent", query.parent);
    if (query.labelIds?.length) q.set("label_ids", query.labelIds.join(","));
    if (query.q) q.set("q", query.q);
    if (query.page !== undefined) q.set("page", String(query.page));
    if (query.pageSize !== undefined)
      q.set("page_size", String(query.pageSize));
    if (query.sortBy) q.set("sort_by", query.sortBy);
    if (query.sortOrder) q.set("sort_order", query.sortOrder);
    const qs = q.toString() ? `?${q.toString()}` : "";
    const res = await request<ListEnvelope<Task>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tasks/lists/${enc(listRef)}/tasks${qs}`,
      signal: query.signal,
    });
    return res.data;
  }

  async create(
    listRef: string,
    input: TaskCreateInput,
    opts: CallOptions = {},
  ): Promise<Task> {
    const res = await request<SingleEnvelope<Task>>(this.ctx, {
      method: "POST",
      path: `/api/v1/tasks/lists/${enc(listRef)}/tasks`,
      body: {
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        parent: input.parent,
        assignee_ids: input.assigneeIds,
        start_at: input.startAt,
        due_at: input.dueAt,
        label_ids: input.labelIds,
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async get(taskRef: string, opts: CallOptions = {}): Promise<Task> {
    const res = await request<SingleEnvelope<Task>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    taskRef: string,
    patch: TaskUpdateInput,
    opts: CallOptions = {},
  ): Promise<Task> {
    const res = await request<SingleEnvelope<Task>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}`,
      body: {
        title: patch.title,
        description: patch.description,
        status: patch.status,
        priority: patch.priority,
        parent: patch.parent,
        start_at: patch.startAt,
        due_at: patch.dueAt,
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(
    taskRef: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}`,
      signal: opts.signal,
    });
  }

  async assign(
    taskRef: string,
    input: TaskAssignInput,
    opts: CallOptions = {},
  ): Promise<Task> {
    const res = await request<SingleEnvelope<Task>>(this.ctx, {
      method: "POST",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/assign`,
      body: {
        assignee_id: input.assigneeId,
        assignee_ids: input.assigneeIds,
      },
      signal: opts.signal,
    });
    return res.data;
  }

  async unassign(
    taskRef: string,
    assigneeId: string,
    opts: CallOptions = {},
  ): Promise<Task> {
    const q = new URLSearchParams({ assignee_id: assigneeId });
    const res = await request<SingleEnvelope<Task>>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/assign?${q.toString()}`,
      signal: opts.signal,
    });
    return res.data;
  }

  async duplicate(
    taskRef: string,
    duplicateOf: string | null,
    opts: CallOptions = {},
  ): Promise<Task> {
    const res = await request<SingleEnvelope<Task>>(this.ctx, {
      method: "POST",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/duplicate`,
      body: { duplicate_of: duplicateOf },
      signal: opts.signal,
    });
    return res.data;
  }

  async ancestors(taskRef: string, opts: CallOptions = {}): Promise<Task[]> {
    const res = await request<ListEnvelope<Task>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/ancestors`,
      signal: opts.signal,
    });
    return res.data;
  }
}

class TaskCommentsApi {
  constructor(private readonly ctx: HttpContext) {}

  async list(taskRef: string, opts: CallOptions = {}): Promise<TaskComment[]> {
    const res = await request<ListEnvelope<TaskComment>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/comments`,
      signal: opts.signal,
    });
    return res.data;
  }

  async create(
    taskRef: string,
    content: string,
    opts: CallOptions = {},
  ): Promise<TaskComment> {
    const res = await request<SingleEnvelope<TaskComment>>(this.ctx, {
      method: "POST",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/comments`,
      body: { content },
      signal: opts.signal,
    });
    return res.data;
  }

  async update(
    taskRef: string,
    commentId: string,
    content: string,
    opts: CallOptions = {},
  ): Promise<TaskComment> {
    const res = await request<SingleEnvelope<TaskComment>>(this.ctx, {
      method: "PATCH",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/comments/${enc(commentId)}`,
      body: { content },
      signal: opts.signal,
    });
    return res.data;
  }

  async delete(
    taskRef: string,
    commentId: string,
    opts: CallOptions = {},
  ): Promise<DeletedResponse> {
    return request<DeletedResponse>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/comments/${enc(commentId)}`,
      signal: opts.signal,
    });
  }
}

class TaskDependenciesApi {
  constructor(private readonly ctx: HttpContext) {}

  async get(
    taskRef: string,
    opts: CallOptions = {},
  ): Promise<TaskDependencies> {
    const res = await request<SingleEnvelope<TaskDependencies>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/dependencies`,
      signal: opts.signal,
    });
    return res.data;
  }

  async add(
    taskRef: string,
    dependsOn: string,
    opts: CallOptions = {},
  ): Promise<TaskDependencies> {
    const res = await request<SingleEnvelope<TaskDependencies>>(this.ctx, {
      method: "POST",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/dependencies`,
      body: { depends_on: dependsOn },
      signal: opts.signal,
    });
    return res.data;
  }

  async remove(
    taskRef: string,
    dependsOn: string,
    opts: CallOptions = {},
  ): Promise<TaskDependencies> {
    const q = new URLSearchParams({ depends_on: dependsOn });
    const res = await request<SingleEnvelope<TaskDependencies>>(this.ctx, {
      method: "DELETE",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/dependencies?${q.toString()}`,
      signal: opts.signal,
    });
    return res.data;
  }
}

export class TasksApi {

  readonly lists: TaskListsApi;

  readonly tasks: TaskItemsApi;

  readonly labels: TaskLabelsApi;

  readonly comments: TaskCommentsApi;

  readonly dependencies: TaskDependenciesApi;

  constructor(private readonly ctx: HttpContext) {
    this.lists = new TaskListsApi(ctx);
    this.tasks = new TaskItemsApi(ctx);
    this.labels = new TaskLabelsApi(ctx);
    this.comments = new TaskCommentsApi(ctx);
    this.dependencies = new TaskDependenciesApi(ctx);
  }

  async events(taskRef: string, opts: CallOptions = {}): Promise<TaskEvent[]> {
    const res = await request<ListEnvelope<TaskEvent>>(this.ctx, {
      method: "GET",
      path: `/api/v1/tasks/tasks/${enc(taskRef)}/events`,
      signal: opts.signal,
    });
    return res.data;
  }
}
