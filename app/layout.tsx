import type { Metadata } from "next";
import { Recursive } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";

const inter = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Chat Application",
  description: "Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning> {/* Force dark mode here */}
        <body className={cn(
          inter.className,
          "bg-white dark:bg-[#313338]"  // Ensure dark background is set
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"  // Set dark mode as default
            enableSystem={false}  // Disable system theme detection to keep it in dark mode
            disableTransitionOnChange
            storageKey="VoxNet-Theme"  // Custom storage key
          >
            <ModalProvider/>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
