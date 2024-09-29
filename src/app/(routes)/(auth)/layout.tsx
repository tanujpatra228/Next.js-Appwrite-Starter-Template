
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2">
                <div className="flex items-center justify-center">
                    {children}
                </div>
                <div className="hidden bg-muted lg:h-screen lg:flex items-center justify-center">
                    <img
                        src="https://placehold.co/600x400/5582C2/FFF?text=Auth+With+Appwrite"
                        alt="Image"
                        className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </>
    );
}
