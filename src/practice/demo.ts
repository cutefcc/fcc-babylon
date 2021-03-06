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
let switched = false; //on off flag
class GameScene extends BABYLON.Scene {
  constructor(engine: BABYLON.Engine) {
    super(engine);
    this.createCamera();
    this.createLight();
    this.#createSkyBox();
    this.createFountain();
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
      // const semi_house = <BABYLON.Mesh[]>(
      //   this.getTransformNodeById("semi_house")!.getChildren()
      // );
      // console.log("semi_house", semi_house);
      result.meshes[0].rotation = new BABYLON.Vector3(0, 0, 0);
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
    //   "cutefcc-2021.stl"
    // ).then((result) => {});
  }
  #createSkyBox() {
    const skyBox = BABYLON.MeshBuilder.CreateBox(
      "skyBox",
      { size: 150.0, sideOrientation: BABYLON.Mesh.BACKSIDE },
      this
    );
    // const meterial = new BABYLON.StandardMaterial("skyBox", this);
    const meterial = new BABYLON.BackgroundMaterial("skyBox", this);
    meterial.reflectionTexture = new BABYLON.CubeTexture(
      "http://localhost:8080/images/skybox_img1/skybox",
      this,
      ["_px", "_py", "_pz", "_nx", "_ny", "_nz"].map((i) => `${i}.jpeg`)
    );

    meterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyBox.material = meterial;
  }
  // 喷泉⛲️
  createFountain() {
    const fountainOutline = [
      new BABYLON.Vector3(0, 0, 0),
      new BABYLON.Vector3(0.5, 0, 0),
      new BABYLON.Vector3(0.5, 0.2, 0),
      new BABYLON.Vector3(0.4, 0.2, 0),
      new BABYLON.Vector3(0.4, 0.05, 0),
      new BABYLON.Vector3(0.05, 0.1, 0),
      new BABYLON.Vector3(0.05, 0.8, 0),
      new BABYLON.Vector3(0.15, 0.9, 0),
    ];

    //Create lathed fountain
    const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {
      shape: fountainOutline,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    });
    fountain.position.x = -4;
    fountain.position.z = -6;

    const particleSystem = new BABYLON.ParticleSystem("particles", 4000, this);
    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture(
      "http://localhost:8080/images/flare.png",
      this
    );

    // Where the particles come from
    particleSystem.emitter = new BABYLON.Vector3(-4, 0.5, -6); // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.02, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.02, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.05;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 3.5;

    // Emission rate
    particleSystem.emitRate = 1500;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
    particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.025;

    // Start the particle system
    // particleSystem.start();

    // 喷泉
    const pointerDown = (mesh) => {
      if (mesh === fountain) {
        //check that the picked mesh is the fountain
        switched = !switched; //toggle switch
        if (switched) {
          particleSystem.start();
        } else {
          particleSystem.stop();
        }
      }
    };
    this.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          if (pointerInfo.pickInfo.hit) {
            pointerDown(pointerInfo.pickInfo.pickedMesh);
          }
          break;
      }
    });
  }
}

createEngine().then((engine) => {
  // create scene
  const scene = new GameScene(engine);
  scene.debugLayer.show({
    embedMode: true,
  });
  // create ground
  // var ground = BABYLON.MeshBuilder.CreateGround(
  //   "ground",
  //   { width: 20, height: 20 },
  //   scene
  // );
  // give ground color
  // let groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene);

  // const groundMat = new BABYLON.StandardMaterial("groundMat");
  // groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
  // ground.material = groundMat; //Place the material property of the ground

  // ground.material = groundMaterial;

  //Create large ground for valley environment
  /********************* */
  // const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
  // largeGroundMat.diffuseTexture = new BABYLON.Texture(
  //   "https://assets.babylonjs.com/environments/valleygrass.png"
  // );

  // const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
  //   "largeGround",
  //   "https://assets.babylonjs.com/environments/villageheightmap.png",
  //   { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 }
  // );
  // largeGround.material = largeGroundMat;
  /*************** */
  //Create Village ground
  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/villagegreen.png"
  );
  groundMat.diffuseTexture.hasAlpha = true;

  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 24,
    height: 24,
  });
  ground.material = groundMat;

  //large ground
  const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
  largeGroundMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/valleygrass.png"
  );

  const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "largeGround",
    "https://assets.babylonjs.com/environments/villageheightmap.png",
    { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 }
  );
  largeGround.material = largeGroundMat;
  largeGround.position.y = -0.01;

  // tree
  const spriteManagerTrees = new BABYLON.SpriteManager(
    "treesManager",
    "http://localhost:8080/palmtree.webp",
    2000,
    { width: 512, height: 1024 },
    scene
  );
  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * -30;
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
  }

  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * 25 + 7;
    tree.position.z = Math.random() * -35 + 8;
    tree.position.y = 0.5;
  }
  // tree

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
  // 喷泉
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
