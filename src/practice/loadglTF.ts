import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import gsap from "gsap";
import * as earcut from "earcut";
import { BabylonFileLoaderConfiguration } from "@babylonjs/core";
(window as any).earcut = earcut;

const createEngine = async () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
  const engine = new BABYLON.WebGPUEngine(canvas);
  await engine.initAsync();
  return engine;
};
let switched = false; //on off flag
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
      "http://localhost:8080/robot_steampunk_3d-coat_4.5_pbr/",
      "scene.gltf"
    ).then((result) => {
      // 缩放
      result.meshes[0].scaling = new BABYLON.Vector3(0.02, 0.02, 0.02);
      // 移动
      result.meshes[0].position.x = 5;
      result.meshes[0].position.y = 5;
      result.meshes[0].position.z = 5;
      // 旋转 这样是不生效的
      //   result.meshes[0].rotation.y = Math.PI / 2;
      const sketchfab_model =
        this.getTransformNodeById("Sketchfab_model")!.getChildren();
      console.log("sketchfab_model", sketchfab_model);
      //   gsap.to(result.meshes[0].rotation, {
      // 这样可以
      //   gsap.to(result.meshes[0].position, {
      //     z: 5,
      //     duration: 4,
      //   });

      // not working
      //   gsap.to(result.meshes[0].rotation, {
      //     y: Math.PI,
      //     duration: 2,
      //     repeat: -1,
      //     ease: "linear",
      //   });
      // not working
      //   gsap.to(sketchfab_model?.rotation, {
      //     y: Math.PI,
      //     duration: 2,
      //     repeat: -1,
      //     ease: "linear",
      //   });

      // working
      result.meshes.forEach((item, index) => {
        // 这个index === 0 注释后旋转很奇怪
        if (index === 0) {
          return;
        }
        item.rotation = new BABYLON.Vector3(0, 0, 0);
        gsap.to(item.rotation, {
          z: Math.PI * 2,
          duration: 5,
          repeat: -1,
          ease: "linear",
        });
      });
    });
  }
}

createEngine().then((engine) => {
  // create scene
  const scene = new GameScene(engine);
  scene.debugLayer.show({
    embedMode: true,
  });
  engine.runRenderLoop(() => {
    scene.render();
  });
});
