import * as BABYLON from "@babylonjs/core";
import gsap from "gsap";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
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

    const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    const physicsPlugin = new BABYLON.CannonJSPlugin();
    // 用物理引擎做一个 碰撞：涉及到碰撞系数，碰撞类型，碰撞模型
    this.enablePhysics(gravityVector, physicsPlugin);
    this.createGround();
    this.createBall();
    // this.loadModel();
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

  createGround() {
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this
    );
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9 }
    );
  }

  createBall() {
    const ball = BABYLON.MeshBuilder.CreateSphere("ball", {}, this);
    ball.position.y = 3;
    ball.physicsImpostor = new BABYLON.PhysicsImpostor(
      ball,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, restitution: 0.9 }
    );
  }

  // async loadModel() {
  //   await BABYLON.SceneLoader.AppendAsync(
  //     "http://localhost:8080/static/model/",
  //     "2_2.glb",
  //     this
  //   );
  //   const assetArraybuffer = await BABYLON.Tools.LoadFileAsync(
  //     "http://localhost:8080/static/model/floor_block.glb",
  //     true
  //   );
  //   const blob = new Blob([assetArraybuffer]);
  //   const url = URL.createObjectURL(blob);

  //   document
  //     .querySelector<HTMLButtonElement>("#load")
  //     ?.addEventListener("click", async () => {
  //       await BABYLON.SceneLoader.AppendAsync(
  //         url,
  //         undefined,
  //         this,
  //         undefined,
  //         ".glb"
  //       );
  //       const floor_block = this.getTransformNodeById("floor_block")!;
  //       gsap.fromTo(
  //         floor_block.position,
  //         { y: 10 },
  //         { y: 1, x: -1.5, z: -1.5, duration: 1 }
  //       );
  //     });

  //   const coinList = <BABYLON.Mesh[]>(
  //     this.getTransformNodeById("coin")!.getChildren()
  //   );
  //   console.log(coinList);
  //   coinList.forEach((coin) => {
  //     coin.rotation = new BABYLON.Vector3(0, 0, 0);
  //     gsap.to(coin.rotation, {
  //       y: Math.PI * 2,
  //       duration: 2,
  //       repeat: -1,
  //       ease: "linear",
  //     });
  //   });
  // }
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
