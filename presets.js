import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps'
import MedicalColorPresets from './MedicalColorPresets.json'
import {
  renderWindow,
  createTransferFunctionFromPreset,
  updateTransferFunctions,
} from './visualize'

// set medical presets
MedicalColorPresets.forEach((x) => vtkColorMaps.addPreset(x))

export const presetNames = [
  'CT-AAA',
  'CT-AAA2',
  'CT-Bone',
  'CT-Bones',
  'CT-Cardiac',
  'CT-Cardiac2',
  'CT-Cardiac3',
  'CT-Chest-Contrast-Enhanced',
  'CT-Chest-Vessels',
  'CT-Coronary-Arteries',
  'CT-Coronary-Arteries-2',
  'CT-Coronary-Arteries-3',
  'CT-Cropped-Volume-Bone',
  'CT-Fat',
  'CT-Liver-Vasculature',
  'CT-Lung',
  'CT-MIP',
  'CT-Muscle',
  'CT-Pulmonary-Arteries',
  'CT-Soft-Tissue',
  'CT-Air',
  'CT-X-ray',
]

// define dropdown with presetNames
const dropdownHtml = `
<select name="cars" id="cars">
  ${presetNames.map((x) => `<option value="${x}">${x}</option>`).join('\n  ')}
</select>
`
const container = document.createElement('div')
container.innerHTML = dropdownHtml
const dropdown = container.firstElementChild
const { rgbFn, opacityFn } = createTransferFunctionFromPreset('CT-AAA')
updateTransferFunctions({ rgbFn, opacityFn })

dropdown.addEventListener('change', (e) => {
  console.log('changed', e.target.value)
  const { rgbFn, opacityFn } = createTransferFunctionFromPreset(e.target.value)
  updateTransferFunctions({ rgbFn, opacityFn })
  renderWindow.render()
})

document.querySelector('#file').insertAdjacentElement('afterend', dropdown)
