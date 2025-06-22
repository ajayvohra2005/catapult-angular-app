import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://cognito-idp.your-aws-region.amazonaws.com/your-user-pool-id',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: 'your-cognito-app-client-id',
    scope: 'email openid',
    responseType: 'code',
    useRefreshToken: true,
    logLevel: LogLevel.Debug,
  }
}
