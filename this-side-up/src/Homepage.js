
import './Homepage.css';


function Homepage() {
  return (
    <div className="homepage">
      {/* Navbar */}

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
      <section className="boards">
        <img src="board1.png" alt="board 1" />
        <img src="board2.png" alt="board 2" />
        <img src="board3.png" alt="board 3" />
        <img src="board4.png" alt="board 4" />
      </section>

      {/* Logo and Surfer Image */}
      <section className="logo-and-action">
        <div className="brand-logo">This Side UP</div>
        <img className="surfing-img" src="surfer.png" alt="Surfer in action" />
      </section>

      {/* Tryout Session */}
      <section className="tryout">
        <div className="tryout-info">
          <h2>First Tryout Session <span className="free">FREE!</span></h2>
          <p>Comes with one FREE drink!</p>
          <p>Come ride with us — test our boards, meet the crew, and get a feel for This Side Up. No pressure, just good times.</p>
          <button>Find Out More</button>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
