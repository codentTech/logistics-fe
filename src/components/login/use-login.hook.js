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
});

export default function useLogin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [requiresTenantSelection, setRequiresTenantSelection] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { email, password } = watch();

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
        login({
          payload: {
            email: values.email,
            password: values.password,
            tenantId: selectedTenantId || undefined,
          },
          successCallBack: moveRouter,
        })
      );

      if (login.fulfilled.match(response)) {
        const result = response.payload;
        
        // Check if tenant selection is required
        if (result.requiresTenantSelection && result.tenants) {
          setRequiresTenantSelection(true);
          setTenants(result.tenants);
          setLoading(false);
        } else {
          // Direct login success
          setLoading(false);
        }
      } else if (login.rejected.match(response)) {
        setLoading(false);
        // Error will be shown via notistack from api.js
      }
    } catch (error) {
      setLoading(false);
      // Error handling is done in api.js interceptor
    }
  };

  const handleTenantSelect = async (tenantId) => {
    setSelectedTenantId(tenantId);
    setLoading(true);
    
    // Re-submit login with selected tenant
    const values = getValues();
    try {
      const response = await dispatch(
        login({
          payload: {
            email: values.email,
            password: values.password,
            tenantId: tenantId,
          },
          successCallBack: moveRouter,
        })
      );

      if (login.fulfilled.match(response)) {
        setLoading(false);
        // Login successful, redirect will happen via callback
      } else if (login.rejected.match(response)) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
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
    requiresTenantSelection,
    tenants,
    handleTenantSelect,
  };
}
