import { useEffect, useState } from "react";
import { getProductsService } from "./services/products_services";
import { Link } from "react-router-dom";

export const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsService().then((data) => {
      if (data) {
        setProducts(data);
      }
    });
  }, []);

  const handleAddToCart = (product) => {
    const cart = localStorage.getItem("cart") || "[]";
    const cartParsed = JSON.parse(cart);
    const productInCart = cartParsed.find((item) => item.id === product.id);

    if (productInCart) {
      const newCart = cartParsed.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + 1,
            total: parseFloat(item.total) + parseFloat(item.price),
          };
        }

        return item;
      });

      localStorage.setItem("cart", JSON.stringify(newCart));
      return;
    }

    const newProduct = {
      ...product,
      quantity: 1,
      total: parseFloat(product.price),
    };

    localStorage.setItem("cart", JSON.stringify([...cartParsed, newProduct]));
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1>Productos</h1>
        <Link
          to="cart"
          className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
        >
          Carrito de compras
        </Link>
      </div>
      <div className="flex gap-5">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border rounded-xl p-5 max-w-80">
              <picture className="rounded-xl overflow-hidden aspect-video block relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full"
                />
              </picture>
              <div className="pt-5">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
                >
                  Añadir carrito
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos</p>
        )}
      </div>
    </div>
  );
};
