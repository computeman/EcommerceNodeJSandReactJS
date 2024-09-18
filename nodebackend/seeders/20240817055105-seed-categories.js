module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Category', [
      { name: 'Electronics', created_at: new Date(), updated_at: new Date() },
      { name: 'Books', created_at: new Date(), updated_at: new Date() },
      { name: 'Clothing', created_at: new Date(), updated_at: new Date() },
      { name: 'Home Appliances', created_at: new Date(), updated_at: new Date() },
      { name: 'Toys', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Category', null, {});
  }
};
