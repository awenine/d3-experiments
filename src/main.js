import { renderChart } from './firstChart'
import './style.css'
import './chartStyles.css'
import binanceAllProductsString from './testdata/BINANCE_AllProducts-string'


document.querySelector('#app').innerHTML = `
  <div>
    <p>
      D3 Sandbox
    </p>
  </div>
`

// PROPERTIES

// "notional"
// "fee_cost"
// "price"
// "amount"

// GROUPS

// "symbol"
// "fee_currency"
// "side"
// "product"
// "sub_type"
// "taker_or_maker"

renderChart(document.querySelector('#app'), binanceAllProductsString, "notional", "symbol", true)
renderChart(document.querySelector('#app'), binanceAllProductsString, "fee_cost", "symbol")
renderChart(document.querySelector('#app'), binanceAllProductsString, "price", "symbol")
renderChart(document.querySelector('#app'), binanceAllProductsString, "amount", "symbol")
renderChart(document.querySelector('#app'), binanceAllProductsString, "notional", "fee_currency")
renderChart(document.querySelector('#app'), binanceAllProductsString, "fee_cost", "fee_currency")
renderChart(document.querySelector('#app'), binanceAllProductsString, "price", "fee_currency")
renderChart(document.querySelector('#app'), binanceAllProductsString, "amount", "fee_currency")
renderChart(document.querySelector('#app'), binanceAllProductsString, "notional", "side")
renderChart(document.querySelector('#app'), binanceAllProductsString, "fee_cost", "side")
renderChart(document.querySelector('#app'), binanceAllProductsString, "price", "side")
renderChart(document.querySelector('#app'), binanceAllProductsString, "amount", "side")
renderChart(document.querySelector('#app'), binanceAllProductsString, "notional", "product")
renderChart(document.querySelector('#app'), binanceAllProductsString, "fee_cost", "product")
renderChart(document.querySelector('#app'), binanceAllProductsString, "price", "product")
renderChart(document.querySelector('#app'), binanceAllProductsString, "amount", "product")