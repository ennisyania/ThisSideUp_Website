// src/FAQ.js
import React from 'react';
import './FAQ.css'; // Import the CSS for the FAQ page

export default function FAQ() {
    // Construct the image URL for the slanted sidebar
    const faqSideImageUrl = `${process.env.PUBLIC_URL}/images/FAQside.png`;

    const faqItems = [
        {
            question: "What is skimboarding?",
            answer: "Skimboarding is a board sport where riders glide across the water's surface on a small, flat board. It can be done on wet sand (flatland) or used to catch incoming waves (wave riding)."
        },
        {
            question: "What size skimboard should I get?",
            answer: "Board size depends on your weight and skill level. As a general rule, the board should reach somewhere between your mid-chest and chin when standing upright. Lighter riders can use smaller boards, while heavier riders should opt for larger ones for better float and stability."
        },
        {
            question: "How do I put wax on my skimboard?",
            answer: "Wax typically comes in 'bar' form and is applied to the top/deck of the board by rubbing the bar, with even/firm pressure, in circular motions, from nose to tail, and rail to rail."
        },
        {
            question: "How do I care for my skimboard?",
            answer: "Rinse your board with fresh water after each session, especially after saltwater exposure. Store your board in a cool, dry place away from direct sunlight to prevent warping and delamination."
        },
        {
            question: "How can I learn tricks on a skimboard?",
            answer: "Start with basic moves like the shove-it or ollie on flatland. Practice regularly, watch tutorials, and consider joining a local skimboarding community to learn from experienced skimboarders."
        }
    ];

    return (
        <div className="faq-page-container">
            <div className="faq-content-grid">
                {/* Background image for the left side, spanning all rows */}
                <div className="faq-left-background" style={{ backgroundImage: `url(${faqSideImageUrl})` }}></div>

                {/* Main FAQ Title, positioned over the background */}
                <div className="faq-title-overlay">
                    <h1>FAQ</h1>
                </div>

                {/* Individual FAQ items (questions and answers) */}
                {faqItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {/* Question text, positioned over the left background */}
                        <h2 className={`faq-question-text faq-question-${index}`}>{item.question}</h2>
                        {/* Answer column, positioned on the right */}
                        <div className={`faq-answer-column faq-answer-${index}`}>
                            <p>{item.answer}</p>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
