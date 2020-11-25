import React from 'react';
import './App.css';
import './Landing.css';
import { Link } from 'react-router-dom';
import image1 from './vertFlag.png';


function Landing() {

  return (
    <div>
  
      <Header/>

      <div id="whole">


          <img class="fill-vertical" src={image1} alt="Flag" />

        <div id="body">
          <Card
            className='section'
            title='"A well-informed electorate is a prerequisite to democracy."'
            description='-Thomas Jefferson'
          />

          <span className='link-section bg-grey'>
          <br/>
          We're here to help connect voters to candidates who share their beliefs and values.
          <br/>
          A more complete understanding of your political options is just a few minutes away.
          <br/>
          <br/>
          
          </span>

          <span className='link-section bg-grey'>
            <ul class="no-bullets">
              <li><Link to="/dashboard">Get Started<br/><br/></Link></li>
            </ul>
          </span>
        </div>

          <img class="fill-vertical" src={image1} alt="Flag" />

      </div>
    </div>
  );
}

const Header = () =>{
  return(
    <div className='header'>
      <span className='header-title'>
        Voter App
      </span>
      <br/>
      <span className="header-text">
      </span>
    </div>
  );

}

const Card = (props) =>{
  return(
      <div className={props.className} >

          <div className="big-div">
              <span className='div-title'>
                  {props.title}
              </span>
              <br/>
              <span>
                  {props.description}
              </span>
          </div>
      </div>
  )
}

export default Landing;
