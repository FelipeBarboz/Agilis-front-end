export function EmptyFavorites() {
  return (
    <div className="flex flex-col gap-2 px-4 py-6">
      <h1 className="text-lg font-bold text-foreground">
        Você ainda não tem favoritos
      </h1>
      <p className="text-sm text-muted-foreground">
        Toque no coração de um serviço para salvá-lo aqui e encontrar mais
        rápido da próxima vez.
      </p>
    </div>
  );
}