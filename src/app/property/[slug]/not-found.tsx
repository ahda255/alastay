export default function NotFound() {
  return (
    <main className="py-10 text-center">
      <h1 className="text-xl font-semibold">Properti tidak ditemukan</h1>
      <a
        href="/penginapan"
        className="mt-4 inline-block rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
      >
        Kembali ke daftar
      </a>
    </main>
  );
}
