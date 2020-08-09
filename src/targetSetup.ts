import { Target } from "./target"

// Dyanimic targets
const redStand = new Entity()
redStand.addComponent(new GLTFShape("models/redStand.glb"))
redStand.addComponent(
  new Transform({
    position: new Vector3(4, 0, 13),
  })
)
engine.addEntity(redStand)

const redTargets = new Target(
  new GLTFShape("models/redTargets.glb"),
  new Transform({ position: new Vector3(0, 1.875, 0) }),
  Quaternion.Euler(15, 0, 0)
)
redTargets.setParent(redStand)

const greenStand = new Entity()
greenStand.addComponent(new GLTFShape("models/greenStand.glb"))
greenStand.addComponent(
  new Transform({
    position: new Vector3(8, 0, 13),
  })
)
engine.addEntity(greenStand)

const greenTargets = new Target(
  new GLTFShape("models/greenTargets.glb"),
  new Transform({ position: new Vector3(0, 2.625, 0) }),
  Quaternion.Euler(0, 15, 0)
)
greenTargets.setParent(greenStand)

const blueStand = new Entity()
blueStand.addComponent(new GLTFShape("models/blueStand.glb"))
blueStand.addComponent(new Transform({ position: new Vector3(12, 0, 13) }))
engine.addEntity(blueStand)

const blueTargets = new Target(
  new GLTFShape("models/blueTargets.glb"),
  new Transform({ position: new Vector3(0, 2.25, -0.925) }),
  Quaternion.Euler(0, 0, 15)
)
blueTargets.setParent(blueStand)

// Static targets
new Target(new GLTFShape("models/staticTargets.glb"), new Transform())