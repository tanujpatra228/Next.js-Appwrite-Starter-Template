import { signUpUsingEmailPasswordAndLogin } from "@/appwrite/appwrite";
import { setSession } from "@/lib/session";
import { RegisterFormType } from "@/schema/signUpSchema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const {email, password, name}: RegisterFormType = await request.json();
        const userAgent = request.headers.get("User-Agent");
        const {user, userSession} = await signUpUsingEmailPasswordAndLogin({email, password, name, userAgent});
    
        setSession(userSession);

        return NextResponse.json({
            message: "Signup successful",
            user: user,
            userSession: userSession,
        }, { status: 201 });
    }
    catch (error: any) {
        return NextResponse.json({
            error: error.response
        }, { status: error?.code || 500 });
    }
}