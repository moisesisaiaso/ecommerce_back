const catchError = require("../utils/catchError");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");

const getAll = catchError(async (req, res) => {
    const { id } = req.user;
    const carts = await Cart.findAll({
        where: { userId: id },
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
    if (!carts) return res.json("Data not found").status(404);
    // obtengo los productos del array de carts
    /*  const products = carts.map((cart) => {
        return cart.product;
    }); 
    return res.json(carts);
    */ /* flatMap funciona igual que el map tradicional pero incorpora la funcionalidad de unir elementos de array que estén en un nivel mas profundo  */

    return res.json(carts);
});

const create = catchError(async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ where: { productId, userId } });
    if (cart) return res.json("Existing Product");

    const result = await Cart.create({ ...req.body, userId });
    return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const cart = await Cart.findByPk(id, {
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
                    {
                        model: Cart,
                        attributes: ["quantity"],
                    },
                ],
            },
        ],
    });
    if (!cart) return res.json("Data not found").status(404);

    return res.json(cart.product);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    const result = await Cart.destroy({ where: { id } });
    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
    const { quantity } = req.body;
    const { id } = req.params;
    const result = await Cart.update(quantity, {
        where: { id },
        returning: true,
    });
    if (result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
};
