module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Cart', [
      {
        id:1,
        user_id: 1, // Assuming user with id 1
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Cart', null, {});
  }
};
