import React from 'react';
import './App.css';
import './About.css';
import image1 from './survey-vote.jpg';

function About() {
  return (
  <div>
    <div class="grid1">
        <div class="purpose-section">
            <h1>What is Voter App?</h1>
        </div>

        <div class="voter-row">
            <div class="voter-column">
                <h2>Become The Voter</h2>
                <p>The Voter App allows you to review your beliefs and ideals by filling out several and numerous survey options that will further express who you are.</p>
            </div>
           
            <div class="voter-column">
                <h2>Find Similar Matches</h2>
                <p>Match beliefs and ideals with candidates in your local area with the results from your surveys.</p>
            </div>

            <div class="voter-column">
                <h2>Choose Your Candidates</h2>
                <p>Pick and choose from a wide list of candidates for your next president, state representative or even your local govenor based on matching values.</p>
            </div>
        </div>
        <br/>
        <img src={image1} alt="Survey & Vote" />
    </div>

    <div class="grid3">
        <div class="dividerTop">
            <svg style={{width: "100%"}}>
                <path d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z" fill="white"></ path>
            </svg>
        </div>
        <div class="candidate-container">
            <div class="candidate-title">
                <h1>As the Candidate...</h1>
            </div>
            <div class="candidate-row">
                <div class="candidate-column">
                    <h2>Take Charge</h2>
                    <p>The Voter App allows you to express your own ideals and show them to citizens locally, or even nationally.</p>
                </div>
           
                <div class="candidate-column">
                    <h2>Show What You Stand For</h2>
                    <p>By filling out the surveys, the Voter App allows you to connect with the citizens around you and to speak up on what policies, and beliefs you stand for. </p>
                </div>

                <div class="candidate-column">
                    <h2>Choose your Voters</h2>
                    <p>Once the results are set from the survey, voters all around can view, and compare their ideals with yours. This allows for voters, locally or nationally to find out who you are.</p>
                </div>
            </div>
        </div>
        <div class="dividerBottom">
            <svg style={{width: "100%"}}>
                <path d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z" fill="white"></ path>
            </svg>
        </div>
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
   </div>
  );
}

export default About;
