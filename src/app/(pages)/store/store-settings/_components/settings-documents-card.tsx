import { Sparkles, FileText, Mail, ShieldCheck } from "lucide-react";

interface SettingsDocumentsCardProps {
  reportsChecked: boolean;
  onToggleReports: () => void;
  emailsChecked: boolean;
  onToggleEmails: () => void;
  publicBadgeChecked: boolean;
  onTogglePublicBadge: () => void;
}

export function SettingsDocumentsCard({
  reportsChecked,
  onToggleReports,
  emailsChecked,
  onToggleEmails,
  publicBadgeChecked,
  onTogglePublicBadge,
}: SettingsDocumentsCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Aplicação da Marca nos Documentos
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Selecione onde o logotipo e os dados da sua empresa serão exibidos
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Opção 1: Relatórios e Comprovantes */}
        <div
          onClick={onToggleReports}
          className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            reportsChecked
              ? "border-primary/40 bg-primary/5 shadow-xs"
              : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <div
            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
              reportsChecked
                ? "border-primary bg-primary text-white"
                : "border-input bg-background"
            }`}
          >
            {reportsChecked && (
              <span className="text-xs font-bold leading-none">✓</span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              Comprovantes de Atendimento e Recibos Digitais
            </span>
            <span className="text-xs text-muted-foreground leading-relaxed">
              Exibe o logo e razão social no cabeçalho dos recibos em PDF emitidos para os clientes.
            </span>
          </div>
        </div>

        {/* Opção 2: E-mails Transacionais */}
        <div
          onClick={onToggleEmails}
          className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            emailsChecked
              ? "border-primary/40 bg-primary/5 shadow-xs"
              : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <div
            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
              emailsChecked
                ? "border-primary bg-primary text-white"
                : "border-input bg-background"
            }`}
          >
            {emailsChecked && (
              <span className="text-xs font-bold leading-none">✓</span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              <Mail className="size-4 text-primary" />
              Notificações e E-mails aos Clientes
            </span>
            <span className="text-xs text-muted-foreground leading-relaxed">
              Inclui sua identidade visual em avisos automáticos de confirmação e lembretes de agendamento.
            </span>
          </div>
        </div>

        {/* Opção 3: Selo de Verificação Pública */}
        <div
          onClick={onTogglePublicBadge}
          className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            publicBadgeChecked
              ? "border-primary/40 bg-primary/5 shadow-xs"
              : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <div
            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
              publicBadgeChecked
                ? "border-primary bg-primary text-white"
                : "border-input bg-background"
            }`}
          >
            {publicBadgeChecked && (
              <span className="text-xs font-bold leading-none">✓</span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Selo de Empresa Verificada Agilis
            </span>
            <span className="text-xs text-muted-foreground leading-relaxed">
              Exibe a insígnia de credibilidade e segurança nas buscas de serviços e no seu perfil público.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
