export default interface AuthManager {
    isAuthenticated(): boolean;
    getAccessToken(): string;
    checkAuthentication(): Promise<boolean>;
}
