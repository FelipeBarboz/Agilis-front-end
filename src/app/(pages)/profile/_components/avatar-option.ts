import type { AvatarOption } from "@/types/avatar-option";
import { Upload, Trash2 } from "lucide-react";

export const options: AvatarOption[] = [
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