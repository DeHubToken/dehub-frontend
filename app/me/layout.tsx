import "server-only";

export default function MeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-auto min-h-screen w-full items-start justify-between px-4 py-20 md:px-8">
      {children}
    </main>
  );
}
