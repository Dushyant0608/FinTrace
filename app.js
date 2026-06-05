const express = require('express');
const cookieparser = require("cookie-parser");
const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cookieparser());



/**
 * - Router required
 */
const authRouter = require("./src/routes/auth.route");
const accountRouter = require("./src/routes/account.route");
const transactionRouter = require("./src/routes/transaction.route");
/**
 * - dummy route
 */
app.get('/' , (req,res)=>{
    res.send("Ledger is up and running")
})


/**
 * - routes used
 */
app.use("/api/auth" , authRouter);
app.use("/api/account" , accountRouter);
app.use("/api/transaction" , transactionRouter);



module.exports = app;