import NavigationSidebar from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="flex flex-col fixed inset-y-0 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <NavigationSidebar />
      </div>
      {/* Main Content Area */}
      <main className="flex-1 sm:ml-[72px] h-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
