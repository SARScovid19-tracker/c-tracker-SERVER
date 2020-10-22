'use strict';
const fs = require('fs')

const users = JSON.parse(fs.readFileSync('./seeders/json-source/user.json'))
for(let i = 0; i < users.length; i++) {
  users[i].createdAt = new Date()
  users[i].updatedAt = new Date()
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
   await queryInterface.bulkInsert('Users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  }
};
