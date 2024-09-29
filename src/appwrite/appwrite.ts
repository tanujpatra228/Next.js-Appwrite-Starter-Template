import { config } from "@/appwrite/config";
import { SESSION_KEY } from "@/helpers";
import { deleteSession } from "@/lib/session";
import { cookies } from "next/headers";
import { Client, Account, Models, ID } from "node-appwrite";

export async function createSessionClient(userAgent: string | null) {
    const client = new Client()
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId);

    const session = cookies().get(SESSION_KEY);
    if (!session || !session.value) {
        throw new Error("No session");
    }

    if (userAgent) client.setForwardedUserAgent(userAgent);

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
    };
}

export async function createAdminClient(userAgent: string | null) {
    const client = new Client()
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId)
        .setKey(process.env.APPWRITE_API_KEY!);

    if (userAgent) client.setForwardedUserAgent(userAgent);

    return {
        get account() {
            return new Account(client);
        },
    };
}

/**
 * Loggin user using Email & Password
 * @param {EmailPasswordLoginRequestType} {{ email: string, password: string, userAgent?: string}
 * @throws {AppwriteException}
 * @returns {Promise<Models.Session>}
 */
export async function logginUsingEmailPassword({email = "", password = "", userAgent = null}: EmailPasswordLoginRequestType): Promise<Models.Session> {
    const { account } = await createAdminClient(userAgent);
    const userSession = await account.createEmailPasswordSession(email, password);
    return userSession;
}

/**
 * Loggin user using OAuth2 provider
 * @param {OAuth2LiginRequestType} {{ userId: string, secret: string, userAgent?: string}
 * @throws {AppwriteException}
 * @returns {Promise<Models.Session>}
 */
export async function logginUsingOAuth2({ userId, secret, userAgent = null }: OAuth2LiginRequestType): Promise<Models.Session> {
    const { account } = await createAdminClient(userAgent);
    const userSession = await account.createSession(userId, secret);
    return userSession;
}

/**
 * Signup user using Email & Password and Login
 * @param {EmailPasswordSignUpRequestType} { email: string, password: string, name?:string }
 * @throws {AppwriteException}
 * @returns {Promise<EmailPasswordSignUpReturnType>}
 */
export async function signUpUsingEmailPasswordAndLogin({email, password, name, userAgent = null}: EmailPasswordSignUpRequestType): Promise<EmailPasswordSignUpReturnType> {
    const { account } = await createAdminClient(userAgent);
    const user = await account.create(ID.unique(), email, password, name);
    const userSession = await account.createEmailPasswordSession(email, password);
    return {user, userSession};
}

// Get Current loggedin user
export async function getCurrentUser() {
    try {
        const session = cookies().get(SESSION_KEY);
        if (!session || !session.value) {
            return null;
        }
        const { account } = await createSessionClient('');
        return await account.get();
    } catch (error: any) {
        console.log('getCurrentUser error', error);
        return null;
    }
}

// Delete current session
export async function deleteCurrentSession(userAgent: string | null) {
    try {
        const { account } = await createSessionClient(userAgent);
        account.deleteSession('current');
        deleteSession();
        return {
            success: true
        };
    } catch (error: any) {
        console.log('deleteSession error', error);
        return {
            error: error.message
        }
    }
}

type EmailPasswordLoginRequestType = {
    email: string,
    password: string,
    userAgent?: string | null
};

type OAuth2LiginRequestType = {
    userId: string,
    secret: string,
    userAgent?: string | null
}

type EmailPasswordSignUpRequestType = {
    email: string,
    password: string,
    name?: string,
    userAgent?: string | null
}
type EmailPasswordSignUpReturnType = {
    user: Models.User<Models.Preferences>,
    userSession: Models.Session
}
