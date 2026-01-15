"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash("admin123", 12);

    await queryInterface.bulkInsert("users", [
      {
        login: "admin",
        password_hash: passwordHash,
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", { login: "admin" });
  },
};
