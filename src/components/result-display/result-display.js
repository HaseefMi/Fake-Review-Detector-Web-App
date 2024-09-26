import './result-display.css';
import { useContext, useEffect } from 'react';
import { Result } from '../../contexts/result-context';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

function ResultDisplay() {
    const { result } = useContext(Result);
    const navigate = useNavigate()
    useEffect(() => {
        if (!result) navigate('/')
    })
    
    const resultPercentage = Math.round(result * 1000) / 10; 
    const humanOdds = 100 - resultPercentage;

    const data = {
        labels: ['Odds of Being Human Generated', 'Odds of Being Computer Generated'],
        datasets: [
            {
                data: [humanOdds, resultPercentage],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '300px', height: '300px' }}>
            <p>There is a {humanOdds}% Chance This Review Was Human Generated & A {resultPercentage}% Chance This was Computer Generated Review</p>
            <Pie data={data} options={options} />
            <br />
            <p>DISCLAIMER: This model only tells you the likelyhood of a review not being authentic. Like any AI model it can be mistaken. This tool is meant merely as a guide
            </p>
            <button onClick={() => {navigate('/')}}>Return To Home</button>
        </div>
    );
}

export default ResultDisplay;
