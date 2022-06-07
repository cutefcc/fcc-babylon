import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";

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
    this.createGround();
    this.createBox();
  }
  createCamera() {
    // arcRotateCamera
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      (Math.PI / 2) * 0.5,
      Math.PI / 4,
      16,
      BABYLON.Vector3.Zero(),
      this
    );
    // universalCamera
    // const camera = new BABYLON.UniversalCamera(
    //   "UniversalCamera",
    //   new BABYLON.Vector3(0, 0, -10),
    //   this
    // );

    // camera.setTarget(BABYLON.Vector3.Zero());

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

  createGround() {
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this
    );
  }
  createBox() {
    const box1 = BABYLON.MeshBuilder.CreateBox("box", {
      width: 1,
      height: 5,
      depth: 10,
    });
    box1.position.x = 5;
    box1.position.y = 2.5;
  }
}

createEngine().then((engine) => {
  const scene = new GameScene(engine);
  scene.debugLayer.show({
    embedMode: true,
  });
  engine.runRenderLoop(() => {
    scene.render();
  });
});
