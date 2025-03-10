type Users = {
    status: string;
    id: number;
    isOrganizer: boolean;
    useReferral?: string;
    username: string;
    email: string;
}

declare namespace Express {
    export interface Request {
        users?: Users;
    }
}
