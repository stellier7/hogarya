import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/domain/types";
import { readStore } from "./store";

const cookieName = "hogar_ya_session";
const maxAgeSeconds = 60 * 60 * 12;

type Payload = { uid: string; exp: number };

export function sessionSecret(): string | null {
  const secret = process.env.HOGAR_YA_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) return null;
  return secret;
}

function sign(payload: Payload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function readPayload(token: string, secret: string): Payload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Payload;
    if (!payload.uid || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const secret = sessionSecret();
  if (!secret) return null;
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (!token) return null;
  const payload = readPayload(token, secret);
  if (!payload) return null;
  const store = await readStore();
  const user = store.users.find((item) => item.id === payload.uid && item.active);
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    agencyId: user.agencyId,
    agentId: user.agentId,
  };
}

export async function startSession(userId: string): Promise<void> {
  const secret = sessionSecret();
  if (!secret) throw new Error("Falta HOGAR_YA_SESSION_SECRET.");
  const token = sign({ uid: userId, exp: Date.now() + maxAgeSeconds * 1000 }, secret);
  const jar = await cookies();
  jar.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(cookieName);
}

export async function requireSession(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}
