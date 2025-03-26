import { renderChart } from './firstChart'
import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <p>
      Test for d3
    </p>
  </div>
`

renderChart(document.querySelector('#app'))