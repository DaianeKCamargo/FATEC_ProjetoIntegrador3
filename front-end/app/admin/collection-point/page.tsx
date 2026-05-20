import Link from "next/link";

export default function CollectionPointAdmin() {
  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-black">
        Painel de Pontos de Coleta
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link
          href="/admin/collection-point/registration"
          className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Cadastrar Ponto
          </h2>

          <p>
            Criar um novo ponto de coleta.
          </p>
        </Link>

        <Link
          href="/admin/collection-point/registration-review"
          className="bg-yellow-500 text-white p-6 rounded-lg shadow-md hover:bg-yellow-600 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Aprovar Cadastros
          </h2>

          <p>
            Aprovar ou recusar solicitações.
          </p>
        </Link>

        <Link
          href="/admin/collection-point/view-points"
          className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Visualizar Pontos
          </h2>

          <p>
            Ver e editar pontos cadastrados.
          </p>
        </Link>

      </section>
    </main>
  );
}