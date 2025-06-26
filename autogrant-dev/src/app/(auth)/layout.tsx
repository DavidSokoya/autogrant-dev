import "../globals.css";
import { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";
import Script from "next/script";


export const metadata = {
  title: "AutoGrant",
  description: "One tap, one click access to all grants.",
};

interface AuthLayoutProps { 
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {


  return (
          <main>
            <Toaster />
            <div className="">{children}</div>
          </main>
  );
}