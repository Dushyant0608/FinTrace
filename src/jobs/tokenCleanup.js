const prisma = require('../config/db');
async function cleanExpiredTokens() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    
    const { count } = await prisma.tokenBlacklist.deleteMany({
        where: { createdAt: { lt: threeDaysAgo } },
    });
    
    console.log(`Cleaned ${count} expired blacklisted tokens`);
}
module.exports = { cleanExpiredTokens };