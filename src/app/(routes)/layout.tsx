import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

export default function RouteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Providers>
                {children}
            </Providers>
            <Toaster />
        </>
    );
}
