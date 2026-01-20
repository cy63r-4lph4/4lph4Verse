export interface ArenaSchool {
  id: string;
  name: string;
  slug: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
  sector: string;
}
