"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function signUp() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Cuenta creada correctamente. Ya puedes iniciar sesión.");

    setIsLogin(true);
  }

  async function signIn() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/account");
  }

   return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="mb-2 text-center text-4xl font-bold">
          DASAIA
        </h1>

        <p className="mb-8 text-center text-gray-500">
          {isLogin ? "Inicia sesión en tu cuenta" : "Crea tu cuenta"}
        </p>

        <div className="mb-8 flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-lg py-2 transition ${
              isLogin
                ? "bg-black text-white"
                : "text-gray-600"
            }`}
          >
            Iniciar sesión
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-lg py-2 transition ${
              !isLogin
                ? "bg-black text-white"
                : "text-gray-600"
            }`}
          >
            Crear cuenta
          </button>
        </div>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border p-3"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-xl border p-3"
        />

        <button
          onClick={isLogin ? signIn : signUp}
          disabled={loading}
          className="w-full rounded-xl bg-black py-3 text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading
            ? "Cargando..."
            : isLogin
            ? "Iniciar sesión"
            : "Crear cuenta"}
        </button>

      </div>
    </main>
  );
}