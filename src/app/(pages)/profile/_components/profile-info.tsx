import Link from "next/link";
import { Mail, Phone, User, Pencil } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { type MockUser } from "@/lib/mocks/user";

interface ProfileInfoProps {
  user: MockUser;
}

const fields = [
  { icon: User,  label: "Nome",     key: "name"  },
  { icon: Mail,  label: "E-mail",   key: "email" },
  { icon: Phone, label: "Telefone", key: "phone" },
] as const;

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <h2 className="text-sm font-semibold text-foreground">
          Informações pessoais
        </h2>
        <Link
          href="/profile/edit"
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <Pencil size={12} />
          Editar
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col divide-y divide-border pt-2">
        {fields.map(({ icon: Icon, label, key }) => (
          <div key={key} className="flex items-center gap-3 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon size={15} className="text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-sm font-medium text-foreground">
                {key === "phone"
                  ? user.phone ?? "Não informado"
                  : user[key]}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}