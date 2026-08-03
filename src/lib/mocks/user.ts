export type MockUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

export const mockUser: MockUser = {
  id: "user-1",
  name: "Caio Henrique",
  email: "caio@email.com",
  avatarUrl: null, // quando vier do backend, será uma URL de imagem
};