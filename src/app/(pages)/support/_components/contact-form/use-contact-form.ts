"use client";

import { useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supportSchema, type SupportFormData } from "@/lib/validations/support";
import { sendSupportMessage } from "@/lib/support/support-service";
import { useAuth } from "@/lib/auth/auth-context";

export interface UseContactFormReturn {
  form: UseFormReturn<SupportFormData>;
  isSubmitting: boolean;
  isSuccess: boolean;
  serverError: string | null;
  successMessageId: string | null;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  messageLength: number;
}

export function useContactForm(): UseContactFormReturn {
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessageId, setSuccessMessageId] = useState<string | null>(null);

  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      userId: user?.id ?? "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      subject: undefined,
      message: "",
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting },
  } = form;

  // Atualiza os campos caso o usuário faça login ou o perfil seja carregado assincronamente
  useEffect(() => {
    if (user?.name && !getValues("name")) {
      setValue("name", user.name);
    }
    if (user?.email && !getValues("email")) {
      setValue("email", user.email);
    }
    if (user?.id) {
      setValue("userId", user.id);
    }
  }, [user, setValue, getValues]);

  const messageValue = watch("message") || "";

  async function handleFormSubmit(data: SupportFormData) {
    setServerError(null);
    setIsSuccess(false);

    try {
      const response = await sendSupportMessage({
        userId: user?.id || data.userId || undefined,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      setIsSuccess(true);
      if (response.messageId) {
        setSuccessMessageId(response.messageId);
      }

      reset({
        userId: user?.id ?? "",
        name: user?.name ?? "",
        email: user?.email ?? "",
        subject: undefined,
        message: "",
      });
    } catch (err: unknown) {
      console.error("[ContactForm] Erro ao enviar mensagem:", err);
      let message = "Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.";
      if (err instanceof Error && err.message) {
        message = err.message;
      }
      setServerError(message);
    }
  }

  return {
    form,
    isSubmitting,
    isSuccess,
    serverError,
    successMessageId,
    onSubmit: handleSubmit(handleFormSubmit),
    messageLength: messageValue.length,
  };
}
