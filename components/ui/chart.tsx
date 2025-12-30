'use client';

import { useEffect, useRef } from 'react';

// Line Chart Component
export function LineChart({ 
  data, 
  height = 200, 
  color = '#3ecf8e',
  showDots = true,
  animate = true 
}: { 
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  showDots?: boolean;
  animate?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = 40;
    const width = rect.width;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min/max
    const values = data.map(d => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values, 0);
    const range = maxValue - minValue || 1;

    // Draw grid lines
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Plot points
    const points: { x: number; y: number }[] = [];
    data.forEach((item, i) => {
      const x = padding + (chartWidth / (data.length - 1 || 1)) * i;
      const normalized = (item.value - minValue) / range;
      const y = padding + chartHeight - normalized * chartHeight;
      points.push({ x, y });
    });

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '00');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Draw dots
    if (showDots) {
      points.forEach(p => {
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw labels
    ctx.fillStyle = '#8b8b8b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    data.forEach((item, i) => {
      const x = padding + (chartWidth / (data.length - 1 || 1)) * i;
      ctx.fillText(item.label, x, height - 10);
    });

  }, [data, height, color, showDots, animate]);

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

// Bar Chart Component
export function BarChart({ 
  data, 
  height = 200, 
  color = '#3ecf8e' 
}: { 
  data: { label: string; value: number; color?: string }[];
  height?: number;
  color?: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <div className="flex items-end justify-between h-full gap-2 pb-8">
        {data.map((item, i) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
              <div className="flex-1 flex items-end w-full">
                <div 
                  className="w-full rounded-t-lg transition-all duration-500 ease-out relative group"
                  style={{ 
                    height: `${barHeight}%`,
                    backgroundColor: item.color || color,
                  }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}
                  </div>
                </div>
              </div>
              <div className="text-xs text-[#8b8b8b] text-center truncate w-full">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Donut Chart Component
export function DonutChart({ 
  data, 
  size = 160,
  thickness = 30 
}: { 
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - thickness) / 2;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Draw segments
    let currentAngle = -Math.PI / 2; // Start at top
    data.forEach(item => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.lineWidth = thickness;
      ctx.strokeStyle = item.color;
      ctx.lineCap = 'round';
      ctx.stroke();

      currentAngle += sliceAngle;
    });

  }, [data, size, thickness]);

  return (
    <div className="flex items-center gap-6">
      <canvas ref={canvasRef} width={size} height={size} />
      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-[#8b8b8b]">{item.label}</span>
            <span className="text-sm font-semibold ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sparkline Component (mini line chart)
export function Sparkline({ 
  data, 
  height = 40, 
  width = 100,
  color = '#3ecf8e' 
}: { 
  data: number[];
  height?: number;
  width?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    const points: { x: number; y: number }[] = [];
    data.forEach((value, i) => {
      const x = (width / (data.length - 1 || 1)) * i;
      const normalized = (value - minValue) / range;
      const y = height - normalized * height;
      points.push({ x, y });
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

  }, [data, height, width, color]);

  return <canvas ref={canvasRef} width={width} height={height} className="opacity-60" />;
}

// Progress Bar Component
export function ProgressBar({ 
  value, 
  max = 100, 
  color = '#3ecf8e',
  showLabel = true,
  height = 8
}: { 
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  height?: number;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      <div 
        className="w-full bg-white/5 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div 
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-[#8b8b8b] mt-1">
          <span>{value.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
