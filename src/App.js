import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Text } from 'troika-three-text';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const mountRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false); // State to show/hide popup
  const navigate = useNavigate();  // Initialize useNavigate hook

  useEffect(() => {
    // Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Load Desk Model
    const loader = new GLTFLoader();
    loader.load('/small_office.glb', (gltf) => {
      const desk = gltf.scene;
      desk.position.set(0, -1, 0);
      desk.scale.set(2, 2, 2);
      scene.add(desk);
    });

    // Paper Object
    const paperGeometry = new THREE.PlaneGeometry(0.5, 0.7);
    const paperMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const paper = new THREE.Mesh(paperGeometry, paperMaterial);
    paper.position.set(-0.4, -1.7, -0.8);
    paper.rotation.x = -Math.PI / 2;
    scene.add(paper);

    // Portfolio Text
    const portfolioText = new Text();
    portfolioText.text = 'Welcome to\nSheila\'s\nPortfolio';
    portfolioText.fontSize = 0.08;
    portfolioText.color = 0x000000;
    portfolioText.position.set(-0.6, -1.6, -0.8);
    portfolioText.rotation.x = -Math.PI / 2;
    portfolioText.sync();
    scene.add(portfolioText);

    // Clickable Objects
    const interactiveObjects = [paper, portfolioText];

    // Raycaster for Click Detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject === paper || clickedObject === portfolioText) {
          setShowPopup(true); // Show popup
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    // Resize Handling
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', onWindowResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div>
      {/* 3D Scene */}
      <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />

      {/* Popup Modal */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click propagation to 3D scene
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent click propagation
          >
            <h2>Welcome to Sheila's Portfolio!</h2>
            <p>Click the button below to visit the portfolio page.</p>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              onClick={() => navigate('/portfolio')}  // Use navigate instead of window.location.href
            >
              Go to Portfolio
            </button>
            <br />
            <button
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#ddd',
                color: '#333',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
