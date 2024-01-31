import { useState } from 'react';
import Tile from './componentes/tile/tile.jsx';
import Card from './componentes/card/card.jsx';
import './App.css';

function App() {
  const [carnet, setC] = useState("");
  const [nombre, setN] = useState("");
  const [github, setG] = useState("");
  const [linkedin, setL] = useState("");
  const [posicion, setP] = useState("");
  const [fetched, setF] = useState(false);
  const [tile_matrix, setTM] = useState(x =>{
    x = [];
    
    for (let i = 0; i < 19*9; i++) {
      x.push(Tile());
    }

    return x;
  });

  const get = ()=>{
    fetch('http://localhost:8080/data')
         .then((res) => res.json())
         .then((data) => {
            setF(true);
            setC(data.carnet);
            setN(data.nombre);
            setG(data.github);
            setL(data.linkedin);
            setP(data.posicion);
         })
         .catch((err) => {
            console.log(err.message);
         });
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div id="tiles">
        {tile_matrix}
      </div>
      {fetched && <div className="popup-card"><Card
      name={nombre}
      carnet={carnet}
      position={posicion} 
      github={github}
      linkedin={linkedin}
      />
      </div>}
      <button id="get_datos" onClick={get}>
      Datos
      </button>

    </div>
  );
}

export default App;
