module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Order', [
      {
        id:1,
        user_id: 1, // Assuming user with id 1
        total_amount: 999.99,
        status: 'Pending',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Order', null, {});
  }
};
