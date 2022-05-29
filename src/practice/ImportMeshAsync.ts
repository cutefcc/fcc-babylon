import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import gsap from "gsap";
import * as earcut from "earcut";
(window as any).earcut = earcut;

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
      const semi_house = <BABYLON.Mesh[]>(
        this.getTransformNodeById("semi_house")!.getChildren()
      );
      console.log("semi_house", semi_house);
      result.meshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
      gsap.to(result.meshes[0].rotation, {
        y: Math.PI * 2,
        duration: 2,
        repeat: -1,
        ease: "linear",
      });
      console.log("1", result);
      // result.meshes[1].position.x = 2;
      // result.meshes[1].position.y = 2;
      result.meshes[0].position.x = 1;
      // 旋转 绕 y
      result.meshes[1].rotation.y = Math.PI / 2;
      result.meshes[2].rotation.y = Math.PI / 2;
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
      result.meshes[0].position.x = -9.5;
      result.meshes[0].position.y = 0.5;
      result.meshes[0].position.z = 9.5;
      // const myMesh1 = scene.getMeshByName("myMesh_1");
      // myMesh1.rotation.y = Math.PI / 2;
    });
    // await BABYLON.SceneLoader.ImportMeshAsync(
    //   "",
    //   "http://localhost:8080/",
    //   "animal.glb"
    // ).then((result) => {
    //   console.log("2", result);
    //   result.meshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    //   result.meshes[0].position.x = -6.5;
    //   result.meshes[0].position.z = 6.5;
    //   result.meshes[1].rotation.y = Math.PI;
    //   result.meshes[2].rotation.y = Math.PI;
    //   result.meshes[3].rotation.y = Math.PI;
    //   result.meshes[4].rotation.y = Math.PI;
    //   result.meshes[5].rotation.y = Math.PI;
    //   result.meshes[6].rotation.y = Math.PI;
    //   // result.meshes[0].position.x = -9.5;
    //   // result.meshes[0].position.y = 0.5;
    //   // result.meshes[0].position.z = 9.5;
    //   // const myMesh1 = scene.getMeshByName("myMesh_1");
    //   // myMesh1.rotation.y = Math.PI / 2;
    // });
  }
}

