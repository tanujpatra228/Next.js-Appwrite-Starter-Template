"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { LoginFormType, loginSchema } from '@/schema/loginSchema';
import { signUpWithGoogle } from '@/server/oauth';
import { loginUser } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MouseEvent, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { PasswordInput } from './PasswordInput';

function LoginForm() {
    const params = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const loginMutation = useMutation({ mutationKey: ['loginUser'], mutationFn: loginUser });
    const form = useForm<LoginFormType>({ resolver: zodResolver(loginSchema) });
    const { formState: { errors } } = form;
    
    const onSubmit = async (values: LoginFormType) => {
        const response = await loginMutation.mutateAsync(values);
        
        // Handle Success
        if (response) {
            toast({
                title: "Welcome Back",
                description: "Happy planting",
            });
            router.replace('/dashboard');
            return;
        }
        
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
        });
    }

    const handleGoogleLogin = async (event: MouseEvent) => {
        try {
            event.preventDefault();
            await signUpWithGoogle();
        } catch (error) {
            console.log('handleGoogleLogin error', error);
        }
    }

    const handleGoogleOauthError = () => {
        try {
            const error = params.get('error');
            if (!error) return;
            
            toast({
                variant: "destructive",
                title: "Uh oh! Google Sign-up failed",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again" onClick={handleGoogleLogin}>Try again</ToastAction>,
            });
        } catch (error) {
            console.log('handleGoogleOauthError error', error);
        }
    }

    useEffect(() => {
        // Wrapped the error function into setTimeout to solve shadcn toast not working issue
        const timeout = setTimeout(handleGoogleOauthError, 0);
        return (() => clearTimeout(timeout))
    }, []);

    return (
        <>
            <form
                className="mx-auto grid w-[350px] gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@domain.com"
                            tabIndex={1}
                            {...form.register("email")}
                        />
                        {errors.email && <p className='text-sm text-red-600'>{errors.email.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="ml-auto inline-block text-sm underline"
                                tabIndex={6}
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <PasswordInput
                            id="password"
                            type="password"
                            placeholder="******"
                            tabIndex={2}
                            {...form.register("password")}
                        />
                        {errors.password && <p className='text-sm text-red-600'>{errors.password.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" tabIndex={3}>
                        Login
                    </Button>
                    <Button variant="outline" className="w-full" tabIndex={4} onClick={handleGoogleLogin}>
                        Login with Google
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline" tabIndex={5}>
                        Sign up
                    </Link>
                </div>
            </form>
        </>
    )
}

export default LoginForm;
