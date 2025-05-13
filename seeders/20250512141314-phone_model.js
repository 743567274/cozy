'use strict';
const PhoneJson = require('../手机型号.json');
const { PhoneModel, Brands } = require('../models');
const { where } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const ARR = []; // 新建一个数组
    let index = 0;
    // 使用 for...of 替代 forEach，以支持 await
    for (const brand of Object.keys(PhoneJson)) {
      const brand_models = await Brands.findOne({
        where: {
          brand: brand
        }
      });
      if (!brand_models) {
        for (let i = 0; i < PhoneJson[brand].length; i++) {
          const model = PhoneJson[brand][i];
          index++;
          ARR.push({
            id: index,
            brandId: brand_models.id,
            model: model,
            created_at: new Date(),
            updated_at: new Date(),
          })
        }
      }
    }
    await queryInterface.bulkInsert('phone_models', ARR);
    console.log('手机机型数据初始化成功，条数为：', ARR.length);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};