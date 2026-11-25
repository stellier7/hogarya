import { readFile } from "node:fs/promises";
import { canReviewCaptures } from "@/domain/permissions";
import { getSessionUser } from "@/server/session";
import { captureFilePath } from "@/server/uploads";

type Context = { params: Promise<{ id: string; file: string }> };

export async function GET(_request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user || !canReviewCaptures(user)) return new Response("No autorizado", { status: 401 });
  const { id, file } = await context.params;
  const absolute = captureFilePath(id, file);
  if (!absolute) return new Response("No encontrado", { status: 404 });
  try {
    const bytes = await readFile(absolute);
    const type = file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg";
    return new Response(bytes, { headers: { "Content-Type": type, "Cache-Control": "private, max-age=3600" } });
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
}
