import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/AuthForms";
import { Logo } from "@/components/logo/Logo";
import { getSessionUser, sessionSecret } from "@/server/session";
import { readStore } from "@/server/store";

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/admin");
  const store = await readStore();
  const hasAdmin = store.users.some((user) => user.role === "admin");
  return (
    <main className="mx-auto grid min-h-screen max-w-md content-center px-5 py-16">
      <Logo />
      <h1 className="display mt-8 text-4xl text-forest">Panel</h1>
      {!sessionSecret() ? (
        <p className="mt-4 text-sm leading-6">Defina HOGAR_YA_SESSION_SECRET en el servidor. Sin esa clave no se puede iniciar sesión.</p>
      ) : null}
      {hasAdmin ? (
        <div className="mt-8"><LoginForm /></div>
      ) : (
        <p className="mt-6 text-sm leading-6">
          Todavía no hay un administrador. <Link href="/admin/setup" className="underline">Crear la primera cuenta</Link>.
        </p>
      )}
      <Link href="/" className="mt-8 text-sm underline">Volver al sitio</Link>
    </main>
  );
}
