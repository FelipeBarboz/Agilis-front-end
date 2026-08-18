"use client";

import { useRef } from "react";
import { Upload, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type React from "react";

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AvatarOption = {
  icon: React.ElementType;
  label: string;
  description: string;
  action: "upload" | "remove";
  danger?: boolean;
};

const options: AvatarOption[] = [
  {
    icon: Upload,
    label: "Escolher do computador",
    description: "Selecione uma imagem do seu dispositivo",
    action: "upload",
  },
  {
    icon: Trash2,
    label: "Remover foto",
    description: "Voltar para o avatar padrão com suas iniciais",
    action: "remove",
    danger: true,
  },
];

export function AvatarModal({ isOpen, onClose }: AvatarModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleOption(action: AvatarOption["action"]) {
    if (action === "upload") {
      fileInputRef.current?.click();
      return;
    }
    if (action === "remove") {
      // TODO: remover foto via backend
      console.log("Remover foto");
      onClose();
      return;
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: fazer upload via backend
      console.log("Arquivo selecionado:", file.name);
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal centralizado */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">
                  Foto de perfil
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Opções */}
              <div className="flex flex-col gap-2">
                {options.map(({ icon: Icon, label, description, action, danger }) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => handleOption(action)}
                    className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      danger ? "bg-destructive/10" : "bg-primary/10"
                    }`}>
                      <Icon
                        size={17}
                        className={danger ? "text-destructive" : "text-primary"}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${
                        danger ? "text-destructive" : "text-foreground"
                      }`}>
                        {label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Input de arquivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}