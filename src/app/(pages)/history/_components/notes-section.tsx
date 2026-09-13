import { FileText } from "lucide-react";

interface NotesSectionProps {
  notes: string;
}

export function NotesSection({ notes }: NotesSectionProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
      <div className="mb-1.5 flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <h4 className="text-xs font-bold text-foreground">Observações</h4>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{notes}</p>
    </div>
  );
}
