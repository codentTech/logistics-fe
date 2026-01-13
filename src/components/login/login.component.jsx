"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { Package, Shield, Truck } from "lucide-react";
import useLogin from "./use-login.hook";

export default function Login() {
  const {
    onSubmit,
    loading,
    register,
    handleSubmit,
    errors,
    email,
    password,
    tenantId,
  } = useLogin();

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:bg-gradient-to-br lg:from-indigo-600 lg:via-indigo-700 lg:to-indigo-800 lg:p-12">
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Package className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">OpsCore</h1>
            </div>
            <p className="mt-4 text-lg text-indigo-100">
              Real-time logistics management platform
            </p>
          </div>

          {/* Animated Road with Moving Trucks */}
          <div className="my-8 flex w-full items-center justify-center">
            <div className="relative h-64 w-full overflow-hidden">
              {/* Lane dividers - 4 lines creating 4 lanes */}
              <div className="absolute left-0 top-1/4 h-0.5 w-full border-t border-dashed border-white/40"></div>
              <div className="absolute left-0 top-2/4 h-0.5 w-full border-t border-dashed border-white/40"></div>
              <div className="absolute left-0 top-3/4 h-0.5 w-full border-t border-dashed border-white/40"></div>
              <div className="absolute left-0 bottom-0 h-0.5 w-full border-t border-dashed border-white/40"></div>

              {/* Lane 1 - Trucks moving left to right */}
              <div className="absolute top-2 h-14 w-14">
                <Truck className="h-14 w-14 animate-truck-left-1 text-white drop-shadow-lg" />
              </div>
              <div className="absolute top-2 h-14 w-14">
                <Truck className="h-14 w-14 animate-truck-left-1-delayed text-white drop-shadow-lg" />
              </div>

              {/* Lane 2 - Trucks moving right to left */}
              <div className="absolute top-[26%] h-14 w-14">
                <Truck className="h-14 w-14 animate-truck-right-1 text-white drop-shadow-lg" />
              </div>
              <div className="absolute top-[26%] h-14 w-14">
                <Truck className="h-14 w-14 animate-truck-right-1-delayed text-white drop-shadow-lg" />
              </div>

              {/* Lane 3 - Trucks moving left to right */}
              <div className="absolute top-[51%] h-14 w-14">
                <Truck className="h-14 w-14 animate-truck-left-2 text-white drop-shadow-lg" />
              </div>
              <div className="absolute top-[51%] h-14 w-14">
                <Truck className="h-14 w-14 animate-truck-left-2-delayed text-white drop-shadow-lg" />
              </div>

              {/* Lane 4 - Trucks moving right to left */}
              <div className="absolute top-[76%] h-14 w-14">
                <Truck className="h-14 w-14 animate-truck-right-2 text-white drop-shadow-lg" />
              </div>
              <div className="absolute top-[76%] h-14 w-14">
                <Truck className="h-14 w-14 animate-truck-right-2-delayed text-white drop-shadow-lg" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Real-Time Tracking
                </h3>
                <p className="mt-1 text-sm text-indigo-100">
                  Track shipments and drivers in real-time with live location
                  updates
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Secure & Reliable
                </h3>
                <p className="mt-1 text-sm text-indigo-100">
                  Multi-tenant architecture with enterprise-grade security
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
                <Package className="h-9 w-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">OpsCore</h1>
            <p className="mt-2 text-sm text-gray-600">
              Real-time logistics management
            </p>
          </div>

          {/* Desktop Welcome */}
          <div className="mb-8 hidden lg:block">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <CustomInput
                label="Email"
                name="email"
                register={register}
                errors={errors}
                placeholder="admin@tenant1.com"
                isRequired={true}
              />

              <CustomInput
                label="Password"
                name="password"
                type="password"
                register={register}
                errors={errors}
                placeholder="Enter your password"
                isRequired={true}
              />

              <CustomInput
                label="Tenant ID"
                name="tenantId"
                register={register}
                errors={errors}
                placeholder="Enter Tenant UUID"
                isRequired={true}
              />

              <div className="pt-2">
                <CustomButton
                  type="submit"
                  text="Sign in"
                  loading={loading}
                  className="btn-primary w-full"
                  disabled={!email || !password || !tenantId || loading}
                />
              </div>
            </form>

            {/* Help Text */}
            <div className="mt-6 rounded-lg bg-indigo-50 p-4">
              <p className="text-xs text-indigo-800">
                <strong>Need help?</strong> Contact your administrator for
                tenant ID and account access.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500">
            © 2024 OpsCore. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
