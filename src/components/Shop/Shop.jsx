import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    useEffect( ()=> {
        fetch('products.json')
        .then(res => res.json())
        .then(data => setProducts(data))
    } , []);
    useEffect(()=> {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // step 1: get id
        for(const id in storedCart) {
            // get the product using id
            const addedProduct = products.find(product => product.id === id);
            
            if (addedProduct) {
                // step 3: get quantity of the product
                const quantity = storedCart[id];
                addedProduct.quantity =quantity;
                // step 4: add the added product to the saved cart
                savedCart.push(addedProduct);
            }

        }
        // step 5: set the cart
        setCart(savedCart);
    },[products])
    const handleAddToCart = (product) => {
        // cart.push(product);
        // const newCart = [...cart, product];
        let newCart = [];
        const exists = cart.find(pd => pd.id ===product.id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product];
        } 
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd.id !== product.id);
            newCart = [...cart, exists];
        }

        setCart(newCart);
        addToDb(product.id);
    }
    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }
    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                    key = {product.id}
                    product={product}
                    handleAddToCart ={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}
                handleClearCart={handleClearCart}></Cart>
            </div>
        </div>
    );
};

export default Shop;