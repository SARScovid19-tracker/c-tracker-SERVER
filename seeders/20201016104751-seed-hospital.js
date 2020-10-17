'use strict';
const fs = require('fs')
const {hashData} = require('../helpers/bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const hospitals = JSON.parse(fs.readFileSync('./seeders/json-source/hospital.json'))
   for(let i = 0; i < hospitals.length; i++) {
     hospitals[i].password = hashData(hospitals[i].password)
     hospitals[i].createdAt = new Date()
     hospitals[i].updatedAt = new Date()
   }
   await queryInterface.bulkInsert('Hospitals', hospitals, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Hospitals', null, {})
  }
};
