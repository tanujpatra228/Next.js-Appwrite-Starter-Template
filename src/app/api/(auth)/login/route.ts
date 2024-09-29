import { logginUsingEmailPassword } from "@/appwrite/appwrite";
import { setSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password }: any = await request.json();
        const userAgent = request.headers.get("User-Agent");
        const userSession = await logginUsingEmailPassword({email, password, userAgent});
    
        setSession(userSession);
        revalidatePath('/dashboard', 'page');

        return NextResponse.json({
            message: "Signin successful",
            userSession: userSession,
        }, { status: 200 });
    }
    catch (error: any) {
        console.log('login API error', error);
        return NextResponse.json({
            error: error.response
        }, { status: error?.code || 500 });
    }
}