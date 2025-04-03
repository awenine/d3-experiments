import { renderChart } from './firstChart'
import './style.css'
import './chartStyles.css'

document.querySelector('#app').innerHTML = `
  <div>
    <p>
      D3 Sandbox
    </p>
  </div>
`



renderChart(document.querySelector('#app'))