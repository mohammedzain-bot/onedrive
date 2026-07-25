/**
 * AutoRx Detailing Studio - Three.js Interactive 3D Car Visualizer
 */

class CarVisualizer3D {
  constructor() {
    this.container = document.getElementById('three-canvas-container');
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.carGroup = null;
    this.carBodyMesh = null;
    this.carPaintMaterial = null;
    this.wheels = [];
    this.headlights = [];
    this.particles = null;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotationY = 0;
    this.targetRotationX = 0;

    this.currentColor = 0xe11d48; // Default Ruby Red Metallic

    this.init();
  }

  init() {
    // 1. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0b0d10, 0.015);

    // 2. Camera Setup
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 2.5, 9);
    this.camera.lookAt(0, 0.8, 0);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting System
    this.setupLights();

    // 5. Build 3D Car Model Procedurally
    this.buildCarModel();

    // 6. Reflection Environment Floor Grid
    this.buildShowroomFloor();

    // 7. Atmospheric Lighting Particles
    this.buildAtmosphere();

    // 8. Event Listeners & Swatches
    this.setupEventListeners();

    // 9. Start Animation Loop
    this.animate();
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Main Studio Overhead Hex-Light Highlight
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(5, 12, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);

    // Key Rim Light (Yellow/Gold Studio Accent)
    const rimLight = new THREE.DirectionalLight(0xfacc15, 1.5);
    rimLight.position.set(-8, 6, -6);
    this.scene.add(rimLight);

    // Under-body Glow Light
    const underGlow = new THREE.PointLight(0xfacc15, 2, 8);
    underGlow.position.set(0, 0.2, 0);
    this.scene.add(underGlow);
  }

  buildCarModel() {
    this.carGroup = new THREE.Group();

    // Car Paint Metallic Material (Clearcoat Studio Shine)
    this.carPaintMaterial = new THREE.MeshPhysicalMaterial({
      color: this.currentColor,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
    });

    // Glass Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.8,
      transparent: true,
      opacity: 0.85,
      reflectivity: 0.9,
    });

    // Dark Carbon / Chassis Material
    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.5,
      roughness: 0.5,
    });

    // Chrome / Alloy Material
    const alloyMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.1,
    });

    // Headlight Glow Material
    const headlightMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    // --- Main Car Body Frame ---
    const bodyGeometry = new THREE.BoxGeometry(2.4, 0.75, 4.6);
    bodyGeometry.translate(0, 0.75, 0);
    this.carBodyMesh = new THREE.Mesh(bodyGeometry, this.carPaintMaterial);
    this.carBodyMesh.castShadow = true;
    this.carBodyMesh.receiveShadow = true;
    this.carGroup.add(this.carBodyMesh);

    // Front Aerodynamic Hood Slope
    const hoodGeo = new THREE.BoxGeometry(2.35, 0.35, 1.8);
    hoodGeo.rotateX(-0.15);
    const hood = new THREE.Mesh(hoodGeo, this.carPaintMaterial);
    hood.position.set(0, 0.85, 1.3);
    hood.castShadow = true;
    this.carGroup.add(hood);

    // Cabin / Roof Dome
    const cabinGeo = new THREE.BoxGeometry(2.0, 0.7, 2.2);
    cabinGeo.translate(0, 1.35, -0.3);
    const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
    this.carGroup.add(cabin);

    // Roof Top Shell
    const roofShellGeo = new THREE.BoxGeometry(1.95, 0.08, 1.8);
    const roofShell = new THREE.Mesh(roofShellGeo, this.carPaintMaterial);
    roofShell.position.set(0, 1.72, -0.3);
    roofShell.castShadow = true;
    this.carGroup.add(roofShell);

    // Rear Spoiler
    const spoilerWingGeo = new THREE.BoxGeometry(2.3, 0.08, 0.45);
    const spoilerWing = new THREE.Mesh(spoilerWingGeo, this.carPaintMaterial);
    spoilerWing.position.set(0, 1.25, -2.15);

    const spoilerLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.2), chassisMaterial);
    spoilerLeg1.position.set(-0.8, 1.05, -2.15);
    const spoilerLeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.2), chassisMaterial);
    spoilerLeg2.position.set(0.8, 1.05, -2.15);

    this.carGroup.add(spoilerWing);
    this.carGroup.add(spoilerLeg1);
    this.carGroup.add(spoilerLeg2);

    // --- LED Headlights ---
    const headlightGeo = new THREE.BoxGeometry(0.65, 0.12, 0.15);
    const headL = new THREE.Mesh(headlightGeo, headlightMaterial);
    headL.position.set(-0.85, 0.78, 2.31);
    const headR = new THREE.Mesh(headlightGeo, headlightMaterial);
    headR.position.set(0.85, 0.78, 2.31);
    this.carGroup.add(headL);
    this.carGroup.add(headR);

    // --- 4 Alloy Wheels ---
    const wheelPositions = [
      [-1.25, 0.45, 1.45],  // Front Left
      [1.25, 0.45, 1.45],   // Front Right
      [-1.25, 0.45, -1.45], // Rear Left
      [1.25, 0.45, -1.45]   // Rear Right
    ];

    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 32);
    wheelGeo.rotateZ(Math.PI / 2);

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
    });

    wheelPositions.forEach(pos => {
      const wheelGroup = new THREE.Group();
      
      // Tire
      const tire = new THREE.Mesh(wheelGeo, tireMaterial);
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Rim Cap
      const rimGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.36, 16);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, alloyMaterial);
      wheelGroup.add(rim);

      wheelGroup.position.set(...pos);
      this.wheels.push(wheelGroup);
      this.carGroup.add(wheelGroup);
    });

    // Position & Angle initial state
    this.carGroup.position.set(0, 0, 0);
    this.carGroup.rotation.y = Math.PI / 5;
    this.scene.add(this.carGroup);
  }

  buildShowroomFloor() {
    // Reflective Grid Floor
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090b0e,
      roughness: 0.2,
      metalness: 0.6,
    });

    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Studio Circular Lighting Ring under car
    const ringGeo = new THREE.RingGeometry(2.8, 3.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    this.scene.add(ring);
  }

  buildAtmosphere() {
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = Math.random() * 6 + 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfacc15,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  changeCarColor(hexColor) {
    this.currentColor = hexColor;
    if (this.carPaintMaterial) {
      this.carPaintMaterial.color.setHex(hexColor);
    }
  }

  setupEventListeners() {
    // Mouse Parallax Interaction
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) - 0.5;
      this.mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Color Swatches UI Integration
    const swatches = document.querySelectorAll('.swatch-btn');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        const colorHex = parseInt(swatch.getAttribute('data-color'), 16);
        this.changeCarColor(colorHex);
      });
    });

    // Window Resize Handler
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Continuous 360° Studio Rotation
    if (this.carGroup) {
      this.carGroup.rotation.y += 0.005;

      // Mouse Parallax response
      this.targetRotationY = this.mouseX * 0.4;
      this.targetRotationX = this.mouseY * 0.2;

      this.carGroup.rotation.y += (this.targetRotationY - this.carGroup.rotation.y) * 0.05;
      this.carGroup.rotation.x += (-this.targetRotationX - this.carGroup.rotation.x) * 0.05;

      // Rotate Wheels slowly to match car motion effect
      this.wheels.forEach(wheel => {
        wheel.children[0].rotation.x += 0.02;
      });
    }

    // Gentle particle drift
    if (this.particles) {
      this.particles.rotation.y += 0.0008;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize 3D Car Visualizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.car3D = new CarVisualizer3D();
});
