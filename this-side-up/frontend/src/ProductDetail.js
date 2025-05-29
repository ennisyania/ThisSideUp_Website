import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = ({ category, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!category || !productId) return;

    setLoading(true);

    fetch(`http://localhost:5000/${category}/${productId}`)
      .then(res => {
        if (res.status === 404) {
          // If product not found, navigate to NotFound page
          navigate('/notfound');
          return null;
        }
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(data => {
        if (data) setProduct(data);
      })
      .catch(err => {
        console.error(err);
        navigate('/notfound');
      })
      .finally(() => setLoading(false));
  }, [category, productId, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return null; // In case navigate happens, don't render anything

  return (
    <div className="container">
      <img className="image" src={product.imageurl} alt={product.name} />
      <h1 className="name">{product.name}</h1>
      <p className="price">${product.price[0]}</p>
      <p className="description">Sizes: {product.sizes.join(', ')}</p>
    </div>
  );
};

export default ProductDetail;
