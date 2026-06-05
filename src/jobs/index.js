const cron = require('node-cron');
const { cleanExpiredTokens } = require('./tokenCleanup');

function initCronJobs() {
    
    cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Starting expired token cleanup...');
        try {
            await cleanExpiredTokens();
            console.log('[CRON] Token cleanup completed successfully.');
        } catch (error) {
            console.error('[CRON ERROR] Token cleanup failed:', error);
        }
    });

    console.log('Background jobs initialized.');
}

module.exports = { initCronJobs }