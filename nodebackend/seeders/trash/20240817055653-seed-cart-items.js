module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('CartItem', [
      {
        id:1,
        cart_id: 1, // Assuming cart with id 1
        product_id: 2, // Assuming product with id 2
        quantity: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CartItem', null, {});
  }
};
