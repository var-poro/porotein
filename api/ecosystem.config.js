module.exports = {
    apps: [
        {
            name: 'api',
            script: 'dist/index.js',
            env: {
                NODE_ENV: 'development',
                PORT: 4000,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 4000,
                JWT_SECRET: process.env.JWT_SECRET,
                JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
                EMAIL_HOST: process.env.EMAIL_HOST,
                EMAIL_PORT: process.env.EMAIL_PORT,
                EMAIL_USER: process.env.EMAIL_USER,
                EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
            },
        },
    ],
};