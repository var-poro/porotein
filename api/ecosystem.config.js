module.exports = {
    apps: [
        {
            name: 'api',
            script: 'dist/index.js',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: process.env.PORT,
                JWT_SECRET: process.env.JWT_SECRET,
                JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
            },
        },
    ],
};