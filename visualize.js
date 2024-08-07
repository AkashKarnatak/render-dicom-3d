import '@kitware/vtk.js/Rendering/Profiles/Volume'
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow'
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps'
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume'
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper'
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction'
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction'
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper'
import { setPipelineWorkerUrl, readImageDicomFileSeries } from '@itk-wasm/dicom'

// set url to where worker is available (your custom location specified in vite config)
setPipelineWorkerUrl(
  document.location.origin + '/itk/itk-wasm-pipeline.min.worker.js',
)

// Set up the rendering environment
const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0.1, 0.1, 0.1],
})
export const renderer = fullScreenRenderer.getRenderer()
export const renderWindow = fullScreenRenderer.getRenderWindow()
const mapper = vtkVolumeMapper.newInstance()
const actor = vtkVolume.newInstance()

mapper.setSampleDistance(0.7)
actor.setMapper(mapper)

// clean up (reset camera position + remove volumes)
export function resetRenderer(presetName) {
  renderer.getActiveCamera().setPosition(0, 0, 1)
  renderer.getActiveCamera().setFocalPoint(0, 0, 0)
  renderer.getActiveCamera().setViewUp(0, 1, 0)
  renderer.getVolumes().forEach((x) => renderer.removeVolume(x))
  renderWindow.render()
}

export async function renderDicomFileSeries(files) {
  const { outputImage, webWorkerPool, sortedFilenames } =
    await readImageDicomFileSeries({
      webWorkerPool: null,
      inputImages: files,
      singleSortedSeries: false,
    })
  console.log(outputImage)
  webWorkerPool.terminateWorkers()

  const vtkImage = vtkITKHelper.convertItkToVtkImage(outputImage)
  console.log(vtkImage)

  mapper.setInputData(vtkImage)
  renderer.addVolume(actor)
  renderer.resetCamera()
  renderer.getActiveCamera().zoom(1.5)
  renderer.getActiveCamera().elevation(-90)
  renderer.updateLightsGeometryToFollowCamera()
  renderWindow.render()
}

export function createTransferFunctionFromPreset(presetName) {
  const preset = vtkColorMaps.getPresetByName(presetName)

  const rgbFn = vtkColorTransferFunction.newInstance()
  for (let i = 0; i < preset.RGBPoints.length; i += 4) {
    rgbFn.addRGBPoint(
      preset.RGBPoints[i],
      preset.RGBPoints[i + 1],
      preset.RGBPoints[i + 2],
      preset.RGBPoints[i + 3],
    )
  }

  const opacityFn = vtkPiecewiseFunction.newInstance()
  for (let i = 0; i < preset.OpacityPoints.length; i += 2) {
    opacityFn.addPoint(preset.OpacityPoints[i], preset.OpacityPoints[i + 1])
  }

  return { rgbFn, opacityFn }
}

export function updateTransferFunctions({ rgbFn, opacityFn }) {
  actor.getProperty().setRGBTransferFunction(0, rgbFn)
  actor.getProperty().setScalarOpacity(0, opacityFn)
  actor.getProperty().setInterpolationTypeToLinear()
  actor.getProperty().setShade(true)
}

// expose for debugging purpose
window.vtk = {
  renderer: renderer,
  renderWindow: renderWindow,
  actor: actor,
  mapper: mapper,
  colorMap: vtkColorMaps,
}
