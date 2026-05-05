import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>
      {children}
    </main>
  );
}
