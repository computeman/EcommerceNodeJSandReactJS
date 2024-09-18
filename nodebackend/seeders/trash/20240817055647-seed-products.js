module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Product', [
      {
        id:1,
        name: 'Laptop',
        description: 'A powerful laptop',
        price: 999.99,
        category: 'Electronics',
        stock: 10,
        image_url: 'https://media.wired.com/photos/64daad6b4a854832b16fd3bc/master/pass/How-to-Choose-a-Laptop-August-2023-Gear.jpg',
        creator_id: 2, // Assuming user with id 2 is the creator
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id:2,
        name: 'Smartphone',
        description: 'A new smartphone',
        price: 499.99,
        category: 'Electronics',
        stock: 20,
        image_url: 'https://images-cdn.ubuy.com.sa/63b46431ffafdf2f462e84a6-christmas-gifts-clearance-cbcbtwo-smart.jpg',
        creator_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Add more products as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Product', null, {});
  }
};
