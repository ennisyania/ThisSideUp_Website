import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';



function Homepage() {

  const navigate = useNavigate();

  return (
    <div className="homepage">

      {/* Hero */}
      <section className='hero'>
        <h1 className='heroText'>Ride the Shore<br />Own the Wave</h1>
      </section>

      {/* Clothing Promo */}
      <section className='clothing'>
        <div className='clothing-Images'></div>
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

        {/* Image overlay */}
        <div className="image-overlay">
          <img src="/images/skimboard 1.png" alt="surfOverlay" className="board-img" />
        </div>
      </section>



      {/* Boards Showcase */}



      <section className="boards-carousel">
        <div className="carousel-track">
          <img src="/images/skimboard 2.png" alt="board 2" />
          <img src="/images/skimboard 6.png" alt="board 3" />
          <img src="/images/skimboard 2.png" alt="board 4" />
          <img src="/images/skimboard 5.png" alt="board 5" />
          <img src="/images/skimboard 6.png" alt="board 6" />
          {/* Duplicate for seamless loop */}
          <img src="/images/skimboard 2.png" alt="board 2" />
          <img src="/images/skimboard 6.png" alt="board 3" />
          <img src="/images/skimboard 2.png" alt="board 4" />
          <img src="/images/skimboard 5.png" alt="board 5" />
          <img src="/images/skimboard 6.png" alt="board 6" />

          <img src="/images/skimboard 2.png" alt="board 2" />
          <img src="/images/skimboard 6.png" alt="board 3" />
          <img src="/images/skimboard 2.png" alt="board 4" />
          <img src="/images/skimboard 5.png" alt="board 5" />
          <img src="/images/skimboard 6.png" alt="board 6" />

        </div>


      </section>

      {/* Image overlay */}
      <div className="image-overlay2">
        <img src="/images/skimboard 1.png" alt="surfOverlay" className="board-img2" />
      </div>

      {/* Logo and Surfer Image */}
      <section className="logo-and-action">
        <div className="brand-logo"></div>
        <img className="surfing-img" alt='man surfing' />
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
              <button onClick={() => navigate('/more-info')}>Find Out More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Image overlay */}
      <div className="image-overlay3">
        <img src="/images/skimboard 1.png" alt="surfOverlay" className="board-img3" />
      </div>

    </div>


  );
}

export default Homepage;
