import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://thissideupbackend-git-main-enni-syanias-projects.vercel.app/api/products/skimboards')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((item) => ({
          id: item.productId,
          imageSrc: item.imageurl,
          title: item.name,
          price: item.price[0] ? `$${item.price[0].toFixed(2)}` : '$0.00'
        }));
        setProducts(formatted);
      })
      .catch(err => console.error('Failed to fetch skimboards:', err));
  }, []);

  return (
    <div className="homepage">
      {/* Hero */}
      <section className='hero'>
        <h1 className='heroText'>Ride the Shore<br />Own the Wave</h1>
        
      </section>
      {/* Clothing Promo */}
      <section className='clothing'>
        <div className="image-overlay">
          <img src="/images/skimboard 1.png" alt="surfOverlay" className="board-img" />
        </div>
        <div className='clothing-Images'></div>
        {/* Image overlay */}
      <div className="image-overlay2">
        <img src="/images/skimboard 1.png" alt="surfOverlay" className="board-img2" />
      </div>
        <div className="right-text">
          <h2>Trying to look good<br />while riding the waves?</h2>
          <p className="smallText">Browse through our collection of high-quality <br />clothing made to enhance your flow.</p>
          <div className="buttons">
            <button onClick={() => navigate('/accessories')}>Accessories</button>
            <button onClick={() => navigate('/jackets')}>Jackets</button>
            <button onClick={() => navigate('/tshirt')}>T-Shirt</button>
            <button onClick={() => navigate('/boardshorts')}>Boardshorts</button>
          </div>
        </div>
        
      </section>

      {/* Boards Showcase */}
      <section
        className="boards-carousel"
        onClick={() => navigate('/skimboards')}
        style={{ cursor: 'pointer' }}
      >
        <div className="carousel-track">
          {products.length === 0 ? (
            <p>Loading boards...</p>
          ) : (
            products
              .concat(products)
              .concat(products)
              .map((product, index) => (
                <img
                  key={`${product.id}-${index}`}
                  src={product.imageSrc}
                  alt={product.title}
                  title={`${product.title} — ${product.price}`}
                />
              ))
          )}
        </div>
      </section>

    

      {/* Logo and Surfer Image */}
      <section className="logo-and-action">
        <div className="brand-logo"></div>
        <img className="surfing-img" alt='man surfing' />
        <div className="image-overlay3">
        <img src="/images/skimboard 1.png" alt="surfOverlay" className="board-img3" />
      </div>
      </section>

      {/* Tryout Session */}
      <section className="tryout">
        <div className='tryout-image'></div>
        <div className="right-text">
          <div className='content'>
            <h2>First Tryout Session <br /><span className="free">FREE!</span></h2>
            <p className='free-drink'>Comes with one FREE drink!</p>
            <p className='smallText'>Come ride with us — test our boards, meet the crew,
              <br />and get a feel for This Side Up.
              <br /> No pressure, just good times.</p>
            <div className='time-box'></div>
            <div className='buttons'>
              <button onClick={() => navigate('/tryouts')}>Find Out More</button>
            </div>
          </div>
        </div>
      
      </section>
    </div>
  );
}

export default Homepage;
