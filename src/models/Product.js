const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Product = sequelize.define("product", {
    title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    //categoryId
});

module.exports = Product;
