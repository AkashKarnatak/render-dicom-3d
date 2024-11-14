import './presets'
import {
  resetRenderer,
  renderDicomFileSeries,
  renderNrrdFile,
} from './visualize'

const $input = document.querySelector('#file')
const $nrrdInput = document.querySelector('#nrrdFile')
const $loader = document.querySelector('#loader')

$input.addEventListener('change', async (e) => {
  // clean up (reset camera position + remove volumes)
  resetRenderer()

  $loader.style.display = 'block'
  const files = Array.from(e.target.files)
  await renderDicomFileSeries(files)
  $loader.style.display = 'none'
})

$nrrdInput.addEventListener('change', async (e) => {
  $loader.style.display = 'block'
  const files = Array.from(e.target.files)
  await renderNrrdFile(files[0])
  $loader.style.display = 'none'
})
