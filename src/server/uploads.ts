import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const types = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type UploadKind = "capture" | "property";

function hasMagic(bytes: Buffer, extension: string): boolean {
  if (extension === "jpg") return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (extension === "png") return bytes.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  if (extension === "webp") {
    return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  }
  return false;
}

function folderFor(kind: UploadKind, id: string): string {
  switch (kind) {
    case "capture":
      return path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "uploads", "captures", id);
    case "property":
      return path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "uploads", "properties", id);
    default: {
      const exhausted: never = kind;
      return exhausted;
    }
  }
}

export async function saveUpload(file: File, kind: UploadKind, id: string): Promise<{ fileName: string; originalName: string }> {
  if (!/^[\w-]+$/.test(id)) throw new Error("No se pudo guardar la fotografía.");
  const extension = types[file.type as keyof typeof types];
  if (!extension) throw new Error("Use una fotografía JPG, PNG o WebP.");
  if (file.size <= 0 || file.size > 3 * 1024 * 1024) throw new Error("Cada fotografía debe pesar menos de 3 MB.");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!hasMagic(bytes, extension)) throw new Error("El archivo no parece una imagen válida.");
  const fileName = `${randomUUID()}.${extension}`;
  const absolute = folderFor(kind, id);
  await mkdir(/*turbopackIgnore: true*/ absolute, { recursive: true });
  await writeFile(path.join(/*turbopackIgnore: true*/ absolute, fileName), bytes);
  return { fileName, originalName: file.name.replace(/[^\w.\- ]+/g, "").slice(0, 80) || fileName };
}

function inside(root: string, file: string): string | null {
  if (!/^[\w.-]+$/.test(file)) return null;
  const resolved = path.resolve(root, file);
  if (!resolved.startsWith(`${root}${path.sep}`)) return null;
  return resolved;
}

export function captureFilePath(id: string, file: string): string | null {
  if (!/^[\w-]+$/.test(id)) return null;
  const root = path.resolve(/*turbopackIgnore: true*/ process.cwd(), "data", "uploads", "captures", id);
  return inside(root, file);
}

export function propertyFilePath(id: string, file: string): string | null {
  if (!/^[\w-]+$/.test(id)) return null;
  const root = path.resolve(/*turbopackIgnore: true*/ process.cwd(), "public", "uploads", "properties", id);
  return inside(root, file);
}
