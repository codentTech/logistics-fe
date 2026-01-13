"use client";

import { isLoginVerified } from "@/common/utils/access-token.util";
import { login } from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  tenantId: Yup.string()
    .uuid("Tenant ID must be a valid UUID")
    .required("Tenant ID is required"),
});

export default function useLogin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { email, password, tenantId } = watch();

  useEffect(() => {
    if (isLoginVerified()) {
      router.push("/dashboard");
    }
  }, [router]);

  const moveRouter = () => {
    router.push("/dashboard");
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await dispatch(
        login({ payload: { ...values }, successCallBack: moveRouter })
      );
      // If login was successful, loading will be handled by the slice
      if (login.fulfilled.match(response)) {
        setLoading(false);
      } else if (login.rejected.match(response)) {
        setLoading(false);
        // Error will be shown via notistack from api.js
      }
    } catch (error) {
      setLoading(false);
      // Error handling is done in api.js interceptor
    }
  };

  return {
    onSubmit,
    loading,
    register,
    handleSubmit,
    errors,
    password,
    email,
    tenantId,
  };
}
