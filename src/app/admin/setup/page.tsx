import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupForm } from "@/components/admin/AuthForms";
import { Logo } from "@/components/logo/Logo";
import { sessionSecret } from "@/server/session";
import { readStore } from "@/server/store";

export default async function SetupPage() {
  const store = await readStore();
  if (store.users.some((user) => user.role === "admin")) redirect("/admin/login");
  return (
    <main className="mx-auto grid min-h-screen max-w-md content-center px-5 py-16">
      <Logo />
      <h1 className="display mt-8 text-4xl text-forest">Primer administrador</h1>
      <p className="mt-4 text-sm leading-6">La contraseña se guarda cifrada en el servidor local y no se escribe en el repositorio. Use al menos 10 caracteres.</p>
      {!sessionSecret() ? (
        <p className="mt-4 text-sm leading-6">Antes, defina HOGAR_YA_SESSION_SECRET en `.env.local`.</p>
      ) : (
        <div className="mt-8"><SetupForm /></div>
      )}
      <Link href="/admin/login" className="mt-8 text-sm underline">Ya tengo cuenta</Link>
    </main>
  );
}
