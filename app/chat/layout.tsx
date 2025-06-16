import Sidebar from "@/components/ui/Sidebar";

// Layout wrapper for all /chat/* pages
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar for thread navigation */}
      <Sidebar />

      {/* Main chat area */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
