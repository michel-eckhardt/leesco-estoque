import { LoginForm } from "@/components/forms/login-form";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-block mb-4">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-blue-600">
            OceanPact
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Sistema de gestão de estoque
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          <LoginForm />
        </div>

        <div className="rounded-lg bg-blue-50 p-4 text-sm text-gray-700 border border-blue-200">
          <p className="font-semibold mb-2">Primeira vez?</p>
          <p>
            Entre com o usuário admin padrão para gerenciar estoques, produtos e usuários.
          </p>
        </div>
      </div>
    </div>
  );
}
