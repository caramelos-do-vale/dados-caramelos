export enum UserRole {
    ADMIN = 'Administrador',
}

export interface IUser {
    name: string;
    email: string;
    role: UserRole;
    active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
