const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
    log: ['error', 'warn'],
});

module.exports = prisma;