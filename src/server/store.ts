import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSeedStore } from "@/data/seed";
import type { AuditEvent, StoreData } from "@/domain/types";

const filePath = path.join(process.cwd(), "data", "store.json");

function cloneSeed(): StoreData {
  return structuredClone(createSeedStore());
}

export async function readStore(): Promise<StoreData> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    if (parsed?.version === 1 && Array.isArray(parsed.properties) && Array.isArray(parsed.users)) {
      return parsed;
    }
  } catch {
    return cloneSeed();
  }
  return cloneSeed();
}

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function updateStore(mutate: (store: StoreData) => void | Promise<void>): Promise<StoreData> {
  return enqueue(async () => {
    const store = await readStore();
    await mutate(store);
    await mkdir(path.dirname(filePath), { recursive: true });
    const temporary = `${filePath}.${process.pid}.tmp`;
    await writeFile(temporary, JSON.stringify(store, null, 2));
    await rename(temporary, filePath);
    return store;
  });
}

export function pushAudit(
  store: StoreData,
  event: Omit<AuditEvent, "id" | "at"> & { at?: string },
): void {
  store.audit.unshift({
    id: randomUUID(),
    at: event.at ?? new Date().toISOString(),
    actor: event.actor,
    action: event.action,
    entityType: event.entityType,
    entityId: event.entityId,
    summary: event.summary,
  });
  store.audit = store.audit.slice(0, 400);
}

