'use strict';
const PhoneJson = require('../手机型号.json');
const { PhoneModel } = require('../models');
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
      const brand_models = await PhoneModel.findOne({
        where: {
          brand: brand
        }
      });
      if(!brand_models){
        
      }
    }

    await queryInterface.bulkInsert('phone_models', ARR);
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