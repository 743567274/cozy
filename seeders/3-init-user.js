const SnowflakeID = require('snowflake-id').default;
const { faker } = require('@faker-js/faker'); // 需要安装 @faker-js/faker
const snowflake = new SnowflakeID({ mid: 1 }); // 机器 ID 自定义

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { User } = require('../models');

        const users = []; // 存储已创建的用户实例，用于设置 superiorId
        const baseAvatar = 'https://picsum.photos/200'; // 固定头像地址（可带缓存随机参数，也可不加）

        for (let i = 0; i < 100; i++) {
            const id = snowflake.generate();

            // 随机选择一个已存在的用户作为上级（避免第一个用户报错）
            let superiorId = null;
            if (users.length > 0) {
                // 从已创建的用户中随机选一个作为上级
                const randomIndex = Math.floor(Math.random() * users.length);
                superiorId = users[randomIndex].id;
            }

            // 生成唯一的 openid（使用 snowflake 或 faker.uuid 避免重复）
            const openid = `o${faker.string.alphanumeric(28)}`; // 微信 openid 格式类似 o 开头 29 位字符串

            // 创建用户并暂存
            const user = await User.create({
                id,
                name: `微信用户${i + 1}`,
                username: null,
                password: null,
                avatar: `${baseAvatar}?t=${id}`, // 使用 ID 作为缓存 key，避免重复图片
                superiorId,
                openid,
                balance: 0.00,
                visit_count: 0,
                last_login: new Date()
            });

            // 将创建的用户加入数组
            users.push(user);
        }

        console.log('✅ 成功插入 100 个随机用户');
    },

    down: async (queryInterface, Sequelize) => {
        // 回滚时删除所有插入的用户（根据 name 模式删除）
        const { User } = require('../models');
        await User.destroy({
            where: {
                name: {
                    [Sequelize.Op.like]: '微信用户%'
                }
            }
        });
        console.log('🗑️  已删除所有微信用户');
    }
};