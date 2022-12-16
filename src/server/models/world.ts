import randomNumber from "../math"

class World {
    width: number
    height: number
    platforms: Array<object>

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.platforms = []
        this.generatePlatforms()
    }

    generatePlatforms() {
        const num = randomNumber(10, 20)
        for(let i = 0; i < num; i++) {
            const plat = {
                x: randomNumber(0, this.width),
                y: randomNumber(0, this.height),
                w: randomNumber(1, 500),
                h: randomNumber(1, 500)
            }
            this.platforms.push(plat)
        }
    }
}

export default World