import './result-display.css';
import { useContext, useEffect } from 'react';
import { Result } from '../../contexts/result-context';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

function ResultDisplay() {
    let { result } = useContext(Result);
    const navigate = useNavigate()
    useEffect(() => {
        if (!result) navigate('/')
    }) 
    
    const resultPercentage = Math.round(result * 1000) / 10; 
    const humanOdds = 100 - resultPercentage;
    result = Math.round(result * 1000) / 10

    const data = {
        labels: ['Odds of Being an Authentic Review', 'Odds of Being a Fake Review'],
        datasets: [
            {
                data: [humanOdds, resultPercentage],
                backgroundColor: ['#008000', '#ff0000'],
                hoverBackgroundColor: ['#2fc72f', '#951e1e'],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                },
            }
        }
    };
    

    return (
        <div className='result-display-container'style={{ width: '300px', height: '300px' }}>
            <h2 style={{textAlign: 'center'}}className='result-title'>Result For Your Review</h2>
            <br />
            <h3><span style={{color: 'lightgreen'}}>{humanOdds}%</span> Chance This Review is Authentic</h3>
            <h3><span style={{color: 'red'}}>{result}%</span> Chance This Review is Fake</h3>
            <Pie data={data} options={options} />
            <br />
            <button onClick={() => {navigate('/')}}>Return To Home</button>
            <p className='disclaimer'>Disclaimer: This model only tells you the likelyhood of a review not being authentic. Like any AI model it can be mistaken. This tool is meant merely as a guide
            </p>
        </div>
    );
}

export default ResultDisplay;
