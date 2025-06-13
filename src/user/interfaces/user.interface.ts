export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    avatarUrl?:string;//setta como optional
    createdAt: Date;
}