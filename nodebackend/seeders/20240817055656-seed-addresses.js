module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Address', [
      {
        id:1,
        user_id: 1, // Assuming user with id 1
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip_code: '12345',
        country: 'USA',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        user_id: 2,
        street: '456 Elm St',
        city: 'Othertown',
        state: 'NY',
        zip_code: '67890',
        country: 'USA',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Address', null, {});
  }
};
