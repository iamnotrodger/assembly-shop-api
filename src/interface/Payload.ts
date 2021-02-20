export default interface Payload {
    userID: number;
    email: string;
    token_id?: string;
    iat?: number;
    exp?: number;
}
