'use strict';
const PhoneJson = require('../手机型号.json');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const ARR = [];// 新建一个数组
    let index = 0;
    Object.keys(PhoneJson).forEach(brand => {
      PhoneJson[brand].forEach(model => {
        index++;
        ARR.push({
          id: index,
          brand: brand,
          model: model,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
    })
    await queryInterface.bulkInsert('phone_model', ARR)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
