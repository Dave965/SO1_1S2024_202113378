import {useState, useEffect} from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {RamLibre} from "../wailsjs/go/main/App";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
    const [ramOcupada, setOc] = useState(0);
    const [ramLibre, setLb] = useState(0);
    const [porUso, setPu] = useState(0);
    
    const updateResultText = (result) => {
    	let separados = result.split("|");
    	let lib = parseInt(separados[1]);
    	let total = parseInt(separados[0]);
    	let porcentaje = ((1-(lib/total))*100)
    	setLb(lib);
    	setOc(total-lib);
    	setPu(porcentaje.toFixed(2));
    };
    
    const data = {
    	labels:[
    	'Ocupada',
    	'Libre'
    	],
    	datasets:[{
    	label: 'Uso de Ram',
    	data: [ramOcupada,ramLibre],
    	backgroundColor:[
    		'rgb(255,99,132)',
    		'rgb(54,162,235)'
    	],
    	hoverOffset: 4
    	}]    	
    };
    
    useEffect(()=>{
    	const interval = setInterval(()=> get_ram(), 1000);
    	return () => clearInterval(interval);
    },[]);
    
    function get_ram() {
        RamLibre().then(updateResultText);
    }
    
   	get_ram();

    return (
        <div id="App">
        	<h1>RAM</h1>
        	<h2>{porUso}% en uso</h2>
            <Doughnut className="chart" data={data}/>
        </div>
    )
}

export default App
