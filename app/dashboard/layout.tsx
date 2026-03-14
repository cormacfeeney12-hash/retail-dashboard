import { DashboardNav } from "@/components/DashboardNav";
import { StoreProvider } from "@/contexts/StoreContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div style={{ minHeight: "100vh", background: "#0c0e14" }}>
        <DashboardNav />
        <main style={{ padding: "24px 28px 80px", maxWidth: "1400px", margin: "0 auto" }}>
          {children}
        </main>
      </div>
    </StoreProvider>
  );
}
