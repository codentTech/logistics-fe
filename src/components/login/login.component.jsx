"use client";

import { useSelector } from "react-redux";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import useLogin from "./use-login.hook";
import CustomInput from "@/common/components/custom-input/custom-input.component";

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
  
  const { login: loginState } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">OpsCore</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            
            {loginState?.isError && loginState?.message && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {loginState.message}
              </div>
            )}

            <div className="pt-1">
              <CustomButton
                type="submit"
                text={loading ? "Signing in..." : "Sign in"}
                variant="primary"
                className="w-full h-11 font-medium !bg-indigo-600 hover:!bg-indigo-700"
                loading={loading}
                disabled={!email || !password || !tenantId || loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
