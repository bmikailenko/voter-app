import React from 'react';
import './App.css';
import './About.css';

function About() {
  return (
    <html>
        <div class="about-section">
           <h1>About Us Page</h1>
           <p>Some text about who we are and what we do.</p>
           <hr/>
        </div>

        <h2>Our Team</h2>
        <div class="row">
            <div class="column">
                <div class="card">
                    <div class="container">
                        <h2>Ben Mikailenko</h2>
                        <p class="title">CEO & Founder</p>
                        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                        <p>@example.com</p>
                        <p><button class="button">Contact</button></p>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="card">
                    <div class="container">
                        <h2>Roman Stolyarov</h2>
                        <p class="title">Designer & Organizer</p>
                        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                        <p>romkas2000@gmail.com</p>
                        <p><button class="button">Contact</button></p>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="card">
                    <div class="container">
                        <h2>Daniel Yarmolenko</h2>
                        <p class="title">Designer</p>
                        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                        <p>@example.com</p>
                        <p><button class="button">Contact</button></p>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="card">
                    <div class="container">
                        <h2>David Barko</h2>
                        <p class="title">Designer</p>
                        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                        <p>@example.com</p>
                        <p><button class="button">Contact</button></p>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="card">
                    <div class="container">
                        <h2>Vitaliy Kudrik</h2>
                        <p class="title">Designer</p>
                        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                        <p>@example.com</p>
                        <p><button class="button">Contact</button></p>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="card">
                    <div class="container">
                        <h2>Brian Haugen</h2>
                        <p class="title">Designer</p>
                        <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                        <p>@example.com</p>
                        <p><button class="button">Contact</button></p>
                    </div>
                </div>
            </div>
        </div>
    </html>
  );
}

export default About;
