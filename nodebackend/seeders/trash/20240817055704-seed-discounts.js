module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Discount', [
      {
        id:1,
        product_id: 1, // Assuming product with id 1
        discount_percentage: 10,
        start_date: new Date(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 10)),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        product_id: 2, // Assuming product with id 2
        discount_percentage: 5,
        start_date: new Date(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 5)),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Discount', null, {});
  }
};
