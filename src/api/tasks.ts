

import {
  TaskCommentsApi,
  TaskDependenciesApi,
  TaskItemsApi,
  TaskLabelsApi,
  TaskListsApi,
  TasksApiBase,
} from "../generated/resources.generated.js";
import type { HttpContext } from "../http.js";

export type {
  TaskCreateInput,
  TaskLabelCreateInput,
  TaskLabelUpdateInput,
  TaskListCreateInput,
  TaskListQuery,
  TaskListsQuery,
  TaskListUpdateInput,
  TaskSearchQuery,
  TaskUpdateInput,
} from "../generated/resources.generated.js";
export {
  TaskCommentsApi,
  TaskDependenciesApi,
  TaskItemsApi,
  TaskLabelsApi,
  TaskListsApi,
};

export class TasksApi extends TasksApiBase {

  readonly lists: TaskListsApi;

  readonly tasks: TaskItemsApi;

  readonly labels: TaskLabelsApi;

  readonly comments: TaskCommentsApi;

  readonly dependencies: TaskDependenciesApi;

  constructor(ctx: HttpContext) {
    super(ctx);
    this.lists = new TaskListsApi(ctx);
    this.tasks = new TaskItemsApi(ctx);
    this.labels = new TaskLabelsApi(ctx);
    this.comments = new TaskCommentsApi(ctx);
    this.dependencies = new TaskDependenciesApi(ctx);
  }
}
