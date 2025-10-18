import type { Task, Status } from "@verse/hirecore-web/app/task/[id]/sections/types";

export type WorkerApplication = Task & {
  myBidAmount?: number;
};

export type ClientRequest = Task & {
  requestNote?: string;
};
