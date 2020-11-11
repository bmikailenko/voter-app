import React from 'react';
import './App.css';
import './About.css';

function About() {
  return (
  <body>
    <div class="grid1">
        <div class="purpose-section">
            <h1>What is Voter App?</h1>
        </div>

        <div class="purpose-row">
            <div class="purpose-column">
                <h2>Become The Voter</h2>
                <p>The Voter App allows you to review your beliefs and ideals by filling out several and numerous survey options that will further express who you are.</p>
            </div>
           
            <div class="purpose-column">
                <h2>Find Similar Matches</h2>
                <p>Match beliefs and ideals with candidates in your local area with the results from your surveys.</p>
            </div>

            <div class="purpose-column">
                <h2>Choose Your Candidates</h2>
                <p>Pick and choose from a wide list of candidates for your next president, state representative or even your local govenor based on matching values.</p>
            </div>
        </div>
        <br/>
        <img src="../public/survey-vote.jpg" alt="Survey & Vote"/>
    </div>

    <div class="grid2">
        <div class="row">

            <div class="ourteam-section">
                <br/>
                <h2>Our Team</h2>
            </div>

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
    </div>
   </body>
  );
}

export default About;
