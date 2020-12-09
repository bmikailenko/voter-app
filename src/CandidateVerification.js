import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import ReactS3 from 'react-s3';
import './App.css';
import './verification.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';


function CandidateVerification() {


	const config = {
	    bucketName: 'amplify-voterapp-dev-125905-deployment',
	    dirName: 'candidate-submissions',
	    region: 'us-east-2',
	}

	var [userFile, setUserFile] = useState(null);
	var [hasFile, setHasFile] = useState(false);
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


	return (
    <div>
    	<AmplifySignOut />
    	<br/><br/><br/>
    	<h1>Candidate Verification</h1><br/><br/>


    	Please upload an image of one of your verification documents.<br/>
    	You will be sent an email with the details of your verification.
    	<br/><br/>
    	The accepted documents are:<br/>
    	<ul>
    		<li>Birth Certificate</li>
			<li>Driver's License</li>
    		<li>Passport</li>
    		<li>Military ID</li>
    	</ul>
    	<br/>
    	<br/>

        <input 
        type="file" 
        onChange={newFileHandler}
        />

        <button 
        onClick={uploadHandler}
        disabled={!hasFile}>
        Upload verification document
        </button>

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
