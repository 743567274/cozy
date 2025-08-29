'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

// 根据配置创建 Sequelize 实例
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 👇 新增：主动测试数据库连接
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功！');
  } catch (error) {
    console.error('❌ 数据库连接失败！请检查以下信息：');
    console.error('   - 数据库名称、用户名、密码是否正确');
    console.error('   - 数据库服务是否已启动');
    console.error('   - 网络或权限配置是否正确');
    console.error(`   错误详情: ${error.message}`);

    // 可选：连接失败时退出进程
    process.exit(1); // 防止应用继续启动
  }
}

// 立即执行连接测试（异步）
connectToDatabase();

// 加载模型
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 建立模型之间的关联
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 导出实例以便在应用中使用
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;