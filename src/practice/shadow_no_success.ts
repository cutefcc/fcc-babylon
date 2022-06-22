import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import gsap from "gsap";
import * as earcut from "earcut";
import { BabylonFileLoaderConfiguration } from "@babylonjs/core";
(window as any).earcut = earcut;

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
  constructor(engine: BABYLON.Engine) {
    super(engine);
    this.createCamera();
    this.createLight();
    this.initCannon();
    this.createGround();
    this.createBox();
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

  initCannon() {
    const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin();
    // 用物理引擎做一个 碰撞：涉及到碰撞系数，碰撞类型，碰撞模型
    this.enablePhysics(gravityVector, physicsPlugin);
  }

  createLight() {
    // 环境光，没有阴影
    const light = new BABYLON.HemisphericLight(
      "light",
      // 从+y打下来的光
      new BABYLON.Vector3(0, 7, 0),
      this
    );
    light.intensity = 0.5;
    // 平行光，让有阴影效果，或者pbr材质显示其效果
    // const light2 = new BABYLON.DirectionalLight(
    //   "light2",
    //   new BABYLON.Vector3(3, 3, 0),
    //   this
    // );
    // light2.intensity = 3;
    // light2.diffuse = new BABYLON.Color3(211 / 255, 111 / 255, 111 / 255);
    // light2.position = new BABYLON.Vector3(5, 5, 0);
    // 平行光才能 照射出投影
    // this.#shadowGenerator = new BABYLON.CascadedShadowGenerator(512, light2);
    var light2 = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(-1, -2, 1),
      this
    );

    light2.intensity = 3;
    light2.autoCalcShadowZBounds = true;
    this.#shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
    this.#shadowGenerator.usePoissonSampling = true;
    this.#shadowGenerator.useExponentialShadowMap = true;
  
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
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9 }
    );
    // 让ground能接受 shadow
    ground.receiveShadows = true;
  }
  createBox() {
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, this);
    box.position.y = 3;
    box.physicsImpostor = new BABYLON.PhysicsImpostor(
      box,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 0.9 }
    );

    const material = new BABYLON.StandardMaterial("material", this);
    const url = "http://localhost:8080/pbr/assets/crate.ktx2";
    material.diffuseTexture = new BABYLON.Texture(url);
    // console.log("---", this.#shadowGenerator.getShadowMap().renderList.push);
    // this.#shadowGenerator.getShadowMap().renderList.push(box);
    box.material = material;
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
