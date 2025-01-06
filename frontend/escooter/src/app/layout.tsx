import localFont from "next/font/local";
import "./globals.css";
import MobileNavBar from "@/components/MobileNavBar";
import { useDeviceDetection } from "@/components/map/useDeviceDetection";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// // Client Component wrapper
// function LayoutWrapper({ children }: { children: React.ReactNode }) {
//   const { isMobile } = useDeviceDetection();
//   const pathname = usePathname();

//   // Don't add padding on login and register pages
//   const isAuthPage = pathname === "/login" || pathname === "/register";
//   const shouldAddPadding = isMobile && !isAuthPage;

// // Client Component wrapper
// function LayoutWrapper({ children }: { children: React.ReactNode }) {
//   const { isMobile } = useDeviceDetection();
//   const pathname = usePathname();

//   // Don't add padding on login and register pages
//   const isAuthPage = pathname === '/login' || pathname === '/register';
//   const shouldAddPadding = isMobile && !isAuthPage;

//   return (
//     <div className={`min-h-screen bg-gray-50 ${shouldAddPadding ? 'pb-16' : ''}`}>
//       <main>{children}</main>
//       <MobileNavBar />
//     </div>
//   );
// }

// Root Layout (Server Component)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* <LayoutWrapper>{children}</LayoutWrapper> */}
      </body>
    </html>
  );
}
