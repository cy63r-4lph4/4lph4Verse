export interface Course {
    id: string;
    code: string;
    name: string;
    members: number;
}

export interface CurrentUser {
    name: string;
    level: number;
    rank: number;
    avatar: string;
}
