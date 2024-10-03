"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import * as yup from "yup";
import { setCookie } from "nookies";

import { postUser } from "../components/utils/postUser";

interface UserData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  role: string;
}

const signupSchema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  phone_number: yup.string().required("Phone number is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  role: yup.string().required("Role is required"),
});

export default function SignUpForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserData>({
    resolver: yupResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: UserData) => {
    try {
      const response = await postUser(data);
      console.log(response);

      if (response.error) {
        setErrorMessage(response.error);
      } else if (response.data) {
        const { token, userId } = response.data;

        setCookie(null, "authToken", token, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        setCookie(null, "userId", userId, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        setSuccessMessage(
          "Account created successfully! Redirecting to Login..."
        );
        setTimeout(() => {
          reset();
          setSuccessMessage(null);
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center ">
        <Image
          src="/images/background.png"
          alt="People assembling puzzle"
          width={600}
          height={600}
          className="max-w-full h-auto  lg:"
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-start justify-center lg:">
        <div className="max-w-md w-full">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-[#0088ff] text-center ">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label
                htmlFor="firstName"
                className="block font-medium text-gray-700 text-lg lg:text-xl"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                {...register("first_name")}
                className={` block w-full py-2 px-3 bg-transparent border-2 border-blue-500 rounded-lg ${
                  errors.first_name ? "border-red-500" : ""
                }`}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-lg lg:text-xl font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                {...register("last_name")}
                className={` block w-full py-2 px-3 bg-transparent border-2 border-blue-500 rounded-lg ${
                  errors.last_name ? "border-red-500" : ""
                }`}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg lg:text-xl font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={` block w-full py-2 px-3 bg-transparent border-2 border-blue-500 rounded-lg ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-lg lg:text-xl font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                {...register("phone_number")}
                className={` block w-full py-2 px-3 bg-transparent border-2 border-blue-500 rounded-lg ${
                  errors.phone_number ? "border-red-500" : ""
                }`}
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg lg:text-xl font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  className={`mt-1 block w-full py-2 px-3 bg-transparent border-2 border-blue-500 rounded-lg ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-lg lg:text-xl font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                className={`mt-1 block w-full py-2 px-3 bg-white border-2 ${
                  errors.role ? "border-red-500" : "border-blue-500"
                } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select a role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="Estate_Associate">Estate Associate</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

            <div>
              <button
                type="submit"
                className={`w-full mt-4 flex justify-center bg-[#008fff] text-white py-2 px-4 font-bold rounded-lg hover:bg-[#EF5B1C] transition-colors duration-300 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}