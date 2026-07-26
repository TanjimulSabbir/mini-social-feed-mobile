export type Role = 'USER' | 'AUTHOR' | 'ADMIN';
export type ActiveStatus = 'ACTIVE' | 'BLOCKED';

export interface Profile {
  id: string;
  profilePhoto: string | null;
  bio: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  activeStatus: ActiveStatus;
  role: Role;
  createdAt: string;
  updatedAt: string;
  profile?: Profile | null;
}

// Minimal shape typically embedded in Post/Comment author relations
export interface AuthorSummary {
  id: string;
  name: string;
  profile?: Pick<Profile, 'profilePhoto'> | null;
}