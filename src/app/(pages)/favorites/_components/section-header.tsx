import { Heart } from "lucide-react";

export function SectionHeader() {
  return (
    <div className="flex items-center gap-2 bg-primary/90 px-4 py-3 text-sm font-medium text-primary-foreground">
      <Heart className="h-4 w-4" />
      Seus serviços favoritos
    </div>
  );
}