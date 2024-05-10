const catchError = require("../utils/catchError");
const Purchase = require("../models/Purchase");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");

const getAll = catchError(async (req, res) => {
    const userId = req.user.id;
    const results = await Purchase.findAll({
        where: { userId },
        include: [
            {
                model: Product,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                    {
                        model: Category,
                        attributes: ["name"],
                    },
                ],
            },
        ],
    });
    return res.json(results);
});

const create = catchError(async (req, res) => {
    const userId = req.user.id;
    const carts = await Cart.findAll({
        where: { userId },
        raw: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
    }); /* row se utiliza para formatear el resultado ya que la instancia carts que se genera no es un json string */
    if (carts.length === 0) return res.status(400).json("No hay carritos para procesar");

    const purcheses = carts.map((cart) => {
        const { id, ...cartData } = cart;

        return Purchase.create({ ...cartData, userId });
    });
    try {
        const result = await Promise.all(purcheses);
        Cart.destroy({ where: { userId } });

        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json("Ocurrió un error al procesar las compras.");
    }
});

module.exports = {
    getAll,
    create,
};
