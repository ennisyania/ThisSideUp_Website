
import './Homepage.css';
import Navbar from './component/Navbar';



function Homepage() {
  return (
    <div className="homepage">
      {/* Navbar */}
      <div>
      <Navbar />
    </div>

      {/* Hero */}
      <section className='hero'>
        <h1 className='heroText'>Ride the Shore<br />Own the Wave</h1>
      </section>

      {/* Clothing Promo */}
      <section className='clothing'>
        <div className='clothing-Images'></div>
        <div className="clothing-text">
          <h2>Trying to look good<br />while riding the waves?</h2>
          <p>Browse through our collection of high-quality <br />clothing made to enhance your flow.</p>
          <div className="buttons">
            <button>Accessories</button>
            <button>Jackets</button>
            <button>T-Shirt</button>
            <button>Boardshorts</button>
          </div>
        </div>
      </section>

      {/* Boards Showcase */}
      <section className="boards-carousel">
        <div className="carousel-track">
          <img src="/images/skimboard 2.png" alt="board 2" />
          <img src="/images/skimboard 3.png" alt="board 3" />
          <img src="/images/skimboard 4.png" alt="board 4" />
          <img src="/images/skimboard 5.png" alt="board 5" />
          <img src="/images/skimboard 6.png" alt="board 6" />
          {/* Duplicate for seamless loop */}
          <img src="/images/skimboard 2.png" alt="board 2 duplicate" />
          <img src="/images/skimboard 3.png" alt="board 3 duplicate" />
          <img src="/images/skimboard 4.png" alt="board 4 duplicate" />
          <img src="/images/skimboard 5.png" alt="board 5 duplicate" />
          <img src="/images/skimboard 6.png" alt="board 6 duplicate" />

          <img src="/images/skimboard 2.png" alt="board 2 duplicate" />
          <img src="/images/skimboard 3.png" alt="board 3 duplicate" />
          <img src="/images/skimboard 4.png" alt="board 4 duplicate" />
          <img src="/images/skimboard 5.png" alt="board 5 duplicate" />
          <img src="/images/skimboard 6.png" alt="board 6 duplicate" />
        </div>
      </section>

      {/* Logo and Surfer Image */}
      <section className="logo-and-action">
        <div className="brand-logo"></div>
        <img className="surfing-img" />
      </section>

      {/* Tryout Session */}
      <section className="tryout">
        <div className='tryout-image'></div>
        <div className="tryout-info">
          <div className='content'>
          <h2>First Tryout Session <span className="free">FREE!</span></h2>
          <p>Comes with one FREE drink!</p>
          <p>Come ride with us — test our boards, meet the crew, and get a feel for This Side Up. No pressure, just good times.</p>
          <button>Find Out More</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
