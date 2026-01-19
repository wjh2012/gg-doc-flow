export interface ProxyConfig {
  prefix: string;
  upstream: string;
  authRequired: boolean;
}

export const proxyConfigs: ProxyConfig[] = [
  {
    prefix: '/auth',
    upstream: 'http://auth-service:3001',
    authRequired: false,
  },
  {
    prefix: '/orders',
    upstream: 'http://order-service:3002',
    authRequired: true,
  },
];
