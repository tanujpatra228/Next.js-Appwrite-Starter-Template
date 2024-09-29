import { ForgotPasswordFormType } from "@/schema/forgotPasswordSchema";
import { LoginFormType } from "@/schema/loginSchema";
import { RegisterFormType } from "@/schema/signUpSchema";
import { Models } from "node-appwrite";

export async function loginUser(values: LoginFormType): Promise<LoginUserServiceType> {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

export async function signUpUser(values: RegisterFormType): Promise<SignUpUserServiceType> {
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

export async function forgotPassword(values: ForgotPasswordFormType): Promise<ForgotPasswordServiceType> {
    try {
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

type ForgotPasswordServiceType = {
    message: string,
} | null;

type LoginUserServiceType = {
    message: string,
    userSession: Models.Session,
} | null;

type SignUpUserServiceType = {
    message: string,
    user: Models.User<Models.Preferences>,
    userSession: Models.Session,
} | null;