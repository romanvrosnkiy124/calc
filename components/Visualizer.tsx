
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CabinConfig, WindowSize } from '../types';

interface VisualizerProps {
  config: CabinConfig;
}

const Visualizer: React.FC<VisualizerProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cabinGroupRef = useRef<THREE.Group | null>(null);

  // --- Helper: Generate Textures Programmatically ---
  const createTexture = (type: 'wood' | 'metal' | 'roof') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    if (type === 'wood') {
      // Base brown
      ctx.fillStyle = '#a16207'; 
      ctx.fillRect(0, 0, 512, 512);
      // Plank lines
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 2;
      for (let i = 0; i < 512; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
      // Noise/Grain
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      for(let i=0; i<1000; i++) {
          ctx.fillRect(Math.random()*512, Math.random()*512, 2, 20);
      }
    } else if (type === 'metal') {
      // RAL 5005 Signal Blue
      ctx.fillStyle = '#154889'; // Base RAL 5005
      ctx.fillRect(0, 0, 512, 512);
      
      // Corrugated lines (vertical for walls usually, but let's do vertical)
      const grad = ctx.createLinearGradient(0, 0, 40, 0);
      grad.addColorStop(0, '#154889');     // Base
      grad.addColorStop(0.5, '#3b82f6');  // Lighter highlight (approx blue-500)
      grad.addColorStop(1, '#0e3160');     // Darker shadow
      
      ctx.fillStyle = grad;
      for (let i = 0; i < 512; i += 40) {
         ctx.fillRect(i, 0, 20, 512);
      }
    } else if (type === 'roof') {
        ctx.fillStyle = '#334155';
        ctx.fillRect(0,0,512,512);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  // Memoize textures so we don't recreate them every render
  const textures = useRef<{ [key: string]: THREE.Texture } | null>(null);
  if (!textures.current) {
    textures.current = {
      wood: createTexture('wood'),
      metal: createTexture('metal'),
      roof: createTexture('roof'),
    };
  }

  // --- Initialize Three.js ---
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e0f2fe'); // Sky blue light
    scene.fog = new THREE.Fog('#e0f2fe', 10, 50);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(8, 5, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent going under ground
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Ground Plane
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9' });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(50, 50, '#cbd5e1', '#e2e8f0');
    scene.add(gridHelper);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // --- Update Cabin Model ---
  useEffect(() => {
    if (!sceneRef.current || !textures.current) return;

    // Clean up old group
    if (cabinGroupRef.current) {
      sceneRef.current.remove(cabinGroupRef.current);
    }

    const group = new THREE.Group();
    cabinGroupRef.current = group;

    const { length, width, height, windowList } = config;

    // Determine Elevation
    const elevation = 0.05;

    // 1. Main Body
    // Simplified logic: Standard is always metal siding
    let wallTexture = textures.current.metal; 

    // Repeat texture based on size
    wallTexture.repeat.set(length / 2, height / 2);

    const bodyGeo = new THREE.BoxGeometry(length, height, width);
    const bodyMat = new THREE.MeshStandardMaterial({ map: wallTexture });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = elevation + height / 2; 
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // 2. Roof (Flat with slight overhang)
    const roofGeo = new THREE.BoxGeometry(length + 0.2, 0.1, width + 0.2);
    const roofMat = new THREE.MeshStandardMaterial({ map: textures.current.roof, color: '#334155' });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = elevation + height + 0.05; // On top of body
    roof.castShadow = true;
    group.add(roof);

    // 4. Windows (Mixed Types)
    
    // Flatten list of windows for placement
    const allWindows: WindowSize[] = [];
    windowList.forEach(item => {
        for(let i=0; i<item.count; i++) {
            allWindows.push(item.size);
        }
    });

    // Distribute Windows
    // Use full length for windows since doors are removed
    const zFace = width / 2;
    const totalWindows = allWindows.length;
    const availableLenForWindows = length; 
    const winSpacing = availableLenForWindows / (totalWindows + 1);

    allWindows.forEach((winSize, index) => {
        // Determine individual window dimensions
        let wW = 0.8, wH = 1.0;
        if (winSize === WindowSize.PVC_50x50) { wW = 0.5; wH = 0.5; }
        if (winSize === WindowSize.WOOD_90x110) { wW = 0.9; wH = 1.1; }
        if (winSize === WindowSize.WOOD_75x85) { wW = 0.75; wH = 0.85; }
        if (winSize === WindowSize.PVC_100x85) { wW = 1.0; wH = 0.85; }
        if (winSize === WindowSize.PVC_80x100 || winSize === WindowSize.PVC_80x100_TILT) { wW = 0.8; wH = 1.0; }

        const xPos = -(length / 2) + winSpacing * (index + 1);
        const winGroup = new THREE.Group();
        
        // Glass
        const winGeo = new THREE.BoxGeometry(wW, wH, 0.1);
        const glassMat = new THREE.MeshStandardMaterial({ color: '#bae6fd', roughness: 0.1, metalness: 0.8 });
        // Wood windows darker, PVC white
        const isWood = winSize.includes('WOOD');
        const frameMat = new THREE.MeshStandardMaterial({ color: isWood ? '#854d0e' : '#ffffff' });

        const glass = new THREE.Mesh(winGeo, glassMat);
        // Frame (slightly larger box behind)
        const frame = new THREE.Mesh(new THREE.BoxGeometry(wW + 0.1, wH + 0.1, 0.08), frameMat);
        
        winGroup.add(frame);
        winGroup.add(glass);
        glass.position.z = 0.02;

        winGroup.position.set(xPos, elevation + height / 2 + 0.1, zFace); 
        // Approx 0.9m from floor (0.9 + wH/2)
        winGroup.position.y = elevation + 0.9 + wH/2; 

        group.add(winGroup);
    });

    sceneRef.current.add(group);

  }, [config]);

  return (
    <div className="w-full h-64 md:h-96 bg-slate-100 rounded-lg overflow-hidden relative shadow-inner border border-slate-200">
      <div className="absolute top-2 left-2 z-10 bg-white/80 px-2 py-1 rounded text-xs text-slate-500 font-mono shadow-sm">
        Фасад 3D (Крутите мышкой)
      </div>
      <div ref={containerRef} className="w-full h-full cursor-move" />
    </div>
  );
};

export default Visualizer;
