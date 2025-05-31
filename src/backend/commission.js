const express = require('express');
const router = express.Router();

// 佣金列表
router.get('/commission', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const commissions = await models.Commission.findAndCountAll({
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar']
        }
      ],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      data: commissions.rows,
      total: commissions.count,
      success: true,
      message: '获取佣金列表成功'
    });
  } catch (error) {
    res.status(500).json({
      message: '获取佣金列表失败',
      error: error.message,
      success: false
    })
  }
});

module.exports = router;