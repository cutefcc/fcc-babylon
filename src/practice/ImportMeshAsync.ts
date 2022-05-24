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
    await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "http://localhost:8080/",
      "house.glb"
    ).then((result) => {
      // 0 是整体， 1 2 是对应房子的下部 和 房顶
      console.log("1", result);
      // result.meshes[1].position.x = 2;
      // result.meshes[1].position.y = 2;
      result.meshes[0].position.x = 1;
      // result.meshes[0].position.y = 2;
      // result.meshes[2].position.x = 1;
      // const myMesh1 = scene.getMeshByName("myMesh_1");
      // myMesh1.rotation.y = Math.PI / 2;
    });
    await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "http://localhost:8080/",
      "first.glb"
    ).then((result) => {
      console.log("2", result);
      result.meshes[0].position.x = -4.5;
      result.meshes[0].position.y = 0.5;
      result.meshes[0].position.z = 4.5;
      // const myMesh1 = scene.getMeshByName("myMesh_1");
      // myMesh1.rotation.y = Math.PI / 2;
    });
  }
}

createEngine().then((engine) => {
  // create scene
  const scene = new GameScene(engine);
  // create ground
  var ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
    scene
  );
  let groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
  ground.material = groundMaterial;
  // create a box
  const box1 = BABYLON.MeshBuilder.CreateBox("box", {});
  box1.position.z = -4.5;
  box1.position.x = -4.5;
  box1.position.y = 0.5;
  const box2 = BABYLON.MeshBuilder.CreateBox("box", {});
  box2.position.z = -4.5;
  box2.position.x = 4.5;
  box2.position.y = 0.5;
  const box3 = BABYLON.MeshBuilder.CreateBox("box", {});
  box3.position.z = 4.5;
  box3.position.x = 4.5;
  box3.position.y = 0.5;
  engine.runRenderLoop(() => {
    scene.render();
  });
});
