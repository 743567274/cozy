'use strict';
const PhoneJson = require('../data1.json')
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
    const ARR = [];
    let index = 0;
    for (const PhoneType of Object.keys(PhoneJson)) {
      for (const PhoneModel of PhoneJson[PhoneType]) {
        index++;
        ARR.push({
          id: index,
          spec_name: PhoneModel
        })
      }
    }
    await queryInterface.bulkInsert('phone_model_spec', ARR);
    console.log('手机壳规格数据初始化完成，条数 -> ', ARR.length);
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
