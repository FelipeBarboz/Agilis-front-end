import Link from "next/link";
import { IdCard, Mail, Pencil, Phone, User } from "lucide-react";
import type { MockUser } from "@/lib/mocks/user";

interface ProfileInfoProps {
  user: MockUser;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Informações pessoais
          </h2>
          <p className="text-sm text-muted-foreground">
            Seus dados de contato e identificação
          </p>
        </div>
        <Link
          href="/profile/edit"
          className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
        >
          <Pencil className="size-3.5" />
          Editar
        </Link>
      </div>

      <div className="mt-2 divide-y border-t">
        <div className="flex items-center gap-3 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Nome</span>
            <span className="text-sm font-medium text-foreground">{user.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IdCard className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">CPF</span>
            <span className="text-sm font-medium text-foreground">
              {user.cpf ?? "Não informado"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">E-mail</span>
            <span className="text-sm font-medium text-foreground">{user.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Phone className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Telefone</span>
            <span className="text-sm font-medium text-foreground">
              {user.phone ?? "Não informado"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}