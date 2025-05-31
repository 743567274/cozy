const express = require('express');
const router = express.Router();
const { Article } = require('../../models');

// 新增文章
router.post('/add', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                message: '标题和内容不能为空',
                success: false
            });
        }
        await Article.create({
            title,
            content
        });
        return res.status(201).json({
            message: '新增文章成功',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: '新增文章失败',
            error: err.message,
            success: false
        });
    }
});

// 删除文章
router.post('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        await Article.destroy({
            where: {
                id
            }
        });
        return res.status(200).json({
            message: '删除文章成功',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: '删除文章失败',
            error: error.message,
            success: false
        })
    }
})

// 修改文章
router.post('/update', async (req, res) => {
    try {
        const { id, title, content } = req.body;
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        if (!title || !content) {
            return res.status(400).json({
                message: '标题和内容不能为空',
                success: false
            })
        }
        await Article.update({
            title,
            content
        }, {
            where: {
                id
            }
        });
        return res.status(200).json({
            message: '修改文章成功',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: '修改文章失败',
            error: error.message,
            success: false
        })
    }
});

// 获取文章列表
router.get('/list', async (req, res) => {
    try {
        const data_article = await Article.findAll({
            attributes: ['id', 'title', 'createdAt', 'updatedAt']
        });
        return res.status(200).json({
            message: '获取文章列表成功',
            data: data_article,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: '获取文章列表失败',
            error: error.message,
        })
    }
})

// 获取文章详情
router.get('/', async (req, res) => {
    try {
        const { id } = req.query;
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        const data_article = await Article.findOne({
            where: {
                id
            }
        })
        if (!data_article) {
            return res.status(400).json({
                message: '文章不存在',
                success: false
            });
        }
        return res.status(200).json({
            message: '获取文章详情成功',
            data: data_article,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: '获取文章详情失败',
            error: error.message,
            success: false
        })
    }
})

module.exports = router;