export type AvatarOption = {
  icon: React.ElementType;
  label: string;
  description: string;
  action: "upload" | "remove";
  danger?: boolean;
};