'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store user data and token in localStorage
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);

            toast({
                title: 'Login successful',
                description: 'Welcome back to CarbonKrishi!',
                variant: 'default',
            });

            // Redirect based on user role
            if (data.role === 'farmer') {
                router.push('/dashboard/farmer');
            } else if (data.role === 'company') {
                router.push('/dashboard/company');
            } else if (data.role === 'admin') {
                router.push('/dashboard/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: 'Login failed',
                description: error instanceof Error ? error.message : 'Please check your credentials and try again',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-gradient-to-b from-muted to-background flex min-h-screen items-center justify-center px-4 py-12 md:py-20">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md rounded-lg border border-border bg-card shadow-lg">
                <div className="p-8">
                    {/* Logo / Home Link */}
                    <div>
                        <Link
                            href="/"
                            aria-label="Go home"
                            className="inline-block"
                        >
                            <div className="flex items-center">
                                <svg 
                                    width="32" 
                                    height="32" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                                        fill="#4ade80" 
                                        fillOpacity="0.2"
                                    />
                                    <path 
                                        d="M15 16C14.0807 16.5 13.0461 16.7725 12 16.8C10.9539 16.7725 9.91925 16.5 9 16M8 13H8.01M16 13H16.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                                        stroke="#4ade80" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="ml-2 text-xl font-semibold text-primary">CarbonKrishi</span>
                            </div>
                        </Link>
                        <h1 className="mt-6 text-pretty text-2xl font-semibold leading-snug">
                            <span className="block text-muted-foreground">Welcome to CarbonKrishi!</span>
                            Sign in to continue
                        </h1>
                    </div>

                    {/* Email Login */}
                    <div className="mt-8 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="ring-foreground/15 border-input ring-1"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <Button variant="link" size="sm" className="px-0 text-xs" asChild>
                                    <Link href="/forgot-password">Forgot password?</Link>
                                </Button>
                            </div>
                            <Input
                                type="password"
                                required
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="ring-foreground/15 border-input ring-1"
                                disabled={isLoading}
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full" 
                            size="lg" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="my-8 flex items-center">
                        <div className="h-px flex-1 bg-border" />
                        <span className="px-3 text-sm text-muted-foreground">or continue with</span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    {/* Social Buttons */}
                    <div className="space-y-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="w-full flex items-center gap-3"
                            disabled={isLoading}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 256 262"
                            >
                                <path
                                    fill="#4285f4"
                                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                />
                                <path
                                    fill="#34a853"
                                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                />
                                <path
                                    fill="#fbbc05"
                                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                                />
                                <path
                                    fill="#eb4335"
                                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                />
                            </svg>
                            <span>Google</span>
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Button asChild variant="link" size="sm" className="px-1">
                            <Link href="/register">Create one</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    );
}
