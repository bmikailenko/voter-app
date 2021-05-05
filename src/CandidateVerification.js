import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import ReactS3 from 'react-s3';
import './App.css';
import './verification.css';
import { withAuthenticator } from '@aws-amplify/ui-react';


function CandidateVerification() {


	const config = {
	    bucketName: 'amplify-voterapp-dev-125905-deployment',
	    dirName: 'candidate-submissions',
	    region: 'us-east-2',
	}

	var [userFile, setUserFile] = useState(null);
	var [hasFile, setHasFile] = useState(false);
  var [acknowledgment, setAcknowledgement] = useState(false);
	var [fileSubmitted, setFileSubmitted] = useState(false); 

	const uploadHandler = async (e) => {



	    try {
	      // Upload the file to s3. 
	      ReactS3.uploadFile( userFile , config )
	      .then( (data)=>{
	      	console.log(data);
	      })

	    } catch (err) {
	      console.log(err);
	    }


		setFileSubmitted(true);
		console.log("File submitted");
	}


	function newFileHandler(e){
		setHasFile({value: true})
		setUserFile({value: e.target.files[0]})
	}

  function acknowledgementHandler(){
    setAcknowledgement(!acknowledgment);
  }


	return (
    <div style={{ 'textAlign': 'center'}}>
    	<br/><br/><br/>
    	<h1>Candidate Verification</h1><br/><br/>


    	Please upload your relevant Declaration of Candidacy document.<br/>
    	Following its review, you will be sent an email with the details of your verification.
    	<br/><br/><br/>


        <div>

            I acknowledge that, until my verification is finalized, I will be unable to view voter reports.
            <br/>
            <input type="checkbox" name="acknowledge" onChange={acknowledgementHandler}></input>
            <label for="acknowledge">Acknowledge</label>
            <br/>
            <input type="file" id="verification" name="myfile" accept="image/*, .pdf" onChange={newFileHandler}/>
            <br/>
            <button 
            onClick={uploadHandler}
            disabled={!hasFile | !acknowledgment}>
            Submit
            </button>
        </div>

        <br/><br/>
        {(fileSubmitted) ?
        (<div>	
        	<div style={{ color: 'green' }}>
          	Thank you for your submission! <br/>
         	<Link to="/dashboard">Return to Dashboard</Link>
         	</div>
         </div>
         )
        :
        (<div>
        </div>)}
	</div>
  );
}

export default withAuthenticator(CandidateVerification);
