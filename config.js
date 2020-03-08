
// 默认情况下生产环境使用服务器地址，开发环境使用本地地址
export const baseUrl = process.env.NODE_ENV === 'production' ? 'https://118.123.15.235:3000' : 'https://localhost:3000';
