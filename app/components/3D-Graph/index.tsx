'use client';
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';

const ForceGraph3D = dynamic(
  () => import('react-force-graph-3d'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-[970px]">Loading 3D visualization...</div>
  }
);

export default function Graph3D({ nodes, links }: { nodes: any[], links: any[] }) {
  const fgRef = useRef<any>(null);
  
  const getNodeSize = (node: any) => {
    return node.name === 'World' ? 10 : 5;
  };

  const handleNodeClick = (node: any) => {
    if (fgRef.current) {
      const distance = 50;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        1800,
      );
    }
  };

  const getNodeLabel = (node: any) => {
    return `<div class="bg-gray-950 p-1 rounded-md">
    <div><h3>Name: ${node.name}</h3></div>
    ${node.countryName ? `<div>Country: ${node.countryName}</div>` : ''}
    <div>Flag: ${node.flag || 'No flag available'}</div>
    <div>Group: ${node.group}</div>
    <div>Latitude: ${node.latitude || 'No latitude available'}</div>
    <div>Longitude: ${node.longitude || 'No longitude available'}</div>
    <div>Size: ${getNodeSize(node).toFixed(2)}</div>
    </div>`;
  };

  const getNodeThreeObject = (node: any) => {
    if (!node.flag) {
      // Fallback to default colored sphere if no flag
      return new THREE.Mesh(
        new THREE.SphereGeometry(getNodeSize(node)),
      );
    }
  
    // Create canvas for the flag emoji
    const canvas = document.createElement('canvas');
    const size = 128; // Higher resolution for better quality
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw flag emoji
    ctx.font = `${size * 0.8}px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.flag, size/2, size/2);
  
    // Create sprite with the flag texture
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
      map: texture,
    });
    
    const sprite = new THREE.Sprite(material);
    const scale = getNodeSize(node) * 2;
    sprite.scale.set(scale, scale, 1);
    return sprite;
  };
  

  return (
    <div className="w-full h-screen overflow-hidden">
      <ForceGraph3D
        nodeOpacity={1}
        linkOpacity={1}
        nodeResolution={16}
        ref={fgRef}
        graphData={{ nodes, links }}
        nodeLabel={getNodeLabel}
        nodeAutoColorBy="group"
        nodeVal={getNodeSize}
        linkDirectionalParticles={4}
        linkDirectionalParticleSpeed={d => d.value * 0.01}
        backgroundColor='rgb(16 24 40)'
        onNodeClick={handleNodeClick}
        nodeThreeObject={getNodeThreeObject}
      />
    </div>
  );
}