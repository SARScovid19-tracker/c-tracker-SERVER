'use strict';
const fs = require('fs')

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
   let restaurants = JSON.parse(fs.readFileSync('./seeders/json-source/restaurant.json'))
   for(let i = 0; i < restaurants.length; i++) {
     restaurants[i].createdAt = new Date()
     restaurants[i].updatedAt = new Date()
   }
   await queryInterface.bulkInsert('Restaurants', restaurants, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
};
