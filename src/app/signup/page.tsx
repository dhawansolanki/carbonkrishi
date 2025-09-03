'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Leaf, Building2 } from 'lucide-react'

export default function SignupPage() {
    const [userType, setUserType] = useState<'farmer' | 'company'>('farmer')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        // Farmer specific
        farmSize: '',
        location: '',
        cropType: '',
        // Company specific
        companyName: '',
        industry: '',
        gstNumber: ''
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <section className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 py-8">
            <div className="m-auto w-full max-w-2xl">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <Link href="/" className="inline-flex items-center text-green-600 mb-4">
                                <Leaf className="h-8 w-8 mr-2" />
                                <span className="text-2xl font-bold">CarbonKrishi</span>
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Join the Carbon Credit Platform
                            </h1>
                            <p className="text-gray-600">
                                {userType === 'farmer' 
                                    ? 'Register as a farmer to monetize your sustainable practices'
                                    : 'Register as a company to purchase verified carbon offsets'
                                }
                            </p>
                        </div>

                        {/* User Type Selection */}
                        <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setUserType('farmer')}
                                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-colors ${
                                    userType === 'farmer'
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <Leaf className="h-5 w-5 mr-2" />
                                Register as Farmer
                            </button>
                            <button
                                onClick={() => setUserType('company')}
                                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-colors ${
                                    userType === 'company'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <Building2 className="h-5 w-5 mr-2" />
                                Register as Company
                            </button>
                        </div>

                        <form className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Specific Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    {userType === 'farmer' ? 'Farm Information' : 'Company Information'}
                                </h3>
                                
                                {userType === 'farmer' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="farmSize">Farm Size (Acres)</Label>
                                            <Input
                                                id="farmSize"
                                                type="number"
                                                value={formData.farmSize}
                                                onChange={(e) => handleInputChange('farmSize', e.target.value)}
                                                placeholder="Enter farm size"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                placeholder="Village, District, State"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="cropType">Primary Crop Type</Label>
                                            <select
                                                id="cropType"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                value={formData.cropType}
                                                onChange={(e) => handleInputChange('cropType', e.target.value)}
                                            >
                                                <option value="">Select primary crop</option>
                                                <option value="rice">Rice</option>
                                                <option value="wheat">Wheat</option>
                                                <option value="sugarcane">Sugarcane</option>
                                                <option value="cotton">Cotton</option>
                                                <option value="vegetables">Vegetables</option>
                                                <option value="pulses">Pulses</option>
                                                <option value="oilseeds">Oilseeds</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="companyName">Company Name</Label>
                                            <Input
                                                id="companyName"
                                                type="text"
                                                value={formData.companyName}
                                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                                                placeholder="Enter company name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="industry">Industry</Label>
                                            <select
                                                id="industry"
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                value={formData.industry}
                                                onChange={(e) => handleInputChange('industry', e.target.value)}
                                            >
                                                <option value="">Select industry</option>
                                                <option value="technology">Technology</option>
                                                <option value="manufacturing">Manufacturing</option>
                                                <option value="energy">Energy</option>
                                                <option value="finance">Finance</option>
                                                <option value="retail">Retail</option>
                                                <option value="automotive">Automotive</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                                            <Input
                                                id="gstNumber"
                                                type="text"
                                                value={formData.gstNumber}
                                                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                                                placeholder="Enter GST number"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Password Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            placeholder="Create password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            placeholder="Confirm password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className={`w-full py-3 text-lg font-semibold ${
                                    userType === 'farmer' 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {userType === 'farmer' ? 'Register as Farmer' : 'Register as Company'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}