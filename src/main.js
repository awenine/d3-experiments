import { renderChart } from './firstChart'
import './style.css'
import './chartStyles.css'

document.querySelector('#app').innerHTML = `
  <div>
    <p>
      Test for d3
    </p>
  </div>
`



renderChart(document.querySelector('#app'))