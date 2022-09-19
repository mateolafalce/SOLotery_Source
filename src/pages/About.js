import "App.css";
import {
  NavLink
} from "react-router-dom"

export default function About() {
  return (
  <div>
    <header>
      <nav>
        <ul>
          <li><NavLink to="/">SOLotery</NavLink></li>
          <li><NavLink to="/exchange">Exchange</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink><a>Manifiesto</a></NavLink></li>
          <li><a target="_blank" href="https://github.com/mateolafalce/SOLotery_Source">Github</a></li>
          <li><NavLink>Refresh</NavLink></li>
        </ul>
      </nav>
    </header>
    <div className="App-header">
      <h1>
        About SOLotery
      </h1>
      <h3>
        Blockchain + lottery
      </h3>
        <p>
          lorem
        </p>
      <h3 bgcolor="#1e9a64">
        Economics
      </h3>
        <p>
          Todos los dias hay un ganador.
          Los dividendos criptograficos que proporciona SOLotery varia segun el pozo.
          El ganador de la loteria se lleva el 98% del pozo. 
          El otro 2% restante se reparte en el momento del envio del dinero entre los 8 accionsita de la loteria.
          1 de las 8 partes se destina al mantenimiento del proyecto en blockchain. 
          Y las restante 7 se comercializan aqui.
          La mejor propuesta se queda con los dividendo y las ganancias.
          Si tiene una mejor propuesta que la vigente, podra obtener un ingreso pasivo diario.
        </p>
      <h3>
        Contact
      </h3>
        <p>
          lorem
        </p>
    </div>
    </div>
  )
}
