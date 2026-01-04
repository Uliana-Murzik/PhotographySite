module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("images", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      album_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "albums",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      original_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      web_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      thumbnail_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      filename: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      original_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mime_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      width: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      uploaded_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Индексы для оптимизации запросов
    await queryInterface.addIndex("images", ["album_id"]);
    await queryInterface.addIndex("images", ["uploaded_at"]);

    // Добавляем foreign key для cover_image_id в albums
    await queryInterface.addConstraint("albums", {
      fields: ["cover_image_id"],
      type: "foreign key",
      name: "albums_cover_image_fk",
      references: {
        table: "images",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("albums", "albums_cover_image_fk");
    await queryInterface.dropTable("images");
  },
};
