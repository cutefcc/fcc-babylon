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
      -Math.PI / 2,
      Math.PI / 2.5,
      3,
      new BABYLON.Vector3(0, 0, 0),
      this
    );
    camera.attachControl(this.getEngine().getRenderingCanvas(), true);
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
    await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "http://localhost:8080/",
      "donut.glb"
    );

    // await BABYLON.SceneLoader.AppendAsync(
    //   "http://localhost:8080/",
    //   // "VCAN-60-50-02-1.stl",
    //   "donut.glb",
    //   // "1_3.glb",
    //   this
    // );
  }
}

createEngine().then((engine) => {
  const scene = new GameScene(engine);
  // const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
  engine.runRenderLoop(() => {
    scene.render();
  });
});
// const scene = new BABYLON.Scene(engine);

// const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene);
// camera.attachControl(canvas, true);

// const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
