module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Review', [
      {
        id:1,
        user_id: 1, // Assuming user with id 1
        product_id: 1, // Assuming product with id 1
        rating: 5,
        comment: 'Great product!',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        user_id: 1,
        product_id: 2, // Assuming product with id 3
        rating: 4,
        comment: 'Interesting read.',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Review', null, {});
  }
};
