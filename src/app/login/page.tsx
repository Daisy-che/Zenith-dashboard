'use client'; 
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';


const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const Login: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setApiError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setCookie('isLoggedIn', 'true', { maxAge: 60 * 60 * 24 * 365, path: '/' });
        setSuccessMessage("Logged in successfully! Redirecting...");
        router.push('/dashboard');
      } else {
        setApiError(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
       window.location.href = 'https://aquasense-e472a26d7581.herokuapp.com/auth/login';
     };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen font-sans">
   
    <div className="hidden sm:flex sm:w-1/2 bg-blue-100 items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      <img src="/lock.png" alt="Login illustration" className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg" />
    </div>
  
    <div className="w-full sm:w-1/2 flex items-center justify-center bg-white p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-blue-500">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        
          <div>
            <label htmlFor="email" className="block text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            {errors.email && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email.message}</p>}
          </div>
     
          <div>
            <label htmlFor="password" className="block text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-700 mb-1 sm:mb-2">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.password.message}</p>}
          </div>
          
          {apiError && <p className="text-red-500 text-xs sm:text-sm">{apiError}</p>}
          {successMessage && <p className="text-green-500 text-xs sm:text-sm">{successMessage}</p>}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 text-sm sm:text-base md:text-lg"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 sm:mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm sm:text-base md:text-lg">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="mt-4 sm:mt-6 w-full px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center bg-white border border-gray-300 rounded-md text-sm sm:text-base md:text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FcGoogle className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
            Continue with Google
          </button>
        </div>
        
        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm md:text-base text-gray-600">
          Don't have an account? <Link href="/sign-up" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  </div>
  );
};

export default Login;
