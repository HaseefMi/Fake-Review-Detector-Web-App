import './review-input.css'
import axios from 'axios'
import { useState, useContext } from 'react'
import { Result } from '../../contexts/result-context';
import { useNavigate } from 'react-router-dom';
function ReviewInput() {
    const [reviewText, setReviewText] = useState(null);
    const [rating, setRating] = useState(null);
    const [category, setCategory] = useState(null);
    const categories = ['Home & Kitchen 🏠🔪', 'Sports & Outdoors 🏈', 'Electronics 💻', 'Movies & TV 📺', 
    'Tools & Home Improvment ⚒️', 'Pet Items 🐈', 'E-Books 📜', 'Books 📚', 'Toys & Games 🪀', 
    'Clothing, Shoes & Jewlery 👕👟💍']
    const ratings = []
    const { setResult } = useContext(Result)
    const [error, setError] = useState(null) 
    const navigate = useNavigate()

    const handleChange = (e) => {
        setReviewText(e.target.value)
    }
    const handleClick = (val, target) => {
        if (target === 'category') {
            let value = val.replace(/[^\P{Emoji}\s]+$/gu, '').trim();
            setCategory(value)
        } else {
            setRating(val)
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
        ratings.push(<button onClick={() => handleClick(i, 'rating')}key={i}>{i}⭐</button>)
    }

    return (
        <div>
            <h2>Enter Review Text</h2>
            <textarea onChange={handleChange}/>
            <h2>What's the Review Category?</h2>
            {categories.map((val, index) => (
                <button key={index} onClick={() => handleClick(val, 'category')}>{val}</button>
            ))}
            <br />
            <h2>What's The Review's Rating?</h2>
            {ratings}
            <br />
            <button type='button' onClick={handleSubmit}>Check Review</button>
            <br />
            {error}
        </div>
    )
}

export default ReviewInput