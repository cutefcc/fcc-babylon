import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import gsap from "gsap";
import * as earcut from "earcut";
import { BabylonFileLoaderConfiguration } from "@babylonjs/core";
(window as any).earcut = earcut;
let shadowGenerator;
const createEngine = async () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
  const engine = new BABYLON.WebGPUEngine(canvas, {
    // 自动适配dpr
    adaptToDeviceRatio: true,
    // "low-power" | "high-performance";   在webGPU 和webGL里面都有的，都是对原生的封装
    // 低功耗模式 和 高性能模式
    powerPreference: "high-performance",
  });
  await engine.initAsync();
  return engine;
};
let switched = false; //on off flag
class GameScene extends BABYLON.Scene {
  #shadowGenerator!: BABYLON.ShadowGenerator;
  #shadowGenerator2!: BABYLON.ShadowGenerator;
  constructor(engine: BABYLON.Engine) {
    super(engine);
    this.createCamera();
    this.createLight();
    // this.initCannon();
    this.createGround();
    this.createBox();
  }
  createCamera() {
    // const camera = new BABYLON.ArcRotateCamera(
    //   "camera",
    //   (Math.PI / 2) * 0.5,
    //   Math.PI / 4,
    //   16,
    //   BABYLON.Vector3.Zero(),
    //   this
    // );
    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      0,
      0.8,
      90,
      BABYLON.Vector3.Zero(),
      this
    );
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.9;
    camera.lowerRadiusLimit = 30;
    camera.upperRadiusLimit = 150;
    // camera.attachControl(canvas, true);
    camera.attachControl(this.getEngine().getRenderingCanvas(), true);
  }

  initCannon() {
    const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin();
    // 用物理引擎做一个 碰撞：涉及到碰撞系数，碰撞类型，碰撞模型
    this.enablePhysics(gravityVector, physicsPlugin);
  }

  createLight() {
    // light1
    var light = new BABYLON.DirectionalLight(
      "dir01",
      new BABYLON.Vector3(-1, -2, -1),
      this
    );
    light.position = new BABYLON.Vector3(20, 40, 20);
    light.intensity = 0.5;

    var lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 2, this);
    lightSphere.position = light.position;
    lightSphere.material = new BABYLON.StandardMaterial("light", this);
    lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

    // light2
    var light2 = new BABYLON.SpotLight(
      "spot02",
      new BABYLON.Vector3(30, 40, 20),
      new BABYLON.Vector3(-1, -2, -1),
      1.1,
      16,
      this
    );
    light2.intensity = 0.5;

    var lightSphere2 = BABYLON.Mesh.CreateSphere("sphere", 10, 2, this);
    lightSphere2.position = light2.position;
    lightSphere2.material = new BABYLON.StandardMaterial("light", this);
    lightSphere2.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

    // Shadows
    shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    // this.#shadowGenerator.addShadowCaster(torus);
    shadowGenerator.useExponentialShadowMap = true;

    // this.#shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light2);
    // // this.#shadowGenerator2.addShadowCaster(torus);
    // this.#shadowGenerator2.usePoissonSampling = true;
  }

  createGround() {
    var ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this
    );

    const pbr = new BABYLON.PBRMaterial("prb", this);

    pbr.albedoTexture = new BABYLON.Texture(
      "http://localhost:8080/pbr/assets/texture/TexturesCom_Metal_TreadplateBare_1K_albedo.jpg"
    );
    pbr.ambientTexture = new BABYLON.Texture(
      "http://localhost:8080/pbr/assets/texture/TexturesCom_Metal_TreadplateBare_1K_ao.jpg"
    );
    pbr.metallicTexture = new BABYLON.Texture(
      "http://localhost:8080/pbr/assets/texture/TexturesCom_Metal_TreadplateBare_1K_metallic.jpg"
    );
    pbr.bumpTexture = new BABYLON.Texture(
      "http://localhost:8080/pbr/assets/texture/TexturesCom_Metal_TreadplateBare_1K_normal.jpg"
    );
    pbr.microSurfaceTexture = new BABYLON.Texture(
      "http://localhost:8080/pbr/assets/texture/TexturesCom_Metal_TreadplateBare_1K_roughness.jpg"
    );
    pbr.useParallax = true; // 是否使用视差效果  视差贴
    pbr.useParallaxOcclusion = true; // 是否使用视差遮盖

    ground.material = pbr;
    // 让ground能接受 shadow
    ground.receiveShadows = true;
  }
  createBox() {
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, this);
    box.position.y = 3;
    // shadowGenerator.getShadowMap().renderList.push(box);
    shadowGenerator.addShadowCaster(box);
    // this.#shadowGenerator2.addShadowCaster(box);
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
