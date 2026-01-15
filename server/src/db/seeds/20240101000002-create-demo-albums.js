"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("albums", [
      {
        name: "Интерьеры",
        description: "Интерьерная съёмка и ретушь",
        cover_image_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Портреты",
        description: "Портретная ретушь",
        cover_image_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Предметная съёмка",
        description: "Предметная и food-фотография",
        cover_image_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("albums", null, {});
  },
};
