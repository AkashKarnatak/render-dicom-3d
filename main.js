import './presets'
import { resetRenderer, renderDicomFileSeries } from './visualize'

const $input = document.querySelector('#file')
const $loader = document.querySelector('#loader')

$input.addEventListener('change', async (e) => {
  // clean up (reset camera position + remove volumes)
  resetRenderer()

  $loader.style.display = 'block'
  const files = Array.from(e.target.files)
  await renderDicomFileSeries(files)
  $loader.style.display = 'none'
})
