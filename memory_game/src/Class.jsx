import { useState, useEffect } from "react";
import "./App.css";
import { capitalize, shuffleArray } from "./SupportFn";
import PropTypes from "prop-types";

const Fetch = () => {
    const [array, setArray] = useState([1, 2, 3])
    const [photos, setPhotos] = useState([]);
    const [score, setScore] = useState(0);
    const [reset, setReset] = useState(false);
    function incrementScore() {
        setScore(score + 1);
        setReset(false);
    }
    function resetScore() {
        setScore(0);
        setReset(true);
    }
    console.log(score)
    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon/")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setPhotos(shuffleArray(data.results));
            });
    }, [array]);

    const permutateArray = () => {
        setPhotos(shuffleArray(photos));
        setArray(photos);
    };
    return (
        <div>
            <div className="header-div">
                <h1>Pokémon Memory</h1>
                <h3>Your score: {score}</h3>
            </div>
            <p className="description">Increase your score by clicking on a Pokémon. But be careful, if you click one twice, your score will be lost.</p>
            <div className="card-div">
                {photos.map((photo) => (
                    <Card key={photo.name} url={photo.url} name={photo.name} permutateArray={permutateArray} photos={photos} resetScore={resetScore} incrementScore={incrementScore} reset={reset} />
                ))}
            </div>
            <p className = "copyright">© Pokémon is a trademark of Nintendo Inc.</p>
        </div>
    );
};

function Card({ name, permutateArray, url, resetScore, incrementScore, reset }) {
    const [card, setCard] = useState();
    const [clicked, setClicked] = useState(false);
    const handleClick = () => {
        clicked ? resetScore() : incrementScore();
        setClicked(!clicked);
        permutateArray();
        console.log(clicked);
    }
    useEffect(() => {
        if (reset) {
            setClicked(false);
        }
    }, [reset]);
    useEffect(() => {
        fetch(url)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setCard(data.sprites.front_default);
            });
    }, [url]);

    return (
        <div className="card" onClick={handleClick}>
            <p>{capitalize(name)}</p>
            <img
                src={card}
            />
        </div>
    )
}

Card.propTypes = {
    name: PropTypes.string,
    permutateArray: PropTypes.func,
    url: PropTypes.string,
    resetScore: PropTypes.func,
    incrementScore: PropTypes.func,
    reset: PropTypes.bool
}
export { Fetch };