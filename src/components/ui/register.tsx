'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'farmer', // Default role
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    const router = useRouter();
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const handleRoleChange = (value: string) => {
        setFormData({
            ...formData,
            role: value,
        });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            valid = false;
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }
        
        setErrors(newErrors);
        return valid;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            toast({
                title: 'Registration successful',
                description: 'Your account has been created. Please log in.',
                variant: 'default',
            });

            // Redirect to login page after successful registration
            router.push('/login');
        } catch (error) {
            console.error('Registration error:', error);
            toast({
                title: 'Registration failed',
                description: error instanceof Error ? error.message : 'Please check your information and try again',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-gradient-to-b from-muted to-background flex min-h-screen items-center justify-center px-4 py-12 md:py-20">
            <form
                onSubmit={handleRegister}
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
                            <span className="block text-muted-foreground">Join CarbonKrishi</span>
                            Create your account
                        </h1>
                    </div>

                    {/* Registration Form */}
                    <div className="mt-8 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Full Name
                            </Label>
                            <Input
                                type="text"
                                required
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="ring-foreground/15 border-input ring-1"
                                disabled={isLoading}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="ring-foreground/15 border-input ring-1"
                                disabled={isLoading}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <Input
                                type="password"
                                required
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="ring-foreground/15 border-input ring-1"
                                disabled={isLoading}
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                            </Label>
                            <Input
                                type="password"
                                required
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="ring-foreground/15 border-input ring-1"
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Account Type
                            </Label>
                            <RadioGroup 
                                value={formData.role} 
                                onValueChange={handleRoleChange}
                                className="flex flex-col space-y-1"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="farmer" id="farmer" />
                                    <Label htmlFor="farmer" className="cursor-pointer">Farmer</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="company" id="company" />
                                    <Label htmlFor="company" className="cursor-pointer">Company</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full mt-2" 
                            size="lg" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Button asChild variant="link" size="sm" className="px-1">
                            <Link href="/login">Sign in</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    );
}
