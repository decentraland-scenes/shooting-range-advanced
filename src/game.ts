import { BulletMark } from "./bullet"
import { Sound } from "./sound"
import * as utils from "@dcl/ecs-scene-utils"

// Base scene
const base = new Entity()
base.addComponent(new GLTFShape("models/baseLight.glb"))
engine.addEntity(base)

// Shooting area
const redMaterial = new Material()
redMaterial.albedoColor = Color3.Red()

const shootingArea = new Entity()
shootingArea.addComponent(new BoxShape())
shootingArea.addComponent(
  new Transform({
    position: new Vector3(8, 0.075, 2),
    scale: new Vector3(16, 0.05, 4),
  })
)
shootingArea.addComponent(redMaterial)
engine.addEntity(shootingArea)

// Create trigger for shooting area
let triggerBox = new utils.TriggerBoxShape(new Vector3(16, 16, 4), Vector3.Zero())

shootingArea.addComponent(
  new utils.TriggerComponent(triggerBox, {
    onCameraEnter: () => {
      isPlayerInShootingArea = true
      shootingArea.getComponent(Material).emissiveColor = Color3.Yellow()
    },
    onCameraExit: () => {
      isPlayerInShootingArea = false
      shootingArea.getComponent(Material).emissiveColor = Color3.Black()
    },
  })
)

// Sounds
const shotSound = new Sound(new AudioClip("sounds/shotSilencer.mp3"))
const shotRicochetSound = new Sound(new AudioClip("sounds/shotRicochet.mp3"))
const shotFailSound = new Sound(new AudioClip("sounds/shotFail.mp3"))

// Cache bullet mark on load otherwise the first bullet mark won't appear instantly when fired
const bulletMarkShape = new GLTFShape("models/bulletMark.glb")
const bulletMarkCache = new BulletMark(bulletMarkShape)
bulletMarkCache.getComponent(Transform).scale.setAll(0)

// Controls
const input = Input.instance
const DELETE_TIME = 8 // In seconds
let isPlayerInShootingArea = false

input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (event) => {
  if (event.hit) {
    if (isPlayerInShootingArea) {
      shotSound.getComponent(AudioSource).playOnce()
      if (engine.entities[event.hit.entityId] != undefined) {
        let entity = engine.entities[event.hit.entityId]
        shotRicochetSound.getComponent(AudioSource).playOnce()
        // Calculate the position of where the bullet hits relative to the target
        entity.hasComponent(utils.KeepRotatingComponent) ? hitDynamicTarget(entity, event) : hitStaticTarget(event)
      }
    } else {
      shotFailSound.getComponent(AudioSource).playOnce()
    }
  }
})

function hitStaticTarget(event: LocalActionButtonEvent) {
  // Calculating for static targets
  const bulletMark = new BulletMark(bulletMarkShape, DELETE_TIME)
  if (event.hit) {
    bulletMark.getComponent(Transform).lookAt(event.hit.normal)
    bulletMark.getComponent(Transform).position = event.hit.hitPoint
  }
}

function hitDynamicTarget(entity: IEntity, event: LocalActionButtonEvent) {
  const bulletMark = new BulletMark(bulletMarkShape, DELETE_TIME)
  bulletMark.setParent(entity) // Make the bullet mark the child of the target so that it remains on the target

  if (event.hit) {
    // NOTE: If you have multiple parent entities then you'll need to subtract for each successive parent transform
    let targetParentPosition = entity.getParent()!.getComponent(Transform).position
    let targetPosition = entity.getComponent(Transform).position
    let relativePosition = event.hit.hitPoint.subtract(targetParentPosition).subtract(targetPosition)
    relativePosition.rotate(entity.getComponent(Transform).rotation.conjugate()) // Inversing the parent's rotation
    bulletMark.getComponent(Transform).position = relativePosition
  }
}
