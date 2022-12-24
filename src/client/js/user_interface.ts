import InputHandler from './input_handler'
import Render from './render'

class UiElement {
  callback: VoidFunction
  x: number
  y: number
  w: number
  h: number
  textureSrc: string
  img = new Image()

  constructor (callback: VoidFunction, x: number, y: number, w: number, h: number, textureSrc: string) {
    this.callback = callback
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.textureSrc = textureSrc
    this.img.src = this.textureSrc
  }
}

class UserInterface {
  showTouchControls: boolean = true
  render: Render
  inputHandler: InputHandler
  imgArrowLeft = new Image()
  imgArrowRight = new Image()
  imgArrowUp = new Image()
  imgArrowDown = new Image()
  uiElements: UiElement[] = []

  constructor (render: Render, inputHandler: InputHandler) {
    this.render = render
    this.inputHandler = inputHandler
    this.imgArrowLeft.src = '/img/arrow_left.svg'
    this.imgArrowRight.src = '/img/arrow_right.svg'
    this.imgArrowUp.src = '/img/arrow_up.svg'
    this.imgArrowDown.src = '/img/arrow_down.svg'
    this.registerUiElements()
  }

  registerUiElements (): void {
    // has to be called on resize because
    // coordinates have to be recalculated based on width
    // or maybe we could support negative coordinates
    // so instead of calculating based on width on resize
    // we calculate based on with in render tick
    // not sure if thats nicer or more performant
    this.uiElements = []
    this.registerTouchControls()
  }

  registerTouchControls (): void {
    const size = 128
    // TODO: should we use inline func definitions here?
    // somehow the whole thing is not structured well
    // its so bloated
    this.uiElements.push(new UiElement(
      this.onControlsLeft,
      this.render.context!.canvas.width - size * 3,
      this.render.context!.canvas.height - size * 2,
      size,
      size,
      '/img/arrow_left.svg'))
    this.uiElements.push(new UiElement(
      this.onControlsRight,
      this.render.context!.canvas.width - size,
      this.render.context!.canvas.height - size * 2,
      size,
      size,
      '/img/arrow_right.svg'))
    this.uiElements.push(new UiElement(
      this.onControlsUp,
      this.render.context!.canvas.width - size * 2,
      this.render.context!.canvas.height - size * 3,
      size,
      size,
      '/img/arrow_up.svg'))
    this.uiElements.push(new UiElement(
      this.onControlsDown,
      this.render.context!.canvas.width - size * 2,
      this.render.context!.canvas.height - size,
      size,
      size,
      '/img/arrow_down.svg'))
  }

  onControlsLeft (): void {
    console.log('clicked left')
  }

  onControlsRight (): void {
    console.log('clicked right')
  }

  onControlsUp (): void {
    console.log('clicked up')
  }

  onControlsDown (): void {
    console.log('clicked down')
  }

  onClick (event: MouseEvent): void {
    const x: number = event.x
    const y: number = event.y
    // console.log(`ui got click at x=${x} y=${y}`)
    for (const uiElement of this.uiElements) {
      if (x < uiElement.x || x > uiElement.x + uiElement.w) {
        return
      }
      if (y < uiElement.y || y > uiElement.y + uiElement.h) {
        return
      }
      uiElement.callback()
    }
  }

  drawTouchControls (): void {
    if (!this.showTouchControls) {
      return
    }

    for (const uiElement of this.uiElements) {
      this.render.context?.drawImage(
        uiElement.img,
        uiElement.x,
        uiElement.y,
        uiElement.w,
        uiElement.h)
    }
  }

  draw (): void {
    this.drawTouchControls()
  }
}

export default UserInterface
