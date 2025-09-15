import { useState, useContext, useEffect } from "react";
import { DesignStyleContext } from "../context/DesignStyleContext";

import { styleQuizContent, styleQuizResults } from "../data/styleQuiz";
import { preProcessQuizData } from "../utils/preProcessQuizData";
import "./StyleQuiz.css";

// const styleQuizContent = [
//   {
//     question: "1",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287878/Brickelliacalifornica_hxewed.jpg",
//   },
//   {
//     question: "2",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753395839/Rosa_Ingrid_Bergman_2018-07-16_6611__cropped_i376sl.jpg",
//   },
//   {
//     question: "3",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282048/Copy_of_cone-flower_zqcl3s.jpg",
//   },
//   {
//     question: "4",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753790675/modern01_mtihwb.jpg",
//   },
//   {
//     question: "5",
//     imageUrl:
//       "https://res.cloudinary.com/dprixcop0/image/upload/v1753127016/spreading-japanese-plum-yew_c7753v.webp",
//   },
//   {
//     question: "6",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753790674/modern-minimal-04_wtosek.webp",
//   },
//   {
//     question: "7",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753790677/modernlush02_guoc3m.jpg",
//   },
//   {
//     question: "8",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753790672/classical01_kajhvg.jpg",
//   },
//   {
//     question: "9",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282055/hakone-grass_inabds.jpg",
//   },
//   {
//     question: "10",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753287882/Hairy_Sunflower__1020466042_hodmut.jpg",
//   },
//   {
//     question: "11",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753790673/cottage_template_z6cd3b.webp",
//   },
//   {
//     question: "12",
//     imageUrl:
//       "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282044/anacacho-orchid-tree_fw1xpf.jpg",
//   },
// ];

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Main App component for the simple Yes/No quiz
export function StyleQuiz() {
  const { styles } = useContext(DesignStyleContext);

  // State to hold the final, randomized quiz items and style counts
  const [quizItems, setQuizItems] = useState(null);
  const [styleTagCounts, setStyleTagCounts] = useState(null);

  // State to manage the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // State to store the user's last answer (optional, for demonstration)
  const [lastAnswer, setLastAnswer] = useState(null);
  // State to track if the quiz is finished
  const [quizFinished, setQuizFinished] = useState(false);

  const [quizScore, setQuizScore] = useState({});

  // prepare quiz with randomized questions and a 10-question limit
  const prepareQuiz = (quizData, styleDefs) => {
    try {
      const { enhancedQuizItems, styleTagCounts: counts } = preProcessQuizData(
        quizData,
        styleDefs
      );

      // Shuffle the enhanced quiz items and limit to 10 questions
      const shuffledItems = shuffleArray(enhancedQuizItems);
      const limitedItems = shuffledItems.slice(0, 10);

      return { limitedItems, counts };
    } catch (e) {
      console.error("Error preparing quiz data:", e.message);
      return null;
    }
  };

  // Use a useEffect to pre-process the data when the styles from the API are available
  useEffect(() => {
    if (styles.length > 0) {
      const quizPrep = prepareQuiz(styleQuizContent, styles);
      if (quizPrep) {
        setQuizItems(quizPrep.limitedItems);
        setStyleTagCounts(quizPrep.counts);

        // Initialize quizScore based on the processed styles
        const initialScore = {};
        styles.forEach((style) => {
          initialScore[style.design_style_name] = 0;
        });
        setQuizScore(initialScore);
      }
    }
  }, [styles]);

  // Handle case where data is still loading
  if (!quizItems || !styleTagCounts) {
    return (
      <div className="quiz-wrapper">
        <h1 className="loading-text">Loading Quiz...</h1>
      </div>
    );
  }

  const currentQuizItem = quizItems[currentQuestionIndex];

  // Function to advance to the next question (NOTE: limiting to 10 questions is handled elsewhere)
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizItems.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setLastAnswer(null); // Reset last answer display for the new question
    } else {
      setQuizFinished(true);
    }
  };

  // Function to handle 'Yes' button click
  const handleYesClick = () => {
    setLastAnswer("Yes");
    console.log(`Question ${currentQuestionIndex + 1}: Yes`);

    // Scoring logic based on the completeness score
    const { designStyleNames, image_tags } = currentQuizItem;
    const matchedTagsCount = image_tags.length;

    setQuizScore((prevScore) => {
      const newScore = { ...prevScore };
      designStyleNames.forEach((styleName) => {
        const totalTagsForStyle = styleTagCounts[styleName];
        if (totalTagsForStyle > 0) {
          const completenessScore = matchedTagsCount / totalTagsForStyle;
          newScore[styleName] += completenessScore;
        }
      });
      return newScore;
    });

    goToNextQuestion();
  };

  // Function to handle 'No' button click (score is only modified with "yes" responses)
  const handleNoClick = () => {
    setLastAnswer("No");
    console.log(`Question ${currentQuestionIndex + 1}: No`);
    goToNextQuestion();
  };

  // Function to restart the quiz
  const restartQuiz = () => {
    // Re-prepare the quiz to get a new set of random questions
    const quizPrep = prepareQuiz(styleQuizContent, styles);
    if (quizPrep) {
      setQuizItems(quizPrep.limitedItems);
      setStyleTagCounts(quizPrep.counts);
    }

    setCurrentQuestionIndex(0);
    setLastAnswer(null);
    setQuizFinished(false);

    // Reset the quiz scores
    const initialScore = {};
    styles.forEach((style) => {
      initialScore[style.design_style_name] = 0;
    });
    setQuizScore(initialScore);
  };

  // Logic to determine the final result style
  const getFinalResult = () => {
    if (quizScore && Object.keys(quizScore).length > 0) {
      let highestScore = -1;
      let winningStyle = "Undetermined";
      let tieStyles = [];

      for (const styleName in quizScore) {
        if (quizScore[styleName] > highestScore) {
          highestScore = quizScore[styleName];
          winningStyle = styleName;
          tieStyles = [styleName]; // Reset tie array
        } else if (quizScore[styleName] === highestScore && highestScore > 0) {
          tieStyles.push(styleName); // Add to tie array
        }
      }

      if (tieStyles.length > 1) {
        return `Your design styles are: ${tieStyles.join(" and ")}`;
      } else {
        return `Your design style is: ${winningStyle}`;
      }
    }
    return "Your results are being calculated...";
  };

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        {quizFinished ? (
          // Display when the quiz is finished
          <div className="quiz-end-screen">
            <h1 className="quiz-question">Congratulations!</h1>
            <p className="quiz-end-text">{getFinalResult()}</p>
            <button onClick={restartQuiz}>Restart Quiz</button>
          </div>
        ) : (
          // Display during the quiz
          <>
            {/* Question Text */}
            <h1 className="quiz-question">
              {currentQuizItem.question || `Do you like this image?`}
            </h1>

            {/* Image Container */}
            <img
              src={currentQuizItem.image_url}
              alt="Quiz Image"
              className="quiz-image"
              // Fallback for image loading errors
              onError={(e) => {
                e.target.onerror = null; // Prevents infinite loop
                e.target.src =
                  "https://placehold.co/600x400/CCCCCC/333333?text=Image+Not+Found";
                console.log(
                  "could not find image at",
                  currentQuizItem.image_url
                );
              }}
            />

            {/* Buttons Container */}
            <div className="quiz-buttons">
              <button onClick={handleYesClick}>Yes</button>
              <button onClick={handleNoClick}>No</button>
            </div>

            {/* Display user's last answer (optional) */}
            {lastAnswer && (
              <p className="last-answer-text">
                You just answered:{" "}
                <span className="last-answer-value">{lastAnswer}</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StyleQuiz;

// const quizQuestions = [
//   {
//     id: 1,
//     question: "1",
//     imageUrl: "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282045/cedar-sedge_hwoyoo.jpg",
//   },
//   {
//     id: 2,
//     question: "2",
//     imageUrl: "https://res.cloudinary.com/dprixcop0/image/upload/v1753128204/boxwood_gqpns0.webp",
//   },
//   {
//     id: 3,
//     question: "3",
//     imageUrl: "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753790676/modernlush01_fpmdn7.jpg",
//   },
//   {
//     id: 4,
//     question: "4",
//     imageUrl: "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753790673/cottage_template_z6cd3b.webp",
//   },
//   {
//     id: 5,
//     question: "5",
//     imageUrl: "https://res.cloudinary.com/dmlezxkp3/image/upload/v1753282059/white-autumn-sage_ekfmqt.jpg",
//   },
// ];

// export default function YesNoQuiz() {
//   // State to keep track of the current question index
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   // State to determine if the quiz is complete
//   const [isQuizComplete, setIsQuizComplete] = useState(false);
//   // State to store answers (optional, but useful if you need to process results)
//   const [answers, setAnswers] = useState([]);

//   // Get the current question object based on the index
//   const currentQuestion = quizQuestions[currentQuestionIndex];

//   // Function to handle a 'Yes' or 'No' answer
//   const handleAnswer = (answer) => {
//     // Record the answer (optional)
//     setAnswers([...answers, { questionId: currentQuestion.id, answer }]);

//     // Move to the next question or complete the quiz
//     if (currentQuestionIndex < quizQuestions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setIsQuizComplete(true);
//     }
//   };

//   // Function to restart the quiz
//   const restartQuiz = () => {
//     setCurrentQuestionIndex(0);
//     setIsQuizComplete(false);
//     setAnswers([]); // Clear previous answers
//   };

//   return (
//     <div className="quiz-container-wrapper" style={quizContainerWrapperStyle}>
//       <div className="quiz-card" style={quizCardStyle}>
//         {isQuizComplete ? (
//           // Display completion message when quiz is done
//           <div style={completionMessageStyle}>
//             <h2>Quiz Complete!</h2>
//             <p>Thank you for taking the quiz. We hope this helps!</p>
//             {/* You can display results here based on the 'answers' state */}
//             {/* For example: <pre>{JSON.stringify(answers, null, 2)}</pre> */}
//             <button onClick={restartQuiz} style={buttonStyle}>Restart Quiz</button>
//           </div>
//         ) : (
//           // Display current question and image
//           <div style={questionDisplayStyle}>
//             <h2 style={questionTextStyle}>{currentQuestion.question}</h2>
//             {currentQuestion.imageUrl && (
//               <img
//                 src={currentQuestion.imageUrl}
//                 alt={`Question ${currentQuestion.id}`}
//                 style={imageStyle}
//                 onError={(e) => {
//                   e.target.onerror = null; // Prevent infinite loop
//                   e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found"; // Fallback image
//                 }}
//               />
//             )}
//             {!currentQuestion.imageUrl && (
//                 <p style={{color: '#666', fontSize: '1em'}}>No image provided for this question.</p>
//             )}
//             <div className="quiz-buttons" style={buttonsContainerStyle}>
//               <button onClick={() => handleAnswer('Yes')} style={buttonStyle}>Yes</button>
//               <button onClick={() => handleAnswer('No')} style={buttonDangerStyle}>No</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const styleQuizContent = [
//   {
//     id: 1,
//     image: (
//       <img src="/corn_flowers.jpeg" alt="Corn Flowers" className="quiz-image" />
//     ),
//     title: "Image 1",
//   },
//   {
//     id: 2,
//     image: "/images/wildflower-style.jpg",
//     title: "Image 2",
//   },
//   {
//     id: 3,
//     image: "/images/symmetrical-design.jpg",
//     title: "Image 3",
//   },
// ];

//Previous Code
// export default function Quiz() {
//   const { styles } = useContext(DesignStyleContext);
//   console.log("styles", styles);

//   const { plantCatalog, plantByName, loadingPlants } =
//     useContext(PlantCatalogContext);
//   console.log("plant Catalog", plantCatalog);

//   const [current, setCurrent] = useState(0);
//   const [isComplete, setIsComplete] = useState(false);

//   console.log("attempt", plantByName("coneflowers"));

//   const plantName = "conflowers"; // Example plant name

//   if (!loadingPlants) {
//     // Ensure the catalog is loaded before searching
//     const foundPlant = plantByName(plantName);

//     if (foundPlant) {
//       const imageUrl = foundPlant.image_url; // This is how you access the image_url
//       console.log(`Image URL for ${plantName}:`, imageUrl);
//       // You can then use imageUrl to display the image in your component
//       // <img src={imageUrl} alt={foundPlant.plant_name} />
//     } else {
//       console.log(`Plant "${plantName}" not found.`);
//     }
//   }

//   const handleAnswer = () => {
//     if (current < styleQuizContent.length - 1) {
//       setCurrent(current + 1);
//     } else {
//       setIsComplete(true);
//     }
//   };

//   const { image, question } = styleQuizContent[current];

//   const styleQuizContent = [
//     {
//       id: 1,
//       image: (
//         <img
//           src="coneflowers.image_ul"
//           alt="Corn Flowers"
//           className="quiz-image"
//         />
//       ),
//       title: "Image 1",
//     },
//     {
//       id: 2,
//       image: "/images/wildflower-style.jpg",
//       title: "Image 2",
//     },
//     {
//       id: 3,
//       image: "/images/symmetrical-design.jpg",
//       title: "Image 3",
//     },
//   ];

//   return (
//     <div className="quiz-wrapper">
//       <div className="quiz-container">
//         {isComplete ? (
//           <>
//             <h2 className="quiz-question">Thanks for taking the quiz!</h2>
//             <p>We hope this helped you get inspired 🌿</p>
//           </>
//         ) : (
//           <>
//             <h2 className="quiz-question">{question}</h2>
//             <img src={image} alt="quiz" className="quiz-image" />
//             <div className="quiz-buttons">
//               <button onClick={handleAnswer}>Yes</button>
//               <button onClick={handleAnswer}>No</button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

//------  code from gemini to absorb
// import React, { useContext, useState, useEffect, useCallback } from 'react';
// import { usePlantCatalog } from '../context/PlantCatalogContext'; // Adjust path as needed

// export default function StyleQuiz() {
//   // Access plantByName and loadingPlants from the PlantCatalogContext
//   const { plantByName, loadingPlants } = usePlantCatalog();

//   const [quizQuestions, setQuizQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [quizResults, setQuizResults] = useState(null);

//   // --- NEW: Helper function to get a plant's image URL by name ---
//   // This function uses the plantByName from context to find the plant
//   // and then returns its image_url.
//   const getPlantImageUrlByName = useCallback((plantName) => {
//     if (loadingPlants) {
//       console.warn("Plant catalog is still loading. Cannot get image URL for:", plantName);
//       return null; // Or a placeholder URL
//     }
//     const plant = plantByName(plantName);
//     if (plant && plant.image_url) {
//       return plant.image_url;
//     }
//     console.warn(`Image URL not found for plant: ${plantName}`);
//     return null; // Or a default/placeholder image URL
//   }, [plantByName, loadingPlants]); // Dependencies: plantByName and loadingPlants

//   // Example of how you might use it (e.g., in a useEffect or a render function)
//   useEffect(() => {
//     // Simulate loading quiz questions which might reference plant names
//     const questions = [
//       {
//         id: 1,
//         text: "Which plant do you prefer?",
//         options: [
//           { value: "optionA", label: "Boxwood" },
//           { value: "optionB", label: "Lavender" },
//         ],
//       },
//       // ... more questions
//     ];
//     setQuizQuestions(questions);

//     // Example usage: Pre-fetch or display an image for a question
//     if (!loadingPlants) { // Ensure plants are loaded before trying to get URLs
//       const boxwoodImageUrl = getPlantImageUrlByName("boxwood");
//       console.log("Boxwood Image URL for quiz:", boxwoodImageUrl);
//       // You would typically use this URL in an <img> tag in your JSX
//     }
//   }, [loadingPlants, getPlantImageUrlByName]); // Re-run when plants load or helper changes

//   const handleAnswer = (questionId, answer) => {
//     setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
//   };

//   const handleSubmitQuiz = () => {
//     // Logic to process answers and determine results
//     setQuizResults("Your ideal style is..."); // Placeholder
//   };

//   if (loadingPlants) {
//     return <div>Loading plant catalog for quiz...</div>;
//   }

//   if (quizQuestions.length === 0) {
//     return <div>No quiz questions available.</div>;
//   }

//   const currentQuestion = quizQuestions[currentQuestionIndex];

//   return (
//     <div>
//       <h1>Style Quiz</h1>
//       {quizResults ? (
//         <div>
//           <h2>Quiz Complete!</h2>
//           <p>{quizResults}</p>
//         </div>
//       ) : (
//         <div>
//           <h3>{currentQuestion.text}</h3>
//           <div>
//             {currentQuestion.options.map((option) => (
//               <div key={option.value}>
//                 <label>
//                   <input
//                     type="radio"
//                     name={`question-${currentQuestion.id}`}
//                     value={option.value}
//                     checked={selectedAnswers[currentQuestion.id] === option.value}
//                     onChange={() => handleAnswer(currentQuestion.id, option.value)}
//                   />
//                   {option.label}
//                   {/* Example of displaying image next to option */}
//                   {getPlantImageUrlByName(option.label) && (
//                     <img
//                       src={getPlantImageUrlByName(option.label)}
//                       alt={option.label}
//                       style={{ width: '100px', height: '100px', objectFit: 'cover', marginLeft: '10px' }}
//                     />
//                   )}
//                 </label>
//               </div>
//             ))}
//           </div>
//           {currentQuestionIndex < quizQuestions.length - 1 ? (
//             <button onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>
//               Next Question
//             </button>
//           ) : (
//             <button onClick={handleSubmitQuiz}>Submit Quiz</button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
