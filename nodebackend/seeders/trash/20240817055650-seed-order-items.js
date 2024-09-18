module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('OrderItem', [
      {
        id:1,
        order_id: 1, // Assuming order with id 1
        product_id: 1, // Assuming product with id 1
        quantity: 1,
        price: 999.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderItem', null, {});
  }
};
