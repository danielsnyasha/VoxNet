import NavigationSidebar from "@/components/navigation/navigation-sidebar";


const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex">
      {/* Enhanced Sidebar Styling */}
      <div className="md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        
        <NavigationSidebar />
      </div>
      {/* Main Content Area */}
      <main className="flex-1 md:pl-[72px] h-full">{children}</main>
      
    </div>
  );
};

export default MainLayout;
