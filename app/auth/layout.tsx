export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-soko-mist px-4 py-6 sm:py-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
