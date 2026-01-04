const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      // Связь с альбомом
      Image.belongsTo(models.Album, {
        foreignKey: "albumId",
        as: "album",
      });
    }
  }

  Image.init(
    {
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "album_id",
        references: {
          model: "albums",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      originalPath: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "original_path",
      },
      webPath: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "web_path",
      },
      thumbnailPath: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "thumbnail_path",
      },
      filename: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      originalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "original_name",
      },
      mimeType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "mime_type",
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "uploaded_at",
      },
    },
    {
      sequelize,
      modelName: "Image",
      tableName: "images",
      underscored: true,
      timestamps: false, // используем свой uploadedAt
    }
  );

  return Image;
};
