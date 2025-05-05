import express, { request } from 'express';
const router = express.Router();
import { z } from 'zod';
import jwt from 'jsonwebtoken';
const { administrator } = require('../../../models');

const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

router.post('/', async (req, res) => {
    const { username, password } = loginSchema.parse(req.body);
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
            const token = jwt.sign(
                { username: user.username, id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );
            return res.status(200).json({
                message: '登录成功',
                data: user,
            });
        } else {
            return res.status(401).json({
                message: '用户名或密码错误',
            }); // 401 Unauthorized
        }
    } catch (error) {
        return res.status(500).json({
            message: '服务器错误',
        });
    }
});

module.exports = router;