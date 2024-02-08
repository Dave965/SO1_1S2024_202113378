import './App.css';
import Webcam from "react-webcam";
import { useCallback, useRef, useState, useEffect } from "react";


function App() {
  const webcamRef = useRef(null);

  const get_uf = async ()=>{
    const data = await fetch("http://localhost:9000/ultima_foto");
    let r = await data.json();
    if(r.resultado){
      Setuf(r.mensaje);
    }else{
      Setuf({});
    }};

  useEffect(()=>{
    get_uf();
  });

  const [uf, Setuf] = useState({});

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();

    fetch("http://localhost:9000/cargar_foto",{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"foto": imageSrc, "fecha":Date.now()})})
    .catch(function (error){
      alert("no se ha podido completar el fetch");
    });
    }, [webcamRef]);

  


  return (
    <div className="App">
      <header className="App-header">
         <div className="container">
            <Webcam className="rounded-border" height={600} width={600} ref={webcamRef}/>
            <div className="btn-container">
              <button onClick={capture}>Capture photo</button>
            </div>
         </div>
         {Object.keys(uf).length > 0 ? (<div className="container"><img src={uf.foto}/> <h2>{new Date(uf.timestamp).toLocaleString()}</h2></div>) : (<></>)}
      </header>
    </div>
  );
}

export default App;
