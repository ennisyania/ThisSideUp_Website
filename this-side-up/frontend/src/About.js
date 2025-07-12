import React from 'react';
import './About.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="sidebar">
        <p><strong>About us</strong></p>
        <p>Our Team</p>
      </div>

      <div className="main-content">

        <section className="about-text-section">
          <h1>ABOUT US.</h1>
          <p>Welcome to ThisSideUp! We are Singapore's premier skimboarding brand, where passion meets the waves and every ride tells a story. </p>

          <p>Born from a deep love for the ocean and the thrill of skimboarding, ThisSideUp was founded with one mission: to bring the vibrant culture of skimboarding to Singapore and the region, inspiring riders of all levels to embrace the sport and live life on the edge of the water. </p>

          <p>At ThisSideUp, we believe skimboarding is more than just a sport; it's a lifestyle. It's the early mornings chasing the perfect wave, the community that grows stronger with every session, and the feeling of gliding effortlessly over the water, connected to nature and your own sense of adventure. Whether you're a seasoned pro carving across the shore or a beginner eager to catch your first ride, we're here to support you every step of the way.</p>

          <p>We're proud to design and craft top-quality skimboards and gear that blend innovation with style. Our products are carefully engineered to perform in Singapore's unique coastal conditions; from the calm lagoons to the challenging tidal beaches. Using durable materials and eye-catching designs, ThisSideUp boards are built to last, helping you push your limits and master new tricks.</p>

          <p>But ThisSideUp is more than just gear; it's a community. We host regular events, workshops, and meet-ups where skimboarders from all backgrounds can connect, share tips, and celebrate the joy of the sport. We believe in nurturing local talent, encouraging newcomers, and fostering an inclusive environment where everyone can thrive.</p>

          <p>As a homegrown Singaporean brand, we're deeply committed to protecting the environment that makes skimboarding possible. Sustainability is at the heart of our operations; from responsible sourcing to eco-friendly packaging; because we want future generations to experience the same thrill of riding the waves.</p>

          <p>Join us on this journey to redefine what it means to skimboard in Singapore and beyond. Whether you're looking for premium gear, expert advice, or a vibrant community to call home, ThisSideUp is your go-to destination.</p>

          <p>Ride with us. Live ThisSideUp.</p>

        </section>

        <div className="quote-image-section">
          <div className="quote">
            <p>“Every board we shape carries our passion for the ride and respect for the ocean.”</p>
            <span>Name, Owner</span>
          </div>
          <div>
            <img src="/images/aboutimage1.svg" alt="Surf action" />
          </div>
        </div>

        <section className="team-section">
          <div className="image-overlap-wrapper">
            <img src="/images/aboutimage2.svg" alt="Team member 1" className="overlap-image first" />
            <img src="/images/aboutimage3.svg" alt="Team member 2" className="overlap-image second" />
          </div>

          <div className="team-text-column">
            <h2>THE TEAM.</h2>
            <p className="team-description">
              We're the crew behind ThisSideUp; a bunch of ocean lovers, adrenaline junkies, and lifelong skimboard enthusiasts based right here in Singapore. Whether we're out chasing the perfect wave or brainstorming new board designs, our passion for skimboarding drives everything we do. Each of us brings something unique to the table; from deep local knowledge of Singapore's beaches to skills in crafting high-quality gear; and together, we're all about growing the skimboarding scene and sharing the stoke with riders of all levels.
            </p>
            <p className="team-description">
              We believe that skimboarding is more than just a sport; it's a lifestyle that connects us to nature and each other. That's why we're not just building boards; we're building a community. We can't wait to meet you on the shore, swap stories, and help you find your ThisSideUp moment.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
