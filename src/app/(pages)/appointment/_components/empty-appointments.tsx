export function EmptyAppointments() {
  return (
    <div className="flex flex-col gap-2 px-4 py-6">
      <h1 className="text-lg font-bold text-foreground">
        Seus Agendamentos estão vazios
      </h1>
      <p className="text-sm text-muted-foreground">
        Você ainda não possui nenhum agendamento, selecione um serviço e
        negocie com o prestador para um agendamento agilizado.
      </p>
    </div>
  );
}