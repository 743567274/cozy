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
      index++;
      ARR.push({
        id: index,
        brand: brand,
        created_at: new Date(),
        updated_at: new Date(),
      })
    })
    await queryInterface.bulkInsert('brands', ARR)
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
