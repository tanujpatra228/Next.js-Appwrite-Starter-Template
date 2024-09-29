"use client"
import { ForgotPasswordFormType, forgotPasswordSchema } from '@/schema/forgotPasswordSchema';
import { forgotPassword } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { useToast } from '../../../../components/ui/use-toast';

function ForgotPasswordForm() {
    const { toast } = useToast();
    const loginMutation = useMutation({ mutationKey: ['loginUser'], mutationFn: forgotPassword });
    const form = useForm<ForgotPasswordFormType>({ resolver: zodResolver(forgotPasswordSchema) });
    const { formState: { errors } } = form;
    
    const onSubmit = async (values: ForgotPasswordFormType) => {
        const response = await loginMutation.mutateAsync(values);
        
        // Handle Success
        if (response) {
            toast({
                title: "OTP Send",
                description: "Please check your email",
            });
            // Redirect to next page of your choice
            // router.replace('/enter-otp');
            return;
        }
        
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
        });
    }

    return (
        <>
            <form
                className="mx-auto grid w-[350px] gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Forgot Password</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email below to get OTP
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
                    <Button type="submit" className="w-full" tabIndex={3}>
                        Get OTP
                    </Button>
                    <Link
                        href="/login"
                        className="text-center inline-block text-sm underline"
                        tabIndex={6}
                    >
                        Back to Login
                    </Link>
                </div>
            </form>
        </>
    )
}

export default ForgotPasswordForm;
