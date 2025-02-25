"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text as DreiText } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { Vector3, Box3, Object3D } from "three";

// Define the props type for the Model component
interface ModelProps {
  objPath: string;
  mtlPath: string;
}

const Model = ({ objPath, mtlPath }: ModelProps) => {
  const [model, setModel] = useState<Object3D | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const modelRef = useRef<Object3D | null>(null);

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    
    mtlLoader.load(
      mtlPath,
      (materials) => {
        materials.preload();
        
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        
        objLoader.load(
          objPath,
          (object) => {
            object.scale.set(0.01, 0.01, 0.01);
            object.rotation.x = (Math.PI / 2) * -1;

            const box = new Box3().setFromObject(object);
            const center = box.getCenter(new Vector3());

            object.position.x = -center.x;
            object.position.y = -center.y;
            object.position.z = -center.z;
            
            setModel(object);
            modelRef.current = object;
            setLoading(false);
          },
          undefined,
          (error) => {
            console.error('Error loading OBJ:', error);
            setError('Failed to load 3D model');
            setLoading(false);
          }
        );
      },
      undefined,
      (error) => {
        console.error('Error loading MTL:', error);
        setError('Failed to load materials');
        setLoading(false);
      }
    );
  }, [objPath, mtlPath]);

  // Rotate the model slowly
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.z += 0.005; // Adjust speed as needed
    }
  });

  if (error) return <DreiText position={[0, 0, 0]} color="red" fontSize={0.5}>{error}</DreiText>;
  if (loading) return <DreiText position={[0, 0, 0]} color="white" fontSize={0.15}>Loading...</DreiText>;
  if (!model) return null;

  return <primitive object={model} ref={modelRef} />;
};

// Main component
const ModelViewer = () => {
  return (
    <div className="w-full h-[300px] relative">
      <Canvas
        camera={{ position: [4, 1, 5], fov: 25 }}
        style={{ background: '#000' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Suspense fallback={null}>
          <Model 
            objPath="/models/model.obj" 
            mtlPath="/models/model.mtl" 
          />
        </Suspense>
        <OrbitControls 
          enableZoom={false}
          enablePan={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
