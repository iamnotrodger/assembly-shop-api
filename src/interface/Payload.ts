export default interface Payload {
    user_id: number;
    email: string;
    token_id?: string;
    iat?: number;
    exp?: number;
}
