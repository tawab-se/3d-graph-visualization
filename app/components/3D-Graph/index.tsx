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

export default function Graph3D({ nodes, links }: { nodes: any[], links: any[] }) {
  const fgRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
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
    <div>Flag: ${node.flag}</div>
    <div>Group: ${node.group}</div>
    <div>Latitude: ${node.latitude}</div>
    <div>Longitude: ${node.longitude}</div>
    </div>`;
  };

  return (
    <div className="w-full h-[970px] overflow-hidden">
      <ForceGraph3D
        ref={fgRef}
        graphData={{ nodes, links }}
        nodeLabel={getNodeLabel}
        nodeAutoColorBy="group"
        nodeColor={node => node.id === selectedNode?.id ? 'red' : ''}
        linkDirectionalParticles={4}
        linkDirectionalParticleSpeed={d => d.value * 0.01}
        backgroundColor='rgb(16 24 40)'
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}