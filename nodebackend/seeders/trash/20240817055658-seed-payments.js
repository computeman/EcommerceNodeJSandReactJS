module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Payment', [
      {
        id:1,
        user_id: 1, // Assuming user with id 1
        order_id: 1, // Assuming order with id 1
        amount: 999.99,
        payment_method: 'Credit Card',
        status: 'Completed',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Payment', null, {});
  }
};
