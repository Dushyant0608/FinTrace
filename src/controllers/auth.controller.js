const { prisma } = require('@prisma/client');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailService = require('../services/email.service');



/**
 * - user register controller
 * - POST /api/auth/register
*/
async function userRegisterController(req, res) {
    const { email, name, password } = req.body;

    const isExist = await prisma.user.findUnique({ where: { email } });

    if (isExist) {
        return res.status(422).json({
            message: "User already exist with provided email.",
            status: "failed"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userID: createdUser.id }, process.env.JWT_SECRET, { expiresIn: "3d" });
    res.cookie("token", token);
    res.status(201).json({
        User: {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email
        },
        token,
    })

    await emailService.sendRegistrationEmail(createdUser.email, createdUser.name);
}

/**
 * - user login controller
 * - POST /api/auth/login
*/
async function userLoginController(req, res) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(401).json({
            message: "Email or Password is Invalid"
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or Password is Invalid"
        })
    }

    const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.cookie("token", token);
    res.status(200).json({
        User: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        token
    })


}

/**
 * - user logout controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    res.clearCookie("token");

    await prisma.tokenBlacklist.create({ data: { token } });

    res.status(200).json({
        message: "User logged out successfully"
    })
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}