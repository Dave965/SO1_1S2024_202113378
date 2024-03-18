import React, {useState} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);
ChartJS.defaults.color = '#F8F8F2';
ChartJS.defaults.font.family = 'Questrial';

function PieChart(props){
	const [full, setFull] = useState(false);

	let customLabels = props.d.labels.map((label,index) =>`${label}: ${props.d.data[index]}%`)
	const data = {
	  labels: customLabels,
	  datasets: [
	    {
	      label: props.d.label,
	      fontColor: '#F8F8F2',
	      borderColor: props.d.color[0],
	      data: props.d.data,
	      backgroundColor: props.d.color,
	      hoverOffset: 4
	    }
	  ]
	};

	const options = {
		plugins: {
			title: {
				display: true,
				text: props.d.title
			},
			font:{
				size: 200
			},
		}
	};

	const toggle_full = () => {
		setFull(!full);
	};

	return(
		<Pie data={data} options={options} onClick={toggle_full} className={full ? "full" : "mini"}/>
	);
}


export default PieChart;
