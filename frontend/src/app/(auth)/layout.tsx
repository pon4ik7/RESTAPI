export default function AuthLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <main className="container flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
