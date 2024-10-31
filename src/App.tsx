import React, { useRef, useState, useEffect, useMemo } from 'react';
import { BufferGeometry, Material, Mesh, Object3DEventMap, Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Add the following import for the type declaration


interface SnakeSegmentProps {
  position: { x: number; y: number; z: number };
  color: string;
}



// Add the following import for the type declaration
import { MutableRefObject } from 'react';

interface SnakeSegmentProps {
  position: { x: number; y: number; z: number };
  color: string;
}

const SnakeSegment: React.FC<SnakeSegmentProps> = ({ position, color }) => {
  const meshRef = useRef<Mesh<BufferGeometry, Material | Material[], Object3DEventMap>>(null);
  const vector3Position = useMemo(() => new Vector3(position.x, position.y, position.z), [position.x, position.y, position.z]);

  return (
    <mesh position={vector3Position} ref={meshRef as MutableRefObject<Mesh<BufferGeometry, Material | Material[], Object3DEventMap>>}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};


// Main Snake Game Component
const Snake3DGame = () => {
  const [snake, setSnake] = useState([
    { x: 0, y: 0, z: 0 }
  ]);
  const [direction, setDirection] = useState({ x: 1, y: 0, z: 0 });
  const [food, setFood] = useState(generateRandomPosition());
  const [score, setScore] = useState(0);

  // Generate random position for food
  function generateRandomPosition() {
    return {
      x: Math.floor(Math.random() * 20 - 10),
      y: Math.floor(Math.random() * 20 - 10),
      z: Math.floor(Math.random() * 20 - 10)
    };
  }

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: { key: any; }) => {
      switch (e.key) {
        case 'ArrowUp': setDirection({ x: 0, y: 1, z: 0 }); break;
        case 'ArrowDown': setDirection({ x: 0, y: -1, z: 0 }); break;
        case 'ArrowLeft': setDirection({ x: -1, y: 0, z: 0 }); break;
        case 'ArrowRight': setDirection({ x: 1, y: 0, z: 0 }); break;
        case 'w': setDirection({ x: 0, y: 0, z: 1 }); break;
        case 's': setDirection({ x: 0, y: 0, z: -1 }); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
          z: prevSnake[0].z + direction.z
        };

        // Check if food is eaten
        if (
          newHead.x === food.x &&
          newHead.y === food.y &&
          newHead.z === food.z
        ) {
          setFood(generateRandomPosition());
          setScore(prev => prev + 1);
          return [newHead, ...prevSnake];
        }

        // Normal movement
        const newSnake = [newHead, ...prevSnake.slice(0, -1)];
        return newSnake;
      });
    }, 200);

    return () => clearInterval(gameLoop);
  }, [direction, food]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {/* Render Snake Segments */}
        {snake.map((segment, index) => (
          <SnakeSegment
            key={index}
            position={{ x: segment.x, y: segment.y, z: segment.z }}
            color={index === 0 ? 'red' : 'green'}
          />
        ))}

        {/* Render Food */}
        <mesh position={[food.x, food.y, food.z]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      </Canvas>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px'
      }}>
        Score: {score}
      </div>
    </div>
  );
};

export default Snake3DGame;