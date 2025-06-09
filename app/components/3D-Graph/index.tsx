'use client';
import React, { useMemo, useRef, useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredNodes, filteredLinks } = useMemo(() => {
    if (!searchTerm.trim()) {
      return { filteredNodes: nodes, filteredLinks: links };
    }
    const searchLower = searchTerm.toLowerCase().trim();
    const matchedNodes = nodes.filter(node =>
      (node.countryName && node.countryName.toLowerCase().includes(searchLower)) ||
      node.name.toLowerCase().includes(searchLower)
    );
    if (matchedNodes.length === 0) {
      const worldNode = nodes.find(node => node.name === 'World');
      return {
        filteredNodes: worldNode ? [worldNode] : [],
        filteredLinks: []
      };
    }
    const filteredNodes = nodes.filter(node =>
      node.name === 'World' || matchedNodes.some(matched => matched.id === node.id)
    );
    const filteredLinks = links.filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return (
        (sourceId === 'World' && matchedNodes.some(node => node.id === targetId)) ||
        (matchedNodes.some(node => node.id === sourceId) && targetId === 'World')
      );
    });
    return { filteredNodes, filteredLinks };
  }, [nodes, links, searchTerm]);
  const getNodeSize = (node: any) => {
    return node.name === 'World' ? 10 : node.parentId ? 2 : 6;
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
    const firstTimezone = node?.timezones?.[0] || {};
    return `<div class="bg-gray-950 rounded-md">
    <div><h3>Name: ${node.name}</h3></div>
    ${node.countryName ? `<div>Country: ${node.countryName}</div>` : ''}
    ${node.flag ? <div>Flag: ${node.flag}</div> : ''}
    <div>Group: ${node.group}</div>
    <div>Latitude: ${node.latitude || 'No latitude available'}</div>
    <div>Longitude: ${node.longitude || 'No longitude available'}</div>
    ${node.phonecode ? <div>Phone Code: ${node.phonecode}</div> : ''}
    ${node.currency ? <div>Currency: ${node.currency}</div> : ''}
    <div>
      ${firstTimezone.zoneName ? <div>Zone Name: ${firstTimezone.zoneName}</div> : ''}
      ${firstTimezone.tzName ? <div>Time Zone: ${firstTimezone.tzName}</div> : ''}
      ${firstTimezone.gmtOffsetName ? <div>Gmt Offset: ${firstTimezone.gmtOffsetName}</div> : ''}
    </div>
    <div>Size: ${getNodeSize(node).toFixed(2)}</div>
    </div>`;
  };

  const getNodeThreeObject = (node: any) => {
    if (!node.flag) {
      return new THREE.Mesh(
        new THREE.SphereGeometry(getNodeSize(node)),
      );
    }
    const canvas = document.createElement('canvas');
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, size, size);
    ctx.font = `${size * 0.8}px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.flag, size / 2, size / 2);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
    });
    const sprite = new THREE.Sprite(material);
    const scale = getNodeSize(node) * 2;
    sprite.scale.set(scale, scale, 1);
    return sprite;
  };
  const getLinkOpacity = (link: any) => {
    const sourceGroup = typeof link.source === 'object' ? link.source.group : 
                       nodes.find(n => n.id === link.source)?.group;
    const targetGroup = typeof link.target === 'object' ? link.target.group : 
                       nodes.find(n => n.id === link.target)?.group;
    
    // World-Country link (group 0 and 1)
    if ((sourceGroup === 0 && targetGroup === 1) || 
        (sourceGroup === 1 && targetGroup === 0)) {
      return 1;
    }
    // Country-State link (group 1 and 2)
    if ((sourceGroup === 1 && targetGroup === 2) || 
        (sourceGroup === 2 && targetGroup === 1)) {
      return 0.7;
    }
    
    return 0.5; // Default for other connections
  };
  
  return (
    <div className="w-full h-screen overflow-hidden relative">
      <div className="absolute top-4 right-4 z-10">
        <input
          type="text"
          placeholder="Search country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ForceGraph3D
        nodeOpacity={1}
        linkOpacity={1}
        nodeResolution={16}
        ref={fgRef}
        graphData={{ nodes: filteredNodes, links: filteredLinks }}
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