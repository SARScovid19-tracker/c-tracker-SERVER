'use strict';
const fs = require('fs')

const userHospital = JSON.parse(fs.readFileSync('./seeders/json-source/userHospital.json'))
for(let i = 0; i < userHospital.length; i++) {
  userHospital[i].createdAt = new Date()
  userHospital[i].updatedAt = new Date()
}
// console.log(users); // as expected


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
   await queryInterface.bulkInsert('UserHospitals', userHospital, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('UserHospitals', null, {})
  }
};
