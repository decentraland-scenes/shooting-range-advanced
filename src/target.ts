import utils from "../node_modules/decentraland-ecs-utils/index"

export class Target extends Entity {
  constructor(model: GLTFShape, transform: Transform, rotation?: Quaternion ) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)

    // Move the targets back and forth between start and end positions
    if(rotation) this.addComponent(new utils.KeepRotatingComponent(rotation))
  }
}
