import Image from "next/image";
import { type MockUser } from "@/lib/mocks/user";

interface UserAvatarProps {
  user: MockUser;
  size?: number;
}

export function UserAvatar({ user, size = 32 }: UserAvatarProps) {
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  if (user.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        alt={user.name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-dark text-white font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </span>
  );
}