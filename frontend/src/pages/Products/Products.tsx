// import React from 'react'
// import {  useState,useEffect } from 'react'
// import axios from 'axios';
import Component from '../../components/comp-485';

// interface ProductProps {
//   id: number;
//   name: string;
//   image_url: string;
//   category: string;
//   price: number;
//   quantity: number;
//   expiration_date: string | null; // If expiration_date is nullable
//   date_added: string; // Typically in ISO string format
//   date_modified: string; // Typically in ISO string format
// }


const Products = () => {
  // const [products, setProducts] = useState<ProductProps[]>([]);
  // const token = localStorage.getItem('token');

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // };

  // const formatTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleTimeString('en-US', {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //   });
  // };

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const response = await axios.get("http://localhost:5000/api/products/", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //     });
  //     setProducts(response.data)
  //   }

  //   fetchProducts();
  // })
  return (
    <div>
      {/* {products.length > 0 ?
        <div>
          {products.map((product) => (
            <div>
              Name: {product.name} <br />
              price: {product.price} <br />
              <img src={product.image_url} alt={product.name} /> <br />
              category: {product.category} <br />
              quantity: {product.quantity} <br />
              <p>Expiration Date: {product.expiration_date ? formatDate(product.expiration_date) : "N/A"}</p>
              <p>Date Added: {product.date_added ? `${formatDate(product.date_added)} at ${formatTime(product.date_added)}` : "N/A"}</p>
              <p>Date Modified: {product.date_modified ? `${formatDate(product.date_modified)} at ${formatTime(product.date_modified)}` : "N/A"}</p>
            </div>
          ))}
        </div> : "No products"} <br /> */}
        <Component />
    </div>
  )
}

export default Products