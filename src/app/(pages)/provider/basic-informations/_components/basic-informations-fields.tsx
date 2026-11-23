import { Input } from "@/components/ui/input";

interface BasicInformationsFieldsProps {
  storeName: string;
  slug: string;
  onStoreNameChange: (value: string) => void;
  onSlugChange: (value: string) => void;
}

export function BasicInformationsFields({
  storeName,
  slug,
  onStoreNameChange,
  onSlugChange,
}: BasicInformationsFieldsProps) {
  return (
    <>
      {/* Nome da loja */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="storeName" className="text-xs font-bold text-foreground">
          Nome da loja <span className="text-primary">*</span>
        </label>
        <Input
          id="storeName"
          required
          value={storeName}
          onChange={(e) => onStoreNameChange(e.target.value)}
          placeholder="Ex: Carlão Piscinas"
          className="h-11 rounded-xl"
        />
      </div>

      {/* URL */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="url" className="text-xs font-bold text-foreground">
          URL personalizada <span className="text-primary">*</span>
        </label>
        <div className="flex h-11 items-center overflow-hidden rounded-xl border border-input bg-background shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="flex h-full items-center border-r border-border bg-muted/50 px-3.5 text-sm font-medium text-muted-foreground select-none whitespace-nowrap">
            agilis.com/
          </span>
          <input
            id="url"
            type="text"
            required
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="h-full min-w-0 flex-1 border-0 bg-transparent px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder="carlao-piscinas"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Apenas letras minúsculas, números e hífens
        </p>
      </div>
    </>
  );
}
