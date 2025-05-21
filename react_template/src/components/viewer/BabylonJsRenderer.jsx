import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ';
import '@babylonjs/loaders/STL';
// Import FBX loader with the correct path
import '@babylonjs/loaders';
import Loading from '../common/Loading';

const BabylonJsRenderer = forwardRef(({ assetId, renderMode = 'realtime' }, ref) => {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const animationGroupRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Babylon.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Setup engine
    const engine = new BABYLON.Engine(containerRef.current, true, { 
      preserveDrawingBuffer: true, 
      stencil: true 
    });
    engineRef.current = engine;
    
    // Setup scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
    sceneRef.current = scene;
    
    // Add ambient light
    const ambientLight = new BABYLON.HemisphericLight(
      'ambientLight', 
      new BABYLON.Vector3(0, 1, 0), 
      scene
    );
    ambientLight.intensity = 0.5;
    
    // Add directional light
    const dirLight = new BABYLON.DirectionalLight(
      'dirLight', 
      new BABYLON.Vector3(1, -2, -3), 
      scene
    );
    dirLight.intensity = 0.8;
    
    // Setup camera
    const camera = new BABYLON.ArcRotateCamera(
      'camera', 
      -Math.PI / 2, 
      Math.PI / 3, 
      10, 
      new BABYLON.Vector3(0, 0, 0), 
      scene
    );
    camera.attachControl(containerRef.current, true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 50;
    cameraRef.current = camera;
    
    // Handle window resize
    const handleResize = () => {
      if (!engineRef.current) return;
      engineRef.current.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start the render loop
    engine.runRenderLoop(() => {
      if (sceneRef.current) {
        sceneRef.current.render();
      }
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (engineRef.current) {
        engineRef.current.stopRenderLoop();
      }
      
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
      
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);

  // Helper function to load external model files
  const loadExternalModel = async (url) => {
    if (!sceneRef.current) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      // Clear previous model
      if (modelRef.current) {
        modelRef.current.dispose();
        modelRef.current = null;
      }
      
      if (animationGroupRef.current) {
        animationGroupRef.current.dispose();
        animationGroupRef.current = null;
      }
      
      // Extract file extension
      const fileExtension = url.split('.').pop().toLowerCase();
      console.log(`Loading external ${fileExtension.toUpperCase()} file: ${url}`);
      
      // Determine URL parts
      const rootUrl = url.substring(0, url.lastIndexOf('/') + 1);
      const filename = url.substring(url.lastIndexOf('/') + 1);
      
      let importResult;
      
      if (fileExtension === 'fbx') {
        // Special options for FBX
        const importOptions = {
          animationStartMode: 0, // NONE mode
          optimizeNormals: true,
          optimizeVertices: true
        };
        
        importResult = await BABYLON.SceneLoader.ImportMeshAsync(
          "", rootUrl, filename, sceneRef.current, null, '.fbx', null, importOptions
        );
      } else {
        importResult = await BABYLON.SceneLoader.ImportMeshAsync(
          "", rootUrl, filename, sceneRef.current
        );
      }
      
      if (importResult.meshes.length === 0) {
        throw new Error('Model loaded but contains no meshes');
      }
      
      return importResult;
    } catch (err) {
      console.error('Error loading external model:', err);
      setError(`Error loading 3D model: ${err.message}`);
      return null;
    }
  };
  
  // Load 3D model when assetId changes
  useEffect(() => {
    if (!assetId || !sceneRef.current || !cameraRef.current) return;
    
    const loadModel = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Clear previous model
        if (modelRef.current) {
          modelRef.current.dispose();
          modelRef.current = null;
        }
        
        if (animationGroupRef.current) {
          animationGroupRef.current.dispose();
          animationGroupRef.current = null;
        }

        // Check if this is a direct URL to a model file (like FBX)
        if (assetId.includes('.fbx') || assetId.includes('.glb') || assetId.includes('.gltf') || 
            assetId.includes('.obj') || assetId.includes('.stl')) {
          // This is a direct URL to a model file
          try {
            const result = await loadExternalModel(assetId);
            if (!result) {
              throw new Error('Failed to load model');
            }

            // Get the root mesh
            const rootMesh = result.meshes[0];
            modelRef.current = rootMesh;
            
            // Handle animations if available
            if (result.animationGroups && result.animationGroups.length > 0) {
              console.log(`Model has ${result.animationGroups.length} animation groups`);
              animationGroupRef.current = result.animationGroups[0];
            }
            
            // Auto adjust scale for the model
            const boundingInfo = rootMesh.getBoundingInfo();
            const size = boundingInfo.boundingBox.extendSize.scale(2);
            const maxDimension = Math.max(size.x, size.y, size.z);
            
            // Scale the model to a reasonable size
            const targetSize = 5.0;
            const scaleFactor = targetSize / maxDimension;
            rootMesh.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);
            
            // Position at center and ground level
            const boundingBox = boundingInfo.boundingBox;
            const offset = new BABYLON.Vector3(
              (boundingBox.maximumWorld.x + boundingBox.minimumWorld.x) / 2,
              boundingBox.minimumWorld.y,
              (boundingBox.maximumWorld.z + boundingBox.minimumWorld.z) / 2
            );
            
            rootMesh.position = new BABYLON.Vector3(-offset.x, -offset.y, -offset.z);
            
            // Reset camera position to view the model properly
            cameraRef.current.radius = targetSize * 2;
            cameraRef.current.alpha = -Math.PI / 2;
            cameraRef.current.beta = Math.PI / 3;
            cameraRef.current.setTarget(BABYLON.Vector3.Zero());
            
          } catch (err) {
            console.error(`Error loading model ${assetId}:`, err);
            setError(`Failed to load model: ${err.message}`);
            
            // Create a fallback shape
            const sphere = BABYLON.MeshBuilder.CreateSphere('errorSphere', { diameter: 2 }, sceneRef.current);
            const material = new BABYLON.StandardMaterial('errorMaterial', sceneRef.current);
            material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red for error
            sphere.material = material;
            modelRef.current = sphere;
          }
        }
        // Check if this is one of our predefined 3D models
        else if (
          assetId === 'vehicle-bmw-i8' || 
          assetId === 'vehicle-bmw-x7' || 
          assetId === 'vehicle-rusty-car' || 
          assetId === 'environment-nagoya' || 
          assetId === 'prop-pirates-ship'
        ) {
          // Determine the correct model path based on asset ID
          let modelPath;
          
          switch (assetId) {
            case 'vehicle-bmw-i8':
              modelPath = '/assets/models/bmw_i8_liberty_walk.glb';
              break;
            case 'vehicle-bmw-x7':
              modelPath = '/assets/models/bmw_x7_m60i.glb';
              break;
            case 'vehicle-rusty-car':
              modelPath = '/assets/models/old_rusty_car.glb';
              break;
            case 'environment-nagoya':
              modelPath = '/assets/models/nagoya_downtown.glb';
              break;
            case 'prop-pirates-ship':
              modelPath = '/assets/models/catroonic_pirates_ship.glb';
              break;
            // Allow custom asset URL when assetId is a URL path to a model file
            // This handles direct URLs to FBX and other model formats
            default:
              if (assetId.startsWith('http') || assetId.startsWith('/assets')) {
                modelPath = assetId;
              } else {
                modelPath = '/assets/models/bmw_i8_liberty_walk.glb';
              }
          }
          
          try {
            // Import the model using SceneLoader
            // Check file extension to apply special handling for FBX files
            const fileExtension = modelPath.split('.').pop().toLowerCase();
            let result;
            
            if (fileExtension === 'fbx') {
              console.log('Loading FBX file:', modelPath);
              
              // Special import options for FBX files
              const importOptions = {
                animationStartMode: 0, // NONE mode - We'll manually control animations
                optimizeNormals: true,
                optimizeVertices: true
              };
              
              result = await BABYLON.SceneLoader.ImportMeshAsync(
                "", 
                modelPath.substring(0, modelPath.lastIndexOf('/') + 1), 
                modelPath.substring(modelPath.lastIndexOf('/') + 1), 
                sceneRef.current,
                null,
                '.fbx',
                null,
                importOptions
              );
              console.log('FBX model loaded successfully with', result.meshes.length, 'meshes');
            } else {
              result = await BABYLON.SceneLoader.ImportMeshAsync(
                "", 
                modelPath.substring(0, modelPath.lastIndexOf('/') + 1), 
                modelPath.substring(modelPath.lastIndexOf('/') + 1), 
                sceneRef.current
              );
            }
            
            // Get the root mesh and store it as the model
            const rootMesh = result.meshes[0];
            modelRef.current = rootMesh;
            
            // Apply specific scaling and positioning based on model type
            switch (assetId) {
              case 'vehicle-bmw-i8':
                rootMesh.scaling = new BABYLON.Vector3(0.02, 0.02, 0.02);
                rootMesh.position.y = -0.5;
                break;
              case 'vehicle-bmw-x7':
                rootMesh.scaling = new BABYLON.Vector3(0.015, 0.015, 0.015);
                rootMesh.position.y = -0.5;
                break;
              case 'vehicle-rusty-car':
                rootMesh.scaling = new BABYLON.Vector3(2, 2, 2);
                rootMesh.position.y = 0;
                break;
              case 'environment-nagoya':
                rootMesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
                rootMesh.position.y = -0.5;
                break;
              case 'prop-pirates-ship':
                rootMesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
                rootMesh.position.y = 0;
                break;
              default:
                rootMesh.scaling = new BABYLON.Vector3(0.02, 0.02, 0.02);
                rootMesh.position.y = -0.5;
            }
            
            // Handle animations if available
            if (result.animationGroups && result.animationGroups.length > 0) {
              console.log(`Model has ${result.animationGroups.length} animation groups`);
              animationGroupRef.current = result.animationGroups[0];
              // Animations are paused by default, they'll be played via the playAnimation method
            }
            
            // Special handling for FBX animations
            // Use the fileExtension we already have from the model loading logic
            if (fileExtension === 'fbx' && result.skeletons && result.skeletons.length > 0) {
              const skeleton = result.skeletons[0];
              if (skeleton.animations && skeleton.animations.length > 0) {
                console.log(`FBX model has ${skeleton.animations.length} skeleton animations`);
                
                // Create animation group from skeleton animations if needed
                if (!animationGroupRef.current && skeleton.animations.length > 0) {
                  const animGroup = new BABYLON.AnimationGroup('fbxAnimation', sceneRef.current);
                  
                  // Add all animations from the skeleton to the animation group
                  skeleton.animations.forEach(animation => {
                    animGroup.addTargetedAnimation(animation, skeleton);
                  });
                  
                  animationGroupRef.current = animGroup;
                }
              }
            }
            
            // Clear existing lights for better model visualization
            sceneRef.current.lights.slice().forEach(light => {
              if (light) light.dispose();
            });
            
            // Add better lighting for all models
            const ambientLight = new BABYLON.HemisphericLight(
              'ambientLight', 
              new BABYLON.Vector3(0, 1, 0),
              sceneRef.current
            );
            ambientLight.intensity = 0.7;
            
            const spotLight1 = new BABYLON.SpotLight(
              'spotLight1',
              new BABYLON.Vector3(5, 10, 5),
              new BABYLON.Vector3(-0.3, -0.8, -0.3),
              Math.PI / 4,
              2,
              sceneRef.current
            );
            spotLight1.intensity = 1.0;
            
            const spotLight2 = new BABYLON.SpotLight(
              'spotLight2',
              new BABYLON.Vector3(-5, 8, -5),
              new BABYLON.Vector3(0.3, -0.6, 0.3),
              Math.PI / 4,
              2,
              sceneRef.current
            );
            spotLight2.intensity = 0.8;
            
            // Add a ground plane for environments
            if (assetId === 'environment-nagoya') {
              const ground = BABYLON.MeshBuilder.CreateGround(
                'ground', 
                { width: 100, height: 100 }, 
                sceneRef.current
              );
              const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', sceneRef.current);
              groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
              groundMaterial.roughness = 0.8;
              groundMaterial.metallic = 0.2;
              ground.material = groundMaterial;
              ground.position.y = -0.5;
              ground.receiveShadows = true;
              
              // Position camera higher for environment view
              cameraRef.current.radius = 20;
              cameraRef.current.beta = Math.PI / 4;
            } else {
              // Default camera position for vehicles and props
              cameraRef.current.radius = 5;
              cameraRef.current.beta = Math.PI / 3;
            }
            
            // Update target and camera position
            cameraRef.current.setTarget(BABYLON.Vector3.Zero());
            
          } catch (err) {
            console.error(`Error loading model ${modelPath}:`, err);
            
            // Create appropriate fallback based on asset type
            if (assetId.includes('vehicle')) {
              // Vehicle placeholder
              const model = new BABYLON.TransformNode('vehicleRoot', sceneRef.current);
              
              // Car body
              const bodyMesh = BABYLON.MeshBuilder.CreateBox(
                'carBody',
                { width: 2, height: 0.75, depth: 4 },
                sceneRef.current
              );
              const bodyMaterial = new BABYLON.StandardMaterial('bodyMaterial', sceneRef.current);
              bodyMaterial.diffuseColor = new BABYLON.Color3(0.12, 0.56, 1.0);
              bodyMesh.material = bodyMaterial;
              bodyMesh.position.y = 0.75;
              bodyMesh.parent = model;
              
              // Car top
              const topMesh = BABYLON.MeshBuilder.CreateBox(
                'carTop',
                { width: 1.8, height: 0.5, depth: 2 },
                sceneRef.current
              );
              const topMaterial = new BABYLON.StandardMaterial('topMaterial', sceneRef.current);
              topMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.4, 0.8);
              topMesh.material = topMaterial;
              topMesh.position.set(0, 1.25, -0.5);
              topMesh.parent = model;
              
              // Wheels
              const wheelPositions = [
                { x: -1, y: 0.4, z: -1.3 },
                { x: 1, y: 0.4, z: -1.3 },
                { x: -1, y: 0.4, z: 1.3 },
                { x: 1, y: 0.4, z: 1.3 }
              ];
              
              wheelPositions.forEach((pos, idx) => {
                const wheelMesh = BABYLON.MeshBuilder.CreateCylinder(
                  `wheel${idx}`,
                  { diameter: 0.8, height: 0.2 },
                  sceneRef.current
                );
                const wheelMaterial = new BABYLON.StandardMaterial(`wheelMat${idx}`, sceneRef.current);
                wheelMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                wheelMesh.material = wheelMaterial;
                wheelMesh.rotation.z = Math.PI / 2;
                wheelMesh.position.set(pos.x, pos.y, pos.z);
                wheelMesh.parent = model;
              });
              
              modelRef.current = model;
              
            } else if (assetId.includes('environment')) {
              // Environment placeholder
              const model = new BABYLON.TransformNode('environmentRoot', sceneRef.current);
              
              // Ground
              const ground = BABYLON.MeshBuilder.CreateGround(
                'ground', 
                { width: 20, height: 20 }, 
                sceneRef.current
              );
              const groundMaterial = new BABYLON.StandardMaterial('groundMat', sceneRef.current);
              groundMaterial.diffuseColor = new BABYLON.Color3(0.27, 0.27, 0.27);
              ground.material = groundMaterial;
              ground.parent = model;
              
              // Buildings
              for (let i = 0; i < 5; i++) {
                const height = Math.random() * 5 + 2;
                const building = BABYLON.MeshBuilder.CreateBox(
                  `building${i}`,
                  { width: 2, height, depth: 2 },
                  sceneRef.current
                );
                const buildingMaterial = new BABYLON.StandardMaterial(`buildingMat${i}`, sceneRef.current);
                buildingMaterial.diffuseColor = new BABYLON.Color3(0.53, 0.53, 0.53);
                building.material = buildingMaterial;
                building.position.set(
                  Math.random() * 16 - 8,
                  height / 2,
                  Math.random() * 16 - 8
                );
                building.parent = model;
              }
              
              modelRef.current = model;
              
            } else {
              // Default fallback
              const box = BABYLON.MeshBuilder.CreateBox(
                'defaultBox', 
                { size: 2 }, 
                sceneRef.current
              );
              const boxMaterial = new BABYLON.StandardMaterial('boxMaterial', sceneRef.current);
              boxMaterial.diffuseColor = new BABYLON.Color3(0.12, 0.56, 1.0);
              box.material = boxMaterial;
              
              modelRef.current = box;
            }
          }
          
        } else if (assetId.includes('environment')) {
          // Create a simple environment
          const model = new BABYLON.TransformNode('environmentNode', sceneRef.current);
          
          // Ground plane
          const ground = BABYLON.MeshBuilder.CreateGround(
            'ground', 
            { width: 10, height: 10 }, 
            sceneRef.current
          );
          const groundMaterial = new BABYLON.StandardMaterial('groundMat', sceneRef.current);
          groundMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
          ground.material = groundMaterial;
          ground.parent = model;
          
          // Add some buildings
          for (let i = 0; i < 10; i++) {
            const height = Math.random() * 5 + 1;
            const building = BABYLON.MeshBuilder.CreateBox(
              `building${i}`,
              { width: 1, height, depth: 1 },
              sceneRef.current
            );
            const buildingMaterial = new BABYLON.StandardMaterial(`buildingMat${i}`, sceneRef.current);
            buildingMaterial.diffuseColor = new BABYLON.Color3(0.53, 0.53, 0.88);
            building.material = buildingMaterial;
            building.position.set(
              Math.random() * 8 - 4,
              height / 2,
              Math.random() * 8 - 4
            );
            building.parent = model;
          }
          
          modelRef.current = model;
          
        } else if (assetId.includes('vehicle')) {
          // Create a simple car shape
          const model = new BABYLON.TransformNode('vehicleNode', sceneRef.current);
          
          // Car body
          const body = BABYLON.MeshBuilder.CreateBox(
            'carBody',
            { width: 2, height: 0.75, depth: 4 },
            sceneRef.current
          );
          const bodyMaterial = new BABYLON.StandardMaterial('bodyMaterial', sceneRef.current);
          bodyMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
          body.material = bodyMaterial;
          body.position.y = 0.75;
          body.parent = model;
          
          // Car top
          const top = BABYLON.MeshBuilder.CreateBox(
            'carTop',
            { width: 1.8, height: 0.5, depth: 2 },
            sceneRef.current
          );
          const topMaterial = new BABYLON.StandardMaterial('topMaterial', sceneRef.current);
          topMaterial.diffuseColor = new BABYLON.Color3(0.53, 0, 0);
          top.material = topMaterial;
          top.position.set(0, 1.25, -0.5);
          top.parent = model;
          
          // Wheels
          const wheelPositions = [
            { x: -1, y: 0.4, z: -1.3 },
            { x: 1, y: 0.4, z: -1.3 },
            { x: -1, y: 0.4, z: 1.3 },
            { x: 1, y: 0.4, z: 1.3 }
          ];
          
          wheelPositions.forEach((pos, idx) => {
            const wheel = BABYLON.MeshBuilder.CreateCylinder(
              `wheel${idx}`,
              { diameter: 0.8, height: 0.2 },
              sceneRef.current
            );
            const wheelMaterial = new BABYLON.StandardMaterial(`wheelMat${idx}`, sceneRef.current);
            wheelMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            wheel.material = wheelMaterial;
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.parent = model;
          });
          
          modelRef.current = model;
          
        } else {
          // Default object
          const sphere = BABYLON.MeshBuilder.CreateSphere(
            'defaultSphere', 
            { diameter: 4, segments: 32 }, 
            sceneRef.current
          );
          const sphereMaterial = new BABYLON.StandardMaterial('sphereMaterial', sceneRef.current);
          sphereMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.4, 1.0);
          sphereMaterial.roughness = 0.3;
          sphereMaterial.metallicTexture = new BABYLON.Texture('/textures/metal.jpg', sceneRef.current);
          sphere.material = sphereMaterial;
          
          modelRef.current = sphere;
        }
        
        // Reset camera position
        cameraRef.current.setTarget(BABYLON.Vector3.Zero());
        if (cameraRef.current instanceof BABYLON.ArcRotateCamera) {
          cameraRef.current.alpha = -Math.PI / 2;
          cameraRef.current.beta = Math.PI / 3;
          cameraRef.current.radius = 10;
        }
        
      } catch (err) {
        console.error('Error loading 3D model:', err);
        setError('Failed to load 3D model');
      } finally {
        setLoading(false);
      }
    };
    
    loadModel();
  }, [assetId]);
  
  // Apply render mode changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Different rendering settings based on mode
    if (renderMode === 'realtime') {
      sceneRef.current.postProcessesEnabled = false;
      sceneRef.current.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    } else if (renderMode === 'offline') {
      // Higher quality settings for 'offline' render mode
      // Enable SSAO for ambient occlusion
      const ssao = new BABYLON.SSAORenderingPipeline(
        'ssao', 
        sceneRef.current, 
        { ssaoRatio: 0.5, combineRatio: 1.0 }
      );
      ssao.fallOff = 0.0002;
      ssao.area = 0.0075;
      
      // Enable default pipeline for tone mapping and other effects
      const defaultPipeline = new BABYLON.DefaultRenderingPipeline(
        'defaultPipeline',
        true,
        sceneRef.current
      );
      defaultPipeline.imageProcessing.exposure = 1.2;
      defaultPipeline.imageProcessing.contrast = 1.1;
      defaultPipeline.imageProcessing.toneMappingEnabled = true;
      defaultPipeline.imageProcessing.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
      
      // Add a bit more ambient light for high-quality renders
      sceneRef.current.ambientColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    }
  }, [renderMode]);

  // Expose methods to parent components via ref
  useImperativeHandle(ref, () => ({
    // Get current camera position
    getCurrentCameraPosition: () => {
      if (!cameraRef.current) return { x: 0, y: 0, z: 0, rotation: { x: 0, y: 0, z: 0 } };
      
      const camera = cameraRef.current;
      return {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        rotation: {
          x: camera.rotation ? camera.rotation.x : 0,
          y: camera.rotation ? camera.rotation.y : 0,
          z: camera.rotation ? camera.rotation.z : 0
        }
      };
    },
    
    // Set camera position
    setCameraPosition: (preset) => {
      if (!cameraRef.current || !sceneRef.current) return;
      
      const camera = cameraRef.current;
      if (!(camera instanceof BABYLON.ArcRotateCamera)) return;
      
      // This could be expanded to handle named preset positions
      switch (preset) {
        case 'front':
          camera.alpha = -Math.PI / 2; // -90 degrees
          camera.beta = Math.PI / 3;   // 60 degrees
          camera.radius = 10;
          break;
        case 'top':
          camera.alpha = -Math.PI / 2;
          camera.beta = 0.1;           // Almost directly above
          camera.radius = 10;
          break;
        case 'side':
          camera.alpha = 0;            // 0 degrees
          camera.beta = Math.PI / 3;   
          camera.radius = 10;
          break;
        case 'closeup':
          camera.alpha = -Math.PI / 2;
          camera.beta = Math.PI / 3;
          camera.radius = 5;           // Closer to object
          break;
        default:
          camera.alpha = -Math.PI / 2;
          camera.beta = Math.PI / 3;
          camera.radius = 10;
      }
      
      camera.setTarget(BABYLON.Vector3.Zero());
    },
    
    // Capture viewport as an image
    captureViewport: () => {
      if (!sceneRef.current || !engineRef.current) return null;
      
      // Force a render
      sceneRef.current.render();
      
      // Get image data
      const canvas = engineRef.current.getRenderingCanvas();
      const dataURL = canvas.toDataURL('image/jpeg', 0.8);
      
      return dataURL;
    },
    
    // Play animation
    playAnimation: () => {
      if (animationGroupRef.current) {
        animationGroupRef.current.start(true);
      }
    },
    
    // Pause animation
    pauseAnimation: () => {
      if (animationGroupRef.current) {
        animationGroupRef.current.pause();
      }
    },
    
    // Get current model
    getModel: () => modelRef.current
  }));

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={containerRef}
        className="w-full h-full bg-black rounded-lg"
        style={{
          minHeight: '300px',
          aspectRatio: '16/9'
        }}
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <Loading text="Loading asset preview..." />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-lg text-center">
            <p className="text-red-600 font-medium">Failed to load 3D preview</p>
            <p className="text-gray-600 text-sm mt-2">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
});

BabylonJsRenderer.displayName = 'BabylonJsRenderer';

export default BabylonJsRenderer;