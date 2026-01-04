const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    static associate(models) {
      // Связь с изображениями
      Album.hasMany(models.Image, {
        foreignKey: "albumId",
        as: "images",
        onDelete: "CASCADE",
      });

      // Связь с обложкой альбома
      Album.belongsTo(models.Image, {
        foreignKey: "coverImageId",
        as: "coverImage",
        constraints: false,
      });
    }
  }

  Album.init(
    {
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      coverImageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "cover_image_id",
      },
    },
    {
      sequelize,
      modelName: "Album",
      tableName: "albums",
      underscored: true,
      timestamps: true,
    }
  );

  return Album;
};
