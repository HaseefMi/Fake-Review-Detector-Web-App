import './review-input.css'
import axios from 'axios'
import { useState, useContext } from 'react'
import { Result } from '../../contexts/result-context';
import { useNavigate } from 'react-router-dom';

function ReviewInput() {
    const [reviewText, setReviewText] = useState(null);
    const [rating, setRating] = useState(null);
    const [category, setCategory] = useState(null);
    const categories = {
        "Home & Kitchen": "🏠🔪",
        "Sports & Outdoors": "🏈",
        "Electronics": "💻",
        "Movies & TV": "📺",
        "Tools & Home Improvment": "⚒️",
        "Pet Items": "🐈",
        "E-Books": "📜",
        "Books": "📚",
        "Toys & Games": "🪀",
        "Clothing, Shoes & Jewelry": "👕👟"
    };
    const ratings = []
    const { setResult } = useContext(Result)
    const [error, setError] = useState(null) 
    const [clickedRating, setClickedRating] = useState(null);
    const [clickedCategory, setClickedCategory] = useState(null);
    const navigate = useNavigate()

    const handleChange = (e) => {
        setReviewText(e.target.value)
    }
    const handleClick = (val, target) => {
        if (target === 'category') {
            setCategory(val)
            setClickedCategory(val)
        } else {
            setRating(val)
            setClickedRating(val)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reviewText) {
            setError('Please Enter Review Text');
            return;
        } 
        if (!category) {
            setError('Please Select a Category');
            return;
        }
        if (!rating) {
            setError('Please Select a Rating');
            return;
        } 
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/send-data/', {
            category: category,
            rating: Number(rating),
            text: reviewText
        })
            setResult(response.data.odds)
            navigate('/result')
        } catch (error) {
            alert('Error Submitting Review')
            console.log(error)
        } 
    }

    for (let i = 1; i < 6; i++) {
        ratings.push(<button 
            style = {{
                backgroundColor: clickedRating === i ? 'black' : 'white',
                color: clickedRating === i ? 'white' : 'black'
            }}
            onClick={() => handleClick(i, 'rating')}
            key={i}>{i}⭐</button>)
    }

    return (
        <div className='container'>
            <h1>Fake Review Checker</h1>
            <h2>Enter Review Text</h2>
            {error === 'Please Enter Review Text' ? <div className='error-msg'>{error}</div> : <></>}
            <textarea placeholder='Enter Review Text' className='text-input'onChange={handleChange}/>
            <div className='review-container'>
            <h2>What's the Review Category?</h2>
            {error === 'Please Select a Category' ? <div className='error-msg'>{error}</div> : <></>}
            {Object.entries(categories).map(([val, emoji]) => (
            <button 
            style={{
                backgroundColor: clickedCategory === val ? 'black' : 'white',
                color: clickedCategory === val ? 'white' : 'black'}} key={val}
                onClick={() => handleClick(val, 'category')}>
            {val} {emoji}
            </button>))}
            </div>
            <br />
            <h2>What's The Review's Rating?</h2>
            {error === 'Please Select a Rating' ? <div className='error-msg'>{error}</div> : <></>}
            {ratings}
            <br />
            <br />
            <button style={{padding: '10px'}}type='button' onClick={handleSubmit}>Check Review</button>
            <br />
        </div>
    )
}

export default ReviewInput