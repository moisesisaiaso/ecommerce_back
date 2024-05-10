const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const Cart = sequelize.define("cart", {
    quantity: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    // userId
    // productId
});

module.exports = Cart;
