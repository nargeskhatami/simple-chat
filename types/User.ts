export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified?: any | null;
  image: string | null;
  isCurrentUser?: boolean;
}
