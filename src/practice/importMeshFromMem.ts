import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import gsap from "gsap";
import * as earcut from "earcut";
(window as any).earcut = earcut;
// q去掉babylon自带的loading动画效果
BABYLON.SceneLoader.ShowLoadingScreen = false;

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
    // await BABYLON.SceneLoader.ImportMeshAsync(
    //   "",
    //   "http://localhost:8080/",
    //   "1_3.glb"
    // ).then((result) => {});
    // 从内存中读取模型
    const assetArrayBuffer = await BABYLON.Tools.LoadFileAsync(
      "http://localhost:8080/1_3.glb",
      true
    );
    const blob = new Blob([assetArrayBuffer], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);

    document.querySelector("button")?.addEventListener("click", async () => {
      console.log("url", url);
      //   BABYLON.SceneLoader.ImportMeshAsync("", url, "", this);
      await BABYLON.SceneLoader.AppendAsync(
        url,
        undefined,
        this,
        undefined,
        ".glb"
      );
      const main_scene = this.getTransformNodeById("main_scene")!;
      gsap.fromTo(
        main_scene?.position,
        { y: 10 },
        { y: 0, duration: 2, x: 0, z: 0 }
      );
    });
  }
}

createEngine().then((engine) => {
  // create scene
  const scene = new GameScene(engine);
  // 开始调试模式
  scene.debugLayer.show({
    embedMode: true,
  });
  // create ground
  var ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 20, height: 20 },
    scene
  );
  // give ground color
  // let groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);
  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
  ground.material = groundMat; //Place the material property of the ground
  // ground.material = groundMaterial;

  const box1 = BABYLON.MeshBuilder.CreateBox("box", {});
  box1.position.z = 0;
  box1.position.x = 5;
  box1.position.y = 0.5;
  gsap.to(box1.rotation, {
    y: Math.PI * 2,
    duration: 2,
    repeat: -1,
    ease: "linear",
  });

  engine.runRenderLoop(() => {
    scene.render();
  });
});
