'use strict';
const fs = require('fs')

const userRestaurant = JSON.parse(fs.readFileSync('./seeders/json-source/userRestaurant.json'))
for(let i = 0; i < userRestaurant.length; i++) {
  userRestaurant[i].createdAt = new Date()
  userRestaurant[i].updatedAt = new Date()
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
   await queryInterface.bulkInsert('UserRestaurants', userRestaurant, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('UserRestaurants', null, {})
  }
};
