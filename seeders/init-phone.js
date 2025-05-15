const fs = require('fs');
const path = require('path');
const { sequelize, Brands, PhoneModel, PhoneModelType, PhoneModelSpec, PhoneModelAssociated } = require('../models');

const phoneModelsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../手机型号.json')));
const caseData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data1.json')));

async function initDatabase() {
  try {
    await sequelize.sync({ force: false }); // 清空并重建表结构

    const brandMap = {}; // 品牌 => ID
    const modelMap = {}; // 品牌_型号 => ID
    const typeMap = {};  // 手机壳类型 => ID
    const specMap = {};  // 壳规格 => ID

    // 插入品牌与型号
    for (const [brandName, models] of Object.entries(phoneModelsData)) {
      const brand = await Brands.create({ brand: brandName });
      brandMap[brandName] = brand.id;

      for (const model of models) {
        const phoneModel = await PhoneModel.create({
          brandId: brand.id,
          model
        });
        modelMap[`${brandName}_${model}`] = phoneModel.id;
      }
    }

    // 插入手机壳类型、规格和关联图
    for (const [typeName, specs] of Object.entries(caseData)) {
      let type = typeMap[typeName];
      if (!type) {
        const typeRow = await PhoneModelType.create({ model: typeName, brandId: 0 });
        typeMap[typeName] = typeRow.id;
        type = typeRow.id;
      }

      for (const [specName, brands] of Object.entries(specs)) {
        let spec = specMap[specName];
        if (!spec) {
          const specRow = await PhoneModelSpec.create({ spec_name: specName });
          specMap[specName] = specRow.id;
          spec = specRow.id;
        }

        for (const [brandName, models] of Object.entries(brands)) {
          for (const [modelName, info] of Object.entries(models)) {
            const modelKey = `${brandName}_${modelName}`;
            const phone_modelId = modelMap[modelKey];

            if (!phone_modelId) {
              console.warn(`跳过未找到型号：${modelKey}`);
              continue;
            }

            await PhoneModelAssociated.create({
              phone_modelId,
              phone_typeId: type,
              phone_model_specId: spec,
              image: info.foreImg
            });
          }
        }
      }
    }

    console.log('✅ 数据初始化完成');
    process.exit();
  } catch (err) {
    console.error('❌ 初始化出错:', err);
    process.exit(1);
  }
}

initDatabase();
