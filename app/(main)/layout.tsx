import NavigationSidebar from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="xs:hidden sm:flex md:w-[72px] lg:w-[72px] xl:w-[72px] 2xl:w-[72px] bg-gray-800 border-r border-gray-700 fixed inset-y-0 z-20">
        <NavigationSidebar />
      </div>
      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto md:ml-[72px]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
