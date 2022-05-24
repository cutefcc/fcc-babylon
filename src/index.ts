import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

const createEngine = async () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
  const engine = new BABYLON.WebGPUEngine(canvas);
  await engine.initAsync();
  return engine;
};
class GameScene extends BABYLON.Scene {
  constructor(engine: BABYLON.Engine) {
    super(engine);
    this.createCamera();
    this.createLight();
    this.loadModel();
  }
  createCamera() {
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      (Math.PI / 2) * 0.5,
      Math.PI / 4,
      16,
      BABYLON.Vector3.Zero(),
      this
    );
    camera.attachControl(this.getEngine().getRenderingCanvas());
  }

  createLight() {
    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      this
    );
    light.intensity = 0.7;
  }

  async loadModel() {
    await BABYLON.SceneLoader.AppendAsync(
      "http://localhost:8080/modules/",
      // "VCAN-60-50-02-1.stl",
      "MobilePhoneBracket-76.2.stl",
      // "1_3.glb",
      this
    );
  }
}

createEngine().then((engine) => {
  const scene = new GameScene(engine);
  engine.runRenderLoop(() => {
    scene.render();
  });
});
