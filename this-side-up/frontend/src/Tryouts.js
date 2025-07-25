import React from 'react';
import './Tryouts.css';

export default function Tryouts() {
  return (
    <div>
      <div className="tryouts-top">
        <img src="/images/Tryouts-photo.svg" alt="Skimboard Tryout" className="tryouts-image" />

        <div className="tryouts-right">
          <h1 className="title">Skim Session Tryout</h1>
          <h2 className="subtitle">First Tryout Session</h2>
          <h3 className="free-tag">FREE!</h3>
          <p className="free-drink">comes with one FREE drink!</p>
          <p className="price-note">subsequent lessons $30 / Hour</p>
        </div>
      </div>

      <p className="description">
        <em>
          Get a real feel for the ride with This Side Up's Try Out Session. Whether you're a seasoned
          skimmer or just starting out, this is your chance to test our boards, meet the crew, and
          experience the energy behind our brand. We'll have our full lineup ready for you —
          including the Blue Inferno — so you can see what style and size fits your flow. No pressure,
          no expectations — just good vibes, expert tips, and the freedom to explore the shoreline
          your way. Bring your stoke, bring your friends, and let's ride.
        </em>
      </p>

      <div className="schedule-pricing">
        <div className="schedule">
          <p>Saturday tryout session from 3-6pm</p>
          <p>Sunday tryout session from 9am till your legs give out!</p>
          <p>Weekdays reach out to us to schedule a session</p>
        </div>
        <div className="pricing">
          <p><strong>$15 / Hour</strong> - 'This Side Up' Skimboards <br /><span className="note">(Made in SG!)</span></p>
          <p><strong>$20 / Hour</strong> - Other Brands <br /><span className="note">(Zap, Exile, etc.)</span></p>
        </div>
      </div>

      <hr/>

      <div className="bottom-part">
        <button className="contact-button">
          <span>Contact Us! Join the fun!</span>
        </button>

        <p className="disclaimer">
          disclaimer: Falling is a natural part of learning skimboarding. While we provide guidance to reduce
          falls, progress depends on how quickly you pick up the techniques. Keep an open mind and embrace the
          learning process - it's all part of the fun!
        </p>
      </div>
    </div>
  );
}
