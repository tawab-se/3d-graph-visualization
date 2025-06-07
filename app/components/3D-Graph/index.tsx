'use client';
import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph3D = dynamic(
  () => import('react-force-graph-3d'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-[970px]">Loading 3D visualization...</div>
  }
);

const groupColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFBE0B',
  '#FB5607',
  '#8338EC',
  '#3A86FF',
  '#FF006E',
  '#A5DD9B',
  '#F9C74F',
];

export default function Graph3D({ nodes, links }: { nodes: any[], links: any[] }) {
  const fgRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const getNodeSize = (node: any) => {
    if (node.name === 'World') return 10;
    const latSize = Math.abs(node.latitude || 0) / 90;
    const longSize = Math.abs(node.longitude || 0) / 180;
    const sizeFactor = 0.7 * latSize + 0.3 * longSize;
    return 2 + sizeFactor * 6;
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
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

  const getNodeColor = (node: any) => {
    if (node.id === selectedNode?.id) return 'red';
    const groupIndex = node.group % groupColors.length;
    return groupColors[groupIndex];
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
        nodeColor={getNodeColor}
        nodeVal={getNodeSize}
        linkDirectionalParticles={4}
        linkDirectionalParticleSpeed={d => d.value * 0.01}
        backgroundColor='rgb(16 24 40)'
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}