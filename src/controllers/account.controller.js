const {prisma} = require('@prisma/client');

async function createAccountController (req,res) {
    const user = req.user;

    const account = await prisma.account.create({ data : { userID: req.user.id }});

    res.status(201).json({
        account
    })
}

async function getAllUserAccounts(req,res) {

    
    const accounts = await prisma.account.findMany({ where: { userID: req.user.id } });

    res.status(200).json({
        accounts
    })
}

async function getAccountBalance(req,res){
    const { accountId } = req.params;

    const account = await account.findFirst({ where: { id: accountId, userID: req.user.ID} });

    if(!account){
        return res.status(404).json({
            message : "Account not found"
        })
    }

    const result = await prisma.$queryRaw`
        SELECT
            COALESCE(SUM(CASE WHEN type='CREDITED' THEN amount ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN TYPE='DEBITED' THEN amount ELSE 0 END) , 0) AS balance
        FROM ledger_entries
        WHERE account_id = ${accountId}
    `;

    const balance = result[0].balance ?? 0;

    res.status(200).json({
        accountId : account._id,
        balance : balance
    })
}

module.exports = {
    createAccountController,
    getAllUserAccounts,
    getAccountBalance
}