export default () => ({
    port: parseInt(process.env.PORT, 10),
    databaseUrl: process.env.DATABASE_URL
});