"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileInfo } from "./_components/profile-info";
import { ProfileMenu } from "./_components/profile-menu";
import { AvatarModal } from "./_components/avatar-modal";
import { mockUser } from "@/lib/mocks/user";

export default function ProfilePage() {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-muted">

      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />

      <div className="bg-primary px-6 pb-20 pt-8" />

      {/* Conteúdo sobreposto */}
      <div className="mx-auto w-full max-w-lg px-6">
        <motion.div
          className="-mt-16 flex flex-col gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProfileHeader
            user={mockUser}
            onAvatarClick={() => setIsAvatarModalOpen(true)}
          />
          <ProfileInfo user={mockUser} />
          <ProfileMenu />
        </motion.div>
      </div>

    </main>
  );
}