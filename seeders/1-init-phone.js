'use strict';

const fs = require('fs');
const path = require('path');
const host = 'http://image1.cozyapp.top/'

// 修改为你的 JSON 文件实际路径
const data = require(path.resolve(__dirname, '../init_data/data.json'));

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {
      Brands,
      PhoneModel,
      PhoneModelType,
      PhoneModelSpec,
      PhoneModelAssociated
    } = require('../models');

    const brandMap = new Map();
    const typeMap = new Map();
    const specMap = new Map();
    const phoneModelMap = new Map();
    const associatedSet = new Set(); // 去重关联项

    for (const typeName of Object.keys(data)) {
      // 1. 插入壳类型（带图片）
      const typeImagePath = host + `phone/${typeName}/${typeName}.png`;
      let [typeInstance] = await PhoneModelType.findOrCreate({
        where: { type_name: typeName },
        defaults: {
          status: true,
          image: typeImagePath
        }
      });
      typeMap.set(typeName, typeInstance);

      const specGroup = data[typeName];

      for (const specName of Object.keys(specGroup)) {
        // 2. 插入壳规格
        let [specInstance] = await PhoneModelSpec.findOrCreate({
          where: { spec_name: specName },
          defaults: { status: true }
        });
        specMap.set(specName, specInstance);

        const brandGroup = specGroup[specName];

        for (const brandName of Object.keys(brandGroup)) {
          // 3. 插入品牌
          let [brandInstance] = await Brands.findOrCreate({
            where: { brand: brandName }
          });
          brandMap.set(brandName, brandInstance);

          const modelGroup = brandGroup[brandName];

          for (const modelName of Object.keys(modelGroup)) {
            // foreImg 前面添加 /
            const foreImg = host + modelGroup[modelName].foreImg;

            const brandId = brandInstance.id;
            const modelKey = `${brandId}_${modelName}`;

            let phoneModelInstance;
            if (!phoneModelMap.has(modelKey)) {
              [phoneModelInstance] = await PhoneModel.findOrCreate({
                where: {
                  brandId: brandId,
                  model: modelName
                }
              });
              phoneModelMap.set(modelKey, phoneModelInstance);
            } else {
              phoneModelInstance = phoneModelMap.get(modelKey);
            }

            // 4. 插入关联 PhoneModelAssociated
            const associatedKey = `${phoneModelInstance.id}_${typeInstance.id}_${specInstance.id}`;
            if (!associatedSet.has(associatedKey)) {
              await PhoneModelAssociated.findOrCreate({
                where: {
                  phone_modelId: phoneModelInstance.id,
                  phone_typeId: typeInstance.id,
                  phone_model_specId: specInstance.id
                },
                defaults: {
                  image: foreImg
                }
              });
              associatedSet.add(associatedKey);
            }
          }
        }
      }
    }

    console.log('✅ 数据初始化完成');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('phone_model_associated', null, {});
    await queryInterface.bulkDelete('phone_models', null, {});
    await queryInterface.bulkDelete('brands', null, {});
    await queryInterface.bulkDelete('phone_model_spec', null, {});
    await queryInterface.bulkDelete('phone_model_type', null, {});
  }
};
