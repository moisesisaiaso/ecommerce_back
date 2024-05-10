const {
    getAll,
    create,
    getOne,
    remove,
    update,
    image,
} = require("../controllers/product.controllers");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJWT");

const routerProduct = express.Router();

routerProduct.route("/").get(getAll).post(verifyJwt, create);

routerProduct.route("/:id/images").post(verifyJwt, image);

routerProduct.route("/:id").get(getOne).delete(verifyJwt, remove).put(verifyJwt, update);

module.exports = routerProduct;
