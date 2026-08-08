export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-soko-forest">
      {children}
    </div>
  );
}
