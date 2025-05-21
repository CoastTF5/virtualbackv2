import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Loading from '../common/Loading';

const ThreeJsRenderer = forwardRef(({ assetId, renderMode = 'realtime' }, ref) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animationMixerRef = useRef(null);
  const modelRef = useRef(null);
  const requestRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);

    // Setup camera
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 50;
    controlsRef.current = controls;
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (animationMixerRef.current) {
        animationMixerRef.current.update(0.016); // Approx 60fps
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
      
      if (rendererRef.current && rendererRef.current.domElement) {
        if (containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        // Dispose all geometries and materials
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  // Load 3D model when assetId changes
  useEffect(() => {
    if (!assetId || !sceneRef.current || !cameraRef.current) return;
    
    const loadModel = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Clear previous model
        if (modelRef.current) {
          sceneRef.current.remove(modelRef.current);
          modelRef.current = null;
        }

        // For the prototype, we'll use mock models or simple primitives
        // In a real app, this would load the actual 3D model from an API
        
        // Create a simple placeholder model
        let model;
        
        // In a real application, we would load the model like this:
        // const loader = new GLTFLoader();
        // const gltf = await loader.loadAsync(`/assets/models/${assetId}.glb`);
        // model = gltf.scene;
        
        // For the prototype, create a simple placeholder based on assetId
        // Check if this is one of our actual 3D models
        if (
          assetId === 'vehicle-bmw-i8' || 
          assetId === 'vehicle-bmw-x7' || 
          assetId === 'vehicle-rusty-car' || 
          assetId === 'environment-nagoya' || 
          assetId === 'prop-pirates-ship'
        ) {
          // Load the actual model
          const loader = new GLTFLoader();
          let modelPath;
          
          // Determine the correct model path based on asset ID
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
            default:
              modelPath = '/assets/models/bmw_i8_liberty_walk.glb';
          }
          
          try {
            const gltf = await loader.loadAsync(modelPath);
            model = gltf.scene;
            
            // Apply specific scaling and positioning based on model type
            switch (assetId) {
              case 'vehicle-bmw-i8':
                model.scale.set(0.02, 0.02, 0.02);
                model.position.y = -0.5;
                break;
              case 'vehicle-bmw-x7':
                model.scale.set(0.015, 0.015, 0.015);
                model.position.y = -0.5;
                break;
              case 'vehicle-rusty-car':
                model.scale.set(2, 2, 2);
                model.position.y = 0;
                break;
              case 'environment-nagoya':
                model.scale.set(0.1, 0.1, 0.1);
                model.position.y = -0.5;
                break;
              case 'prop-pirates-ship':
                model.scale.set(0.1, 0.1, 0.1);
                model.position.y = 0;
                break;
              default:
                model.scale.set(0.02, 0.02, 0.02);
                model.position.y = -0.5;
            }
            
            // Set up animations if available
            if (gltf.animations && gltf.animations.length > 0) {
              animationMixerRef.current = new THREE.AnimationMixer(model);
              const action = animationMixerRef.current.clipAction(gltf.animations[0]);
              action.play();
            }
            
            // Clear existing lights for better model visualization
            sceneRef.current.traverse((object) => {
              if (object.isLight) sceneRef.current.remove(object);
            });
            
            // Add better lighting for all models
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            sceneRef.current.add(ambientLight);
            
            const spotLight1 = new THREE.SpotLight(0xffffff, 1.0);
            spotLight1.position.set(5, 10, 5);
            spotLight1.castShadow = true;
            spotLight1.angle = Math.PI / 4;
            sceneRef.current.add(spotLight1);
            
            const spotLight2 = new THREE.SpotLight(0xffffff, 0.8);
            spotLight2.position.set(-5, 8, -5);
            spotLight2.castShadow = true;
            spotLight2.angle = Math.PI / 4;
            sceneRef.current.add(spotLight2);
            
            // Add a ground plane for environments
            if (assetId === 'environment-nagoya') {
              const groundGeometry = new THREE.PlaneGeometry(100, 100);
              const groundMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                roughness: 0.8,
                metalness: 0.2
              });
              const ground = new THREE.Mesh(groundGeometry, groundMaterial);
              ground.rotation.x = -Math.PI / 2;
              ground.position.y = -0.5;
              ground.receiveShadow = true;
              sceneRef.current.add(ground);
              
              // Position camera higher for environment view
              cameraRef.current.position.set(10, 15, 20);
            } else {
              // Default camera position for vehicles and props
              cameraRef.current.position.set(5, 3, 5);
            }
            
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
            
          } catch (err) {
            console.error(`Error loading model ${modelPath}:`, err);
            
            // Create appropriate fallback based on asset type
            if (assetId.includes('vehicle')) {
              // Vehicle placeholder
              model = new THREE.Group();
              
              // Car body
              const bodyGeometry = new THREE.BoxGeometry(2, 0.75, 4);
              const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1E90FF });
              const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
              body.position.y = 0.75;
              model.add(body);
              
              // Car top
              const topGeometry = new THREE.BoxGeometry(1.8, 0.5, 2);
              const topMaterial = new THREE.MeshStandardMaterial({ color: 0x0066CC });
              const top = new THREE.Mesh(topGeometry, topMaterial);
              top.position.set(0, 1.25, -0.5);
              model.add(top);
              
              // Wheels
              const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
              const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
              
              const wheelPositions = [
                { x: -1, y: 0.4, z: -1.3 },
                { x: 1, y: 0.4, z: -1.3 },
                { x: -1, y: 0.4, z: 1.3 },
                { x: 1, y: 0.4, z: 1.3 }
              ];
              
              wheelPositions.forEach(pos => {
                const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
                wheel.rotation.z = Math.PI / 2;
                wheel.position.set(pos.x, pos.y, pos.z);
                model.add(wheel);
              });
            } else if (assetId.includes('environment')) {
              // Environment placeholder
              model = new THREE.Group();
              
              // Ground
              const groundGeometry = new THREE.PlaneGeometry(20, 20);
              const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
              const ground = new THREE.Mesh(groundGeometry, groundMaterial);
              ground.rotation.x = -Math.PI / 2;
              model.add(ground);
              
              // Buildings
              for (let i = 0; i < 5; i++) {
                const height = Math.random() * 5 + 2;
                const buildingGeometry = new THREE.BoxGeometry(2, height, 2);
                const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
                const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
                building.position.set(
                  Math.random() * 16 - 8,
                  height / 2,
                  Math.random() * 16 - 8
                );
                model.add(building);
              }
            } else {
              // Default fallback
              const geometry = new THREE.BoxGeometry(2, 2, 2);
              const material = new THREE.MeshStandardMaterial({ color: 0x1E90FF });
              model = new THREE.Mesh(geometry, material);
            }
          }
        } else if (assetId.includes('environment')) {
          // Create a simple environment
          const geometry = new THREE.BoxGeometry(10, 0.1, 10);
          const material = new THREE.MeshStandardMaterial({ color: 0x999999 });
          model = new THREE.Mesh(geometry, material);
          
          // Add some buildings
          for (let i = 0; i < 10; i++) {
            const height = Math.random() * 5 + 1;
            const boxGeometry = new THREE.BoxGeometry(1, height, 1);
            const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8888ff });
            const building = new THREE.Mesh(boxGeometry, boxMaterial);
            building.position.set(Math.random() * 8 - 4, height / 2, Math.random() * 8 - 4);
            model.add(building);
          }
        } else if (assetId.includes('vehicle')) {
          // Create a simple car shape
          model = new THREE.Group();
          
          // Car body
          const bodyGeometry = new THREE.BoxGeometry(2, 0.75, 4);
          const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
          const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
          body.position.y = 0.75;
          model.add(body);
          
          // Car top
          const topGeometry = new THREE.BoxGeometry(1.8, 0.5, 2);
          const topMaterial = new THREE.MeshStandardMaterial({ color: 0x880000 });
          const top = new THREE.Mesh(topGeometry, topMaterial);
          top.position.set(0, 1.25, -0.5);
          model.add(top);
          
          // Wheels
          const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
          const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
          
          const wheelPositions = [
            { x: -1, y: 0.4, z: -1.3 },
            { x: 1, y: 0.4, z: -1.3 },
            { x: -1, y: 0.4, z: 1.3 },
            { x: 1, y: 0.4, z: 1.3 }
          ];
          
          wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos.x, pos.y, pos.z);
            model.add(wheel);
          });
        } else {
          // Default object
          const geometry = new THREE.SphereGeometry(2, 32, 16);
          const material = new THREE.MeshStandardMaterial({ 
            color: 0x3366ff,
            roughness: 0.3,
            metalness: 0.2
          });
          model = new THREE.Mesh(geometry, material);
        }
        
        // Add model to scene
        sceneRef.current.add(model);
        modelRef.current = model;
        
        // Reset camera and controls
        cameraRef.current.position.set(0, 5, 10);
        cameraRef.current.lookAt(0, 0, 0);
        
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
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
    if (!rendererRef.current) return;
    
    // Different rendering settings based on mode
    if (renderMode === 'realtime') {
      rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current.toneMappingExposure = 1.0;
    } else if (renderMode === 'offline') {
      // Higher quality settings for 'offline' render mode
      rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current.toneMappingExposure = 1.2;
      rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping;
    }
    
    // For a real app, you would apply more sophisticated render settings
  }, [renderMode]);

  // Expose methods to parent components via ref
  useImperativeHandle(ref, () => ({
    // Get current camera position
    getCurrentCameraPosition: () => {
      if (!cameraRef.current) return { x: 0, y: 0, z: 0, rotation: { x: 0, y: 0, z: 0 } };
      
      return {
        x: cameraRef.current.position.x,
        y: cameraRef.current.position.y,
        z: cameraRef.current.position.z,
        rotation: {
          x: cameraRef.current.rotation.x,
          y: cameraRef.current.rotation.y,
          z: cameraRef.current.rotation.z
        }
      };
    },
    
    // Set camera position
    setCameraPosition: (preset) => {
      if (!cameraRef.current || !controlsRef.current) return;
      
      // This could be expanded to handle named preset positions
      switch (preset) {
        case 'front':
          cameraRef.current.position.set(0, 2, 10);
          controlsRef.current.target.set(0, 0, 0);
          break;
        case 'top':
          cameraRef.current.position.set(0, 10, 0);
          controlsRef.current.target.set(0, 0, 0);
          break;
        case 'side':
          cameraRef.current.position.set(10, 2, 0);
          controlsRef.current.target.set(0, 0, 0);
          break;
        default:
          cameraRef.current.position.set(5, 5, 5);
          controlsRef.current.target.set(0, 0, 0);
      }
      
      controlsRef.current.update();
    },
    
    // Capture viewport as an image
    captureViewport: () => {
      if (!rendererRef.current) return null;
      
      // Render a frame
      if (sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      // Get image data
      const dataURL = rendererRef.current.domElement.toDataURL('image/jpeg', 0.8);
      
      return dataURL;
    },
    
    // Play animation
    playAnimation: () => {
      // This would control animation playback in a real app
    },
    
    // Pause animation
    pauseAnimation: () => {
      // This would pause animation in a real app
    },
    
    // Get current model
    getModel: () => modelRef.current
  }));

  return (
    <div className="relative w-full h-full">
      <div 
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

ThreeJsRenderer.displayName = 'ThreeJsRenderer';

export default ThreeJsRenderer;