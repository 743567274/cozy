const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { administrator } = require('../../models');

// 生成随机字符串
const generateRandomString = (length = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 后台登录
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({
                message: '用户名或密码不能为空',
            });
        }
        const user = await administrator.findOne({
            where: {
                username,
                password,
            },
        });
        if (user) {
            const token = generateRandomString(32);
            const jwt_token = jwt.sign(
                { username: user.username, token: token },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );
            await administrator.update(
                { token: token },
                { where: { username: user.username } }
            );
            return res.status(200).json({
                message: '登录成功',
                success: true,
                token: jwt_token
            });
        } else {
            return res.status(401).json({
                message: '用户名或密码错误',
            }); // 401 Unauthorized
        }
    } catch (error) {
        console.error('后台登录错误 -> ', error);
        return res.status(500).json({
            message: '服务器错误',
        });
    }
});

module.exports = router;