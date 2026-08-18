"use client";

import { Camera } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { type MockUser } from "@/lib/mocks/user";

interface ProfileHeaderProps {
  user: MockUser;
  onAvatarClick: () => void;
}

export function ProfileHeader({ user, onAvatarClick }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 shadow-sm border border-border">

      {/* Avatar com botão de câmera */}
      <div className="relative">
        <UserAvatar user={user} size={88} />
        <button
          type="button"
          onClick={onAvatarClick}
          aria-label="Trocar foto de perfil"
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-opacity hover:opacity-90"
        >
          <Camera size={14} />
        </button>
      </div>

      {/* Nome e email */}
      <div className="text-center">
        <h1 className="text-lg font-bold text-foreground">{user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

    </div>
  );
}