createEngine().then((engine) => {
  // create scene
  const scene = new GameScene(engine);
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
  // add sound
  // const sound = new BABYLON.Sound(
  //   "bird",
  //   "http://localhost:8080/music/635105__inchadney__field-recording.wav",
  //   scene,
  //   null,
  //   { loop: true, autoplay: true }
  // );
  // create 3 box
  const box1 = BABYLON.MeshBuilder.CreateBox("box", {});
  box1.position.z = -9.5;
  box1.position.x = -9.5;
  box1.position.y = 0.5;
  const box2 = BABYLON.MeshBuilder.CreateBox("box", {});
  box2.position.z = -9.5;
  box2.position.x = 9.5;
  box2.position.y = 0.5;
  const box3 = BABYLON.MeshBuilder.CreateBox("box", {});
  box3.position.z = 9.5;
  box3.position.x = 9.5;
  box3.position.y = 0.5;

  const faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
  faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
  faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
  faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
  const liuhao_house = BABYLON.MeshBuilder.CreateBox("box", {
    faceUV: faceUV,
    wrap: true,
  });
  // control size & position
  liuhao_house.scaling = new BABYLON.Vector3(1.2, 1.5, 3);
  liuhao_house.position.y = 0.75;
  // 旋转
  // liuhao_house.rotation.y = Math.PI / 4;
  // liuhao_house.rotation.y = BABYLON.Tools.ToRadians(45);
  // 房顶
  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1.5,
    height: 3.5,
    // 几边
    tessellation: 3,
  });
  // roof.scaling.x = 0.75;
  roof.rotation.z = Math.PI / 2;
  roof.rotation.y = Math.PI / 2;
  roof.position.y = 1.8;

  const roofMat = new BABYLON.StandardMaterial("roofMat");
  roofMat.diffuseTexture = new BABYLON.Texture(
    "http://localhost:8080/images/2a36ce1934a5140c93b50ebdf43cfbe6.jpeg",
    scene
  );
  const boxMat = new BABYLON.StandardMaterial("boxMat");
  boxMat.diffuseTexture = new BABYLON.Texture(
    // "https://www.babylonjs-playground.com/textures/floor.png"
    "http://localhost:8080/images/cubehouse.png"
  );

  roof.material = roofMat;
  liuhao_house.material = boxMat;

  const house = BABYLON.Mesh.MergeMeshes(
    [liuhao_house, roof],
    true,
    false,
    null,
    false,
    true
  );

  // clone
  const houses = [];
  const places = []; //each entry is an array [house type, rotation, x, z]
  places.push([1, -Math.PI / 16, -6.8, 2.5]);
  places.push([2, -Math.PI / 16, -4.5, 3]);
  // places.push([2, -Math.PI / 16, -1.5, 4]);
  places.push([2, -Math.PI / 3, 1.5, 6]);
  // places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
  places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
  // places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
  // places.push([1, (5 * Math.PI) / 4, 0, -1]);
  // places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
  places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
  places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
  // places.push([2, Math.PI / 1.9, 4.75, -1]);
  places.push([1, Math.PI / 1.95, 4.5, -3]);
  // places.push([2, Math.PI / 1.9, 4.75, -5]);
  places.push([1, Math.PI / 1.9, 4.75, -7]);
  // places.push([2, -Math.PI / 3, 5.25, 2]);
  places.push([1, -Math.PI / 3, 6, 4]);
  for (let i = 0; i < places.length; i++) {
    houses[i] = house.createInstance("liuhao_house" + i);
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
  }

  // create car
  const car = buildCar(scene);
  car.position.x = -3;
  car.position.z = 6;
  car.position.y = 0.125;
  car.rotation.x = -Math.PI / 2;
  car.rotation.y = Math.PI / 4;

  const animCar = new BABYLON.Animation(
    "carAnimation",
    "position.z",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const carKeys = [];

  carKeys.push({
    frame: 0,
    value: 8,
  });

  carKeys.push({
    frame: 150,
    value: -7,
  });

  carKeys.push({
    frame: 200,
    value: -7,
  });

  animCar.setKeys(carKeys);

  car.animations = [];
  car.animations.push(animCar);

  scene.beginAnimation(car, 0, 200, true);
  engine.runRenderLoop(() => {
    scene.render();
  });
});

const buildCar = (scene) => {
  //base
  const outline = [
    new BABYLON.Vector3(-0.3, 0, -0.1),
    new BABYLON.Vector3(0.2, 0, -0.1),
  ];

  //curved front
  for (let i = 0; i < 20; i++) {
    outline.push(
      new BABYLON.Vector3(
        0.2 * Math.cos((i * Math.PI) / 40),
        0,
        0.2 * Math.sin((i * Math.PI) / 40) - 0.1
      )
    );
  }

  //top
  outline.push(new BABYLON.Vector3(0, 0, 0.1));
  outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

  //back formed automatically

  //car face UVs
  const faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
  faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
  faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

  //car material
  const carMat = new BABYLON.StandardMaterial("carMat");
  carMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/car.png"
  );

  const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {
    shape: outline,
    depth: 0.2,
    faceUV: faceUV,
    wrap: true,
  });
  car.material = carMat;

  //wheel face UVs
  const wheelUV = [];
  wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
  wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
  wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

  //car material
  const wheelMat = new BABYLON.StandardMaterial("wheelMat");
  wheelMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/wheel.png"
  );

  const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {
    diameter: 0.125,
    height: 0.05,
    faceUV: wheelUV,
  });
  wheelRB.material = wheelMat;
  wheelRB.parent = car;
  wheelRB.position.z = -0.1;
  wheelRB.position.x = -0.2;
  wheelRB.position.y = 0.035;

  const wheelRF = wheelRB.clone("wheelRF");
  wheelRF.position.x = 0.1;

  const wheelLB = wheelRB.clone("wheelLB");
  wheelLB.position.y = -0.2 - 0.035;

  const wheelLF = wheelRF.clone("wheelLF");
  wheelLF.position.y = -0.2 - 0.035;

  return car;
};
