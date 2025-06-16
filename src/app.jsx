import React from "react"
import { languages } from "./languages"
import { clsx } from "clsx"
import { getFarewellText } from "./util"
import Words from "./words"
import Confetti from 'react-confetti'

export default function App(){


    const[guessedLetters,setGuessedLetters]=React.useState([])
    const [currentWord,setCurrentWord] = React.useState(()=>Words())
    const [farewellLanguage, setFarewellLanguage] = React.useState(null);

    const wrongGuessCount = guessedLetters.filter(
        letter => !currentWord.includes(letter)
        ).length;

    const alphabets="abcdefghijklmnopqrstuvwxyz"
    


    function addGuessedLetter(letter) {
    setGuessedLetters(prev => {
        const letterSet = new Set(prev);
        letterSet.add(letter);
        return Array.from(letterSet);
    });

    if (!currentWord.includes(letter)) {
        // Only set when the guess is wrong
        setFarewellLanguage(languages[wrongGuessCount]?.name);
    }
}

/*✅ Basic Way: Use .split()
js
Copy code
const str = "apple,banana,orange";
const arr = str.split(","); // ["apple", "banana", "orange"]
➤ You can split by:
A comma str.split(",")

A space str.split(" ")

A character str.split("") → splits into each letter */

    

    const languageElements =  languages.map((lang,index) => {



        const styles={
            backgroundColor:lang.backgroundColor,
            color:lang.color
        }
           return (
                 <span 
                    className={index < wrongGuessCount ? "chip lost":"chip"} 
                    key={index}
                    style={styles}
                 >
                {lang.name}
            </span>
        )
    }
)



const isGameOver = (wrongGuessCount === languages.length) ? true : false

const isGameWon=currentWord.split("").every(letter => guessedLetters.includes(letter))

const lastGuessedLetter = guessedLetters[guessedLetters.length-1]
const lastGuessIncorrect =lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

function card() {
    if (!isGameOver && !isGameWon && farewellLanguage) {
        return (
            <section className="status farewell" id="display">
                <p>{getFarewellText(farewellLanguage)}</p>
            </section>
        );
    } else {
        return (
            <section className={isGameOver ? "status lose" : "status"} id={(isGameOver || isGameWon) ? "display" : "nodisplay"}>
                <h2>{isGameOver ? "Game Over!" : "You Win!"}</h2>
                <p>{isGameOver ? "You lose! Try again 👎" : "Well done! 🎉"}</p>
            </section>
        );
    }
}

const keyboardElements=alphabets.split("").map(alphabet => {
        const isGuessed=guessedLetters.includes(alphabet)
        const isCorrect=isGuessed && currentWord.includes(alphabet)
        const isWrong=isGuessed && !currentWord.includes(alphabet)
        const className = clsx({
            correct: isCorrect,//clsx applies correct class to the specified DOM element if isCorrect returns true
            wrong:isWrong,//clsx applies wrong class to the specified DOM element if isWrong returns true
        })


        return (<button
                className={className} 
                key={alphabet} 
                disabled={isGameOver||isGameWon}
                onClick={()=>addGuessedLetter(alphabet)
            }>{alphabet.toUpperCase()}
        </button>
        )
        })


    const letterElements=currentWord.split("").map((letter,index) => {
    if(!isGameOver){
    return(
    <span key={index}>{guessedLetters.includes(letter)?letter:""}</span>)
    }
    else{
        const isMissed = !guessedLetters.includes(letter)
        return(
            <span key={index}
                className={clsx({missed: isMissed})}
            >{letter}</span>
        )
    }
    }
    )


    return(
        <main>
            {isGameWon && 
            <Confetti
                recycle={false}
                numberOfPieces={1000}
                />}
            <header>
                <h1>GuessTheWord</h1>
                <p>Guess the word within 9 attempts to keep the  world safe from Animal Kingdom Pirates</p>
            </header>
            {card()}
            
           <section className="language-chips">
                {languageElements}
           </section>
           <section className="word">
            {letterElements}
           </section>
           <section className="keyboard">
            {keyboardElements}
           </section>
           { (isGameOver || isGameWon) && <button className="new-game"  onClick={() => window.location.reload()} >New Game</button>}
        </main>
    )
}