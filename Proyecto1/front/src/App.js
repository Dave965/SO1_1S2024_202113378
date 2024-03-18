import './App.css';
import PieChart from './components/pie_chart/pie_chart.jsx';
import Arbol from './components/arbol/arbol.jsx';
import Graphviz from 'graphviz-react';
import {useState, useEffect} from 'react';

function App() {
	const [mem, setMem] = useState(null);
	const [cpu, setCpu] = useState(null);
	const [data, setData] = useState(null);
	const [opts, setOpts] = useState(null);
	const [nodes, setNodes] = useState(null);
	const [edges, setEdges] = useState(null);
	const [sel, setSel] = useState(0);
	const [count, setCount] = useState(0);
	
	const [optsSim, setOptsSim] = useState([]);
	const [procesosSimulados, setProcesosSimulados] = useState([]);
	const [simActual, setSimActual] = useState(-1);
	
	
	const listaGraficas=[
	//inicial 0
	`digraph G {
    rankdir=LR;
    node[shape=circle];
    nuevo [fillcolor=cornflowerblue style=filled];
    listo [fillcolor=cornflowerblue style=filled];
    ejecutando[fillcolor=palegreen style=filled];
    nuevo -> listo[arrowhead=none];
    listo -> ejecutando[arrowhead=none];
}`,
//regresa de corriendo a listo 1
`digraph G {
    rankdir=LR;
    node[shape=circle];
    nuevo [fillcolor=cornflowerblue style=filled];
    listo [fillcolor=palegreen style=filled];
    ejecutando[fillcolor=cornflowerblue style=filled];
    nuevo -> listo[arrowhead=none];
    listo -> ejecutando[arrowhead=none];
    ejecutando -> listo;
}`,
//detenido al inicio 2
`digraph G {
    rankdir=LR;
    node[shape=circle];
    nuevo [fillcolor=cornflowerblue style=filled];
    listo [fillcolor=cornflowerblue style=filled];
    ejecutando[fillcolor=cornflowerblue style=filled];
    detenido[fillcolor=lightcoral style=filled];
    nuevo -> listo[arrowhead=none];
    listo -> ejecutando[arrowhead=none];
    ejecutando -> detenido;
}`,
//vuelve a corriendo 3
`digraph G {
    rankdir=LR;
    node[shape=circle];
    nuevo [fillcolor=cornflowerblue style=filled];
    listo [fillcolor=cornflowerblue style=filled];
    ejecutando[fillcolor=palegreen style=filled];
    nuevo -> listo[arrowhead=none];
    listo -> ejecutando;
    ejecutando -> listo[arrowhead=none];
}`,
//detenido desde listo 4
`digraph G {
    rankdir=LR;
    node[shape=circle];
    nuevo [fillcolor=cornflowerblue style=filled];
    listo [fillcolor=cornflowerblue style=filled];
    ejecutando[fillcolor=cornflowerblue style=filled];
    detenido[fillcolor=lightcoral style=filled];
    nuevo -> listo[arrowhead=none];
    listo -> ejecutando[arrowhead=none];
    ejecutando -> listo[arrowhead=none];
    listo -> detenido;
}`, 
//detenido desde corriendo 5
`digraph G {
    rankdir=LR;
    node[shape=circle];
    nuevo [fillcolor=cornflowerblue style=filled];
    listo [fillcolor=cornflowerblue style=filled];
    ejecutando[fillcolor=cornflowerblue style=filled];
    detenido[fillcolor=lightcoral style=filled];
    nuevo -> listo[arrowhead=none];
    listo -> ejecutando[arrowhead=none];
    ejecutando -> listo[arrowhead=none];
    ejecutando -> detenido;
}`];


	useEffect(()=>{
      const interval = setInterval(()=> get_datos(), 1000);
      return () => clearInterval(interval);
    },[]);
    
  useEffect(()=>{
  	get_procesos();
  },[sel]);
  
  useEffect(()=>{
  	if(data == null){
  		setCount(count+1);
  	}else{
  		let res = construirArbol(data[sel], data);
			setNodes(res[0]);
			setEdges(res[1]);
  	}
  },[count]);
  
	function get_datos() {
		fetch('/data')
			.then((res) => res.json())
	    .then((d) => {
	    	d = JSON.parse(d);
	    	
		  	const nMem = {      
		  		labels:["En uso", "Libre"],
		  		label: "%",
		  		data: [d.memoria_ocupada, 100-d.memoria_ocupada],
		  		color: ["#6488ea","#282c34"],
		  		title: "Memoria Ram"
    		}
    		
    		setMem(nMem);
    		
    		let utilizacion = 100*d.cpu_utilizado/2;
    		utilizacion = Math.round(utilizacion*100)/100;
    		let liberada = Math.round((100-utilizacion)*100)/100;
    		
    		if(utilizacion > 100){
    			utilizacion = 100;
    			liberada = 0;
    		}
    		
    		const nCpu = {      
		  		labels:["En uso", "Libre"],
		  		label: "%",
		  		data: [utilizacion, liberada],
		  		color: ["#6488ea","#282c34"],
		  		title: "CPU"
    		}
    		setCpu(nCpu);

  	}).catch(error => {console.log(error);});
	};
	
	function get_procesos() {
		fetch('/data')
				.then((res) => res.json())
			.then((d) => {
				d = JSON.parse(d);
				let options = [];
				
				for(let p of d.procesos){
				  options.push(<option value={d.procesos.indexOf(p)}>{p.pid}</option>); 
				}
				setData(d.procesos);
				setOpts(options);
				
	}).catch(error => {console.log(error);});
	};
	
	
	function construirArbol(proceso, lista){
		let resNodes = [];
		let resEdges = [];
		
		resNodes.push({id: proceso.pid, label: proceso.nombre+"\npid: "+proceso.pid});
		
		
		for(let h of proceso.hijos){
			resEdges.push({from: proceso.pid, to: h});
			let hijo = lista.filter(obj => {return obj.pid == h})[0];
			let res = construirArbol(hijo, lista);
			resNodes = resNodes.concat(res[0]);
			resEdges = resEdges.concat(res[1]);
			
		}
		
		return [resNodes, resEdges]
	};
	
	function cambioSel(e){
		setSel(e.target.value);
		setCount(count+1);
	}
	
	function cambioSelSim(e){
		setSimActual(e.target.value);
		setCount(count+1);
	}
	
	const generaNuevo = ()=>{
		fetch('/iniciarP')
			.then((res) => res.json())
				.then((d) => {
					let nPid = d.pid;
					let nSim = {pid: nPid, grafica: 0, terminado: false, cambiado: false};
					setProcesosSimulados([...procesosSimulados, nSim])
					setOptsSim([...optsSim, <option value={optsSim.length}>{nPid}</option>]);
		}).catch(error => {console.log(error);});
	};
	
	const pararSim = ()=>{
		if(simActual == -1){
			alert("no se ha seleccionado un proceso");
			return
		}
		
		let proc = procesosSimulados[simActual];
		
		if(proc.terminado){
			alert("proceso terminado, no se puede parar");
			return
		}else if(proc.anterior == "parar"){
			alert("el proceso esta en pausa");
			return
		}
		
		procesosSimulados[simActual].anterior = "parar";
		procesosSimulados[simActual].cambiado = true;
		procesosSimulados[simActual].grafica = 1;
		
		fetch('/pararP', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
				"pid": simActual.pid
			})
		});
	}
	
	const continuarSim = ()=>{
		if(simActual == -1){
			alert("no se ha seleccionado un proceso");
			return
		}
		
		let proc = procesosSimulados[simActual];
		
		if(proc.terminado){
			alert("proceso terminado, no se puede continuar");
			return
		}else if(proc.anterior == "continuar" || proc.anterior == null){
			alert("el proceso ya esta en ejecucion");
			return
		}
		
		procesosSimulados[simActual].anterior = "continuar";
		procesosSimulados[simActual].cambiado = true;
		procesosSimulados[simActual].grafica = 3;
		
		fetch('/continuarP', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
				"pid": simActual.pid
			})
		});
	}
	
	const terminarSim = ()=>{
		if(simActual == -1){
			alert("no se ha seleccionado un proceso");
			return
		}
		
		let proc = procesosSimulados[simActual];
		
		if(proc.terminado){
			alert("proceso ya terminado");
			return
		}
		
		if(!proc.cambiado){
			procesosSimulados[simActual].terminado = true;
			procesosSimulados[simActual].grafica = 2;
		}else if(proc.anterior == 'parar'){
			procesosSimulados[simActual].terminado = true;
			procesosSimulados[simActual].grafica = 4;
		}else{
			procesosSimulados[simActual].terminado = true;
			procesosSimulados[simActual].grafica = 5;
		}
		
		fetch('/terminarP', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
				"pid": simActual.pid
			})
		});
	}
	
	return (
	<div className="App">
		<section className="sectionTR">
			<h1>Monitoreo en Tiempo Real</h1>
			<div className="gPie">
				<div className="gContainer">
			  		{mem ? <PieChart d={mem}/> : <h1>cargando...</h1>}
			  	</div>
			  	<div className="gContainer">
			  		{cpu ? <PieChart d={cpu}/> : <h1>cargando...</h1>}
			  	</div>
			</div>
	  </section>
	  <section className="sectionAP">
			<h1>Arbol de procesos</h1>
				{ data && 
				<> 
					<select onChange={e => cambioSel(e)}>
						{opts}
					</select>
					<div className="arbol">
						<Arbol nodes={nodes} edges={edges}/>
					</div>
				</>
				}
	  </section>
	  <section className="sectionSP">
			<h1>Simulacion de proceso</h1>
			<div>
			<select onChange={e => cambioSelSim(e)}>
				{optsSim}
			</select>
			<button onClick={generaNuevo}>Nuevo</button>
			<button onClick={pararSim}>Parar</button>
			<button onClick={continuarSim}>Continuar</button>
			<button onClick={terminarSim}>Terminar</button>
			</div>
			{ simActual >= 0 &&
				<Graphviz dot={listaGraficas[procesosSimulados[simActual].grafica]} className="graphviz"/>
			}
	  </section>
	</div>
	);
}

export default App;
