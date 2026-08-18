export type MockUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
};

export const mockUser: MockUser = {
  id: "user-1",
  name: "Caio Henrique",
  email: "caio@email.com",
  phone: "11 98765-4321",
  avatarUrl: null,
};