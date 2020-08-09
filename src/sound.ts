export class Sound extends Entity {
  constructor(clip: AudioClip) {
    super()
    engine.addEntity(this)
    this.addComponent(new Transform())
    this.getComponent(Transform).position = Camera.instance.position // Sets the audio to be wherever the player is standing
    this.addComponent(new AudioSource(clip))
  }
}