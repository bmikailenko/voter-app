import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import {Link} from 'react-router-dom';
import { createSurvey, updateSurvey } from './graphql/mutations';
import { getSurvey } from './graphql/queries';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import * as SurveyQuestions from "survey-react";
import './App.css';
import "survey-react/survey.css";
import './Survey.css';


function Survey() {
  var [userSurvey, setUserSurvey] = useState(); 
  var [isCandidate, setIsCandidate] = useState(false);

  var surveyJSON = {
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "text",
        "name": "Zipcode",
        "title": "Zipcode",
        "description": "Please enter your 5 digit zipcode to continue",
        "isRequired": true,
        "requiredErrorText": "Please enter your Zipcode to continue",
        "inputType": "number",
        "size": 26
       }
      ],
      "title": "Which candidate would best represent my beliefs?",
      "description": "Take this survey and answer as honestly as possible so that we can match you with the best possible political candidate."
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "radiogroup",
        "name": "question1",
        "title": "\t1.) Should the American government act in an extensive and proactive way to protect its interests abroad?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question1A",
        "visible": false,
        "visibleIf": "{question1} = 'item2'",
        "title": "1.) a.) Should the American government stop getting involved in so many wars and foreign disputes and focus more domestic issues?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question1noA",
        "visible": false,
        "visibleIf": "{question1} = 'item1'",
        "title": "1.) a.) Should the American government expand it's current role in the world stage?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question2",
        "title": "2.) Should the American government increase funding for the military?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question3",
        "title": "3.) Should the American government be able to assassinate foreign terrorists?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question3A",
        "visibleIf": "{question3} = 'item1'",
        "title": "3.) a.) Yes, only if there is hard evidence convicting them.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question3B",
        "visibleIf": "{question3} = 'item1'",
        "title": "3.) b.) Yes, but only in the instance of proof of impending danger for US citizens.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question3C",
        "visibleIf": "{question3} = 'item1'",
        "title": "3.) c.) Yes, but drastically reduce the war on terror.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question3noA",
        "visibleIf": "{question3} = 'item2'",
        "title": "3.) a.) No, and drastically reduce the war on terror.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question4",
        "title": "4.) Should suspected terrorists be protected by constitutional rights?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "National Security"
     },
     {
      "name": "page3",
      "elements": [
       {
        "type": "radiogroup",
        "name": "envQuestion1",
        "title": "1.) Do you believe climate change is a pressing issue that needs to be addressed with government policy?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "envQuestion2",
        "title": "2.) Do you support investment in renewable energies and technologies?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "envQuestion2A",
        "visibleIf": "{envQuestion2} = 'item1'",
        "title": "2.) a.) Yes, but only a moderate amount of investment.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "envQuestion2B",
        "visibleIf": "{envQuestion2} = 'item1'",
        "title": "2.) b.) Yes, massive investments into renewable energies.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "envQuestion3",
        "title": "3.) Should the American government ban fossil fuel industries and other nonrenewable energy sources?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "envQuestion3noA",
        "visibleIf": "{envQuestion3} = 'item2'",
        "title": "3.) a.) Should the American government heavily regulate fossil fuel industries and other nonrenewable energy sources?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "envQuestion3noB",
        "visibleIf": "{envQuestion3} = 'item2'",
        "title": "3.) b.) Should the American government expand on fossil fuel industries and other nonrenewable energy sources?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "envQuestion4",
        "title": "4.) Should the American government have stricter regulations on air and water pollution?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question5",
        "title": "5.) Do you support the use of nuclear energy?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question6",
        "title": "6.) Should the American government have a role in protecting endangered species?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question7",
        "title": "7.) Do you believe that America should reenter the Paris climate agreement?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Environmental Issues"
     },
     {
      "name": "page4",
      "elements": [
       {
        "type": "radiogroup",
        "name": "econQuestion1",
        "title": "1.) Should the federal minimum wage be raised?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion1a",
        "visibleIf": "{econQuestion1} = 'item1'",
        "title": "1.) a.) Yes, to $15 dollars an hour.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion1b",
        "visibleIf": "{econQuestion1} = 'item1'",
        "title": "1.) b.) Yes, but less than $15 dollars an hour.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion2",
        "title": "2.) Should the American government put a higher tax rate on the rich to fund government programs and services?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion2a",
        "visibleIf": "{econQuestion2} = 'item1'",
        "title": "2.) a.) Yes, but not an extremely high tax rate.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion2b",
        "visibleIf": "{econQuestion2} = 'item1'",
        "title": "2.) b.) Yes, and drastically increase the tax rate so government programs can be expanded.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion2noA",
        "visibleIf": "{econQuestion2} = 'item2'",
        "title": "2.) a.) No, and cut taxes on the rich.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion3",
        "title": "3.) Should the government expand social safety net programs in order to help low-income Americans?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion3a",
        "visibleIf": "{econQuestion3} = 'item1'",
        "title": "3.) a.) Yes, but only if they are working.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion3b",
        "visibleIf": "{econQuestion3} = 'item1'",
        "title": "3.) b.) Yes, but only if there is verifiable proof that they are in need of these programs.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion3c",
        "visibleIf": "{econQuestion3} = 'item1'",
        "title": "3.) c.) Yes, but restructure the programs to make them more efficient.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion3noA",
        "visibleIf": "{econQuestion3} = 'item2'",
        "title": "3.) a.) No, and cut existing programs.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion4",
        "title": "4.) Should the American government raise the corporate tax rate?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion4a",
        "visibleIf": "{econQuestion4} = 'item1'",
        "title": "4.) a.) Yes, and also raise the tax on capital gains.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion4noA",
        "visibleIf": "{econQuestion4} = 'item2'",
        "title": "4.) a.) No, and reduce it.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion5",
        "title": "5.) Should the American government lower the taxes of middle-class Americans?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion5a",
        "visibleIf": "{econQuestion5} = 'item1'",
        "title": "5.) a.) Yes, as long as it doesn't result in cuts for government programs.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion5noA",
        "visibleIf": "{econQuestion5} = 'item2'",
        "title": "5.) a.) No, and increase them to support more government funded programs.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion6",
        "title": "6.) Should the American government guarantee a basic amount of income for each American?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion6a",
        "visibleIf": "{econQuestion6} = 'item1'",
        "title": "6.) a.) Yes, as long as it replaces other anti-poverty programs.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion7",
        "title": "7.) Should the American government invest more in infrastructure?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion7a",
        "visibleIf": "{econQuestion7} = 'item1'",
        "title": "7.) a.) Yes, especially in rural areas.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion7b",
        "visibleIf": "{econQuestion7} = 'item2'",
        "title": "7.) a.) No, and cut it significantly.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "econQuestion8",
        "title": "8.) Should the American government support policies that make forming and union and collective bargaining with an employer easier or harder?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Economic Issues"
     },
     {
      "name": "page5",
      "elements": [
       {
        "type": "radiogroup",
        "name": "healthQuestion1",
        "title": "1.) Do you support the Affordable Care act?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "healthQuestion1a",
        "visibleIf": "{healthQuestion1} = 'item1'",
        "title": "1.) a. ) Yes, but I would prefer a different system of healthcare.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "healthQuestion1noA",
        "visibleIf": "{healthQuestion1} = 'item2'",
        "title": "1.) a. ) No, but I support protecting those who have preexisting conditions.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "healthQuestion2",
        "title": "2.) \nDo you support a public option, where any American would have the opportunity to buy insurance from the Medicare program, even if they aren’t over 65?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "healthQuestion3",
        "title": "3.) Do you support increasing Medicaid funding?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "healthQuestion3a",
        "visibleIf": "{healthQuestion3} = 'item1'",
        "title": "3.) a.) Yes, as long as those who receive Medicaid are working.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "healthQuestion4",
        "title": "4.) Do you support a single payer health care system?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "healthQuestion5",
        "title": "5.) Do you want the American government to regulate the price of prescription drugs to reduce costs for Americans?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question8",
        "title": "6.) Should healthcare for each individual be a right?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Health Care"
     },
     {
      "name": "page6",
      "elements": [
       {
        "type": "radiogroup",
        "name": "immigrationQuestion1",
        "title": "1.) Should the US increase the number of legal immigrants allowed in the country?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question9",
        "visibleIf": "{immigrationQuestion1} = 'item1'",
        "title": "1.) a.) Yes, and we should radically increase the number of immigrants allowed into our country.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion1a",
        "visibleIf": "{immigrationQuestion1} = 'item2'",
        "title": "1.) a.) No, and we should radically decrease the number of immigrants allowed into our country.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion2",
        "title": "2.) Should illegal immigrants who are inside the country currently be given a path to citizenship?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion2a",
        "visibleIf": "{immigrationQuestion2} = 'item1'",
        "title": "2.) a.) Yes, but only if they have never been convicted of a crime.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion2b",
        "visibleIf": "{immigrationQuestion2} = 'item1'",
        "title": "2.) b.) Yes, but only if they have have been in the US for a certain number of years.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion2noA",
        "visibleIf": "{immigrationQuestion2} = 'item2'",
        "title": "2.) a.) No, and they should be deported regardless of circumstances.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion2noB",
        "visibleIf": "{immigrationQuestion2} = 'item2'",
        "title": "2.) b.) No, but they should only be deported if they have been convicted of a crime.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion3",
        "title": "3.) Should illegal immigrants who came to the country as a child with their parents (Dreamers) be granted protections from deportation?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion3a",
        "visibleIf": "{immigrationQuestion3} = 'item1'",
        "title": "3.) a.) Yes, and they should be given a path to citizenship.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion3noA",
        "visibleIf": "{immigrationQuestion3} = 'item2'",
        "title": "3.) a.) No, and they should be deported regardless of circumstances.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion3noB",
        "visibleIf": "{immigrationQuestion3} = 'item2'",
        "title": "3.) b.) No, and they should be deported only if they have been convicted of a crime.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion4",
        "title": "4.) Should the American government build a wall along the southern border with Mexico?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion5",
        "title": "5.) Should illegal immigrants be allowed to partake in government funded programs?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "immigrationQuestion5a",
        "visibleIf": "{immigrationQuestion5} = 'item1'",
        "title": "5.) a.) Yes, but only as long as they pay taxes.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Immigration Issues"
     },
     {
      "name": "page7",
      "elements": [
       {
        "type": "radiogroup",
        "name": "socialQuestion1",
        "title": "1.) Do you believe that marriage should be defined as only between a man and a woman?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "socialQuestion1a",
        "visibleIf": "{socialQuestion1} = 'item2'",
        "title": "1.) a.) No, the government should not define it as such but churches can choose how they define it.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "socialQuestion2",
        "title": "2.) Do you believe that there are systematic barriers that hinder African Americans and people of color from success?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "socialQuestion3",
        "title": "3.) Do you believe racism remains a major problem in the United States?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "socialQuestion4",
        "title": "4.) Do you believe sexism and gender discrimination remains a major problem in the United States?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "socialQuestion5",
        "title": "5.) Do you support affirmative action programs in colleges and universities?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Social Issues"
     },
     {
      "name": "page8",
      "elements": [
       {
        "type": "radiogroup",
        "name": "structuralQuestion1",
        "title": "1.) Should the American government abolish the electoral college?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "structuralQuestion2",
        "title": "2.) Do you support automatic voter registration?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "structuralQuestion3",
        "title": "3.) Do you support Washington DC becoming a state?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "structuralQuestion4",
        "title": "4.) Do you support Puerto Rico becoming a state?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "structuralQuestion5",
        "title": "5.) Should the American Government make it easier to vote?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "structuralQuestion5a",
        "visibleIf": "{structuralQuestion5} = 'item1'",
        "title": "5.) a.) Yes, as long as there are provisions to prevent voter fraud.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "structuralQuestion5noA",
        "visibleIf": "{structuralQuestion5} = 'item2'",
        "title": "5.) a.) No, and it should be made harder for Americans to vote.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "structuralQuestion6",
        "title": "6.) Should there be tighter restrictions on how much money can be given to a campaign and who can give it?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "structuralQuestion7",
        "title": "7.) Should lobbying be banned in the United states?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "structuralQuestion8",
        "title": "8.) Should gerrymandering (the redistricting of a state in order to gain partisan advantage) be allowed?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Structural Issues"
     },
     {
      "name": "page9",
      "elements": [
       {
        "type": "radiogroup",
        "name": "criminalQuestion1",
        "title": "1.) Do you support the decriminalization of marijuana?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "criminalQuestion2",
        "title": "2.) Do you support the decriminalization of other illegal substances?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "criminalQuestion3",
        "title": "3.) Do you support a higher focus on rehabilitation instead of incarceration in our criminal justice system?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "criminalQuestion4",
        "title": "4.) Do you support the death penalty?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "criminalQuestion5",
        "title": "5.) Do you support diverting police funds into community programs designed to help people avoid crime",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "criminalQuestion6",
        "title": "6.) Should convicted criminals be able to vote?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "criminalQuestion7",
        "title": "7.) Should police officers be required to wear body cameras?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "criminalQuestion8",
        "title": "8.) Should solitary confinement be banned for use on juveniles?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Criminal Justice"
     },
     {
      "name": "page10",
      "elements": [
       {
        "type": "radiogroup",
        "name": "educationQuestion1",
        "title": "1.) Should the government increase funding given to low-income schools across America?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "educationQuestion2",
        "title": "2.) Do you support charter schools?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "educationQuestion3",
        "title": "3.) Should the government fund a universal preschool program?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "educationQuestion4",
        "title": "4.) Should we bus students into different school districts in order to create diverse school districts and give students equal opportunity?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "educationQuestion5",
        "title": "5.) Should the government make public universities and colleges free to attend?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "educationQuestion6",
        "title": "6.) Should critical race theory be taught in schools?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Education Issues"
     },
     {
      "name": "page11",
      "elements": [
       {
        "type": "radiogroup",
        "name": "gunQuestion1",
        "title": "1.) Should background checks be required in the process to get a gun?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "gunQuestion2",
        "title": "2.) Should high-capacity magazines be banned in the United States?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "gunQuestion3",
        "title": "3.) Should certain types of assault weapons be banned?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "gunQuestion3a",
        "visibleIf": "{gunQuestion3} = 'item1'",
        "title": "3.) a.) Yes, fully automatic weapons should be banned.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "gunQuestion3b",
        "visibleIf": "{gunQuestion3} = 'item1'",
        "title": "3.) b.) Yes, only single fire weapons should be allowed.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "gunQuestion4",
        "title": "4.) Should teachers be allowed to carry guns at school?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Gun Issues"
     },
     {
      "name": "page12",
      "elements": [
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion1",
        "title": "1.) In general, do you believe that government should be more limited?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion2",
        "title": "2.) In general, do you believe that government should be more expanded than its current state?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion3",
        "title": "3.) In general, do you believe that government is full of corruption and inefficiencies?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion4",
        "title": "4.) In general, do you believe that government provides an invaluable service?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion5",
        "title": "5.) In general, do you support wealth redistribution? (eg. higher taxes on the rich in order to decrease poverty).",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion6",
        "title": "6.) In general, do you support less regulations and restrictions on businesses?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion7",
        "title": "7.) In general, do you support more regulations and restrictions on businesses?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion8",
        "title": "8.) Would you prefer to pay higher taxes in return for more government services?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion9",
        "title": "9.) Would you prefer to pay lower taxes in return for less government services?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion10",
        "title": "10.) In general, do you believe the private market is the most effective way to deliver quality goods and services to individuals? ",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion10a",
        "visibleIf": "{govPhiloQuestion10} = 'item1'",
        "title": "10.) a.) Yes, as long as there is sufficient government regulation/intervention.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion10b",
        "visibleIf": "{govPhiloQuestion10} = 'item1'",
        "title": "10.) b.) Yes, but sometimes the state is better at providing services for certain industries.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "govPhiloQuestion10noA",
        "visibleIf": "{govPhiloQuestion10} = 'item2'",
        "title": "10.) a.) No, state control is the best way to run an economy.",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Government Philosophy"
     },
     {
      "name": "page13",
      "elements": [
       {
        "type": "radiogroup",
        "name": "otherDomIssuesQuestion1",
        "title": "1.) Should the government provide aid to low-income families to help them pay the rent in the form of housing vouchers?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "otherDomIssuesQuestion2",
        "title": "2.) Should we increase funding for public transportation?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "otherDomIssuesQuestion3",
        "title": "3.) Do you support the funding for the VA (the agency that provides healthcare for veterans)?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "otherDomIssuesQuestion4",
        "title": "4.) Should paid maternity and paternity leave be guaranteed for every worker?",
        "choices": [
         {
          "value": "item1",
          "text": "a. Yes"
         },
         {
          "value": "item2",
          "text": "b. No"
         }
        ]
       }
      ],
      "title": "Other Domestic Issues"
     }
    ],
    "showQuestionNumbers": "off",
    "showProgressBar": "top",
    "progressBarType": "questions",
    "firstPageIsStarted": true
   }
  useEffect(() => {
    const getUserSurvey = async () => { 
      const user = await Auth.currentUserInfo();
      const authUser = await Auth.currentAuthenticatedUser();
      const group = await authUser.signInUserSession.idToken.payload['cognito:groups'];
      const sub = await user.attributes.sub;
      const surveyData = await API.graphql(graphqlOperation(getSurvey, {id: sub}));
      if (surveyData.data.getSurvey !== null) {
        const userSurvey = await await surveyData.data.getSurvey.data;
        if (userSurvey) {
          setUserSurvey(userSurvey)
        } else {
          setUserSurvey('You dont have one yet!');
        }
      }
      if (group.includes('candidate')) {
        setIsCandidate(true);
      }    
    }
    getUserSurvey();
  },[userSurvey, isCandidate]);

  const updateUserSurvey = async (newSurvey) => {
    try {
      const user = await Auth.currentUserInfo();
      const sub = await user.attributes.sub;
      const graphqlEntry = { 'id': sub, 'data': newSurvey };
      if (!userSurvey) {
        await API.graphql(graphqlOperation(createSurvey, {input: graphqlEntry}));
      } else {
        await API.graphql(graphqlOperation(updateSurvey, {input: graphqlEntry}));
      }
    } catch (e) {
      console.log(e);
    }
  }

  function onComplete(survey) {
    console.log("The results are:" + JSON.stringify(survey.data));
    const newSurvey = survey.data;
    if (isCandidate) {
      newSurvey.userGroup = 'candidate';
    } else {
      newSurvey.userGroup = 'voter';
    }
    updateUserSurvey(newSurvey);
    setUserSurvey(newSurvey);
  }

  return (
    <div>
      <AmplifySignOut />
      <div class="title-section">
        <h1>Survey Page</h1>
        <p>Answer as many questions as desired to further express your ideals, policy opinions, and beliefs in any field provided down below.</p>
      </div>
      <div class="questions">
        <SurveyQuestions.Survey json={surveyJSON} onComplete={onComplete}/>
      </div>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}


export default withAuthenticator(Survey);
