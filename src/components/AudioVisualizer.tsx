"use client";

import { useEffect, useRef } from "react";
import { useAudio } from "@/components/AudioProvider";

const POINTS = 32;

export default function AudioVisualizer({ className, height = 56, threed = false }: { className?: string; height?: number; threed?: boolean }) {
  const H = height;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const dimsRef = useRef({ W: 200 });
  const audio = useAudio();
  const stateRef = useRef({ isPlaying: false, analyserNode: null as AnalyserNode | null });

  useEffect(() => {
    stateRef.current.isPlaying = audio.isPlaying;
    stateRef.current.analyserNode = audio.analyserNode;
  }, [audio.isPlaying, audio.analyserNode]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(() => {
      const W = container.clientWidth;
      if (W > 0) {
        canvas.width = W;
        dimsRef.current.W = W;
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Depth offset for 3D extrusion
    const DX = 10;
    const DY = -7;

    function drawCurvePath(points: number[], W: number) {
      ctx!.beginPath();
      ctx!.moveTo(0, H);
      for (let i = 0; i < points.length - 1; i++) {
        const x0 = (i / (points.length - 1)) * W;
        const x1 = ((i + 1) / (points.length - 1)) * W;
        const y0 = H - points[i];
        const y1 = H - points[i + 1];
        const cpX = (x0 + x1) / 2;
        ctx!.quadraticCurveTo(x0, y0, cpX, (y0 + y1) / 2);
      }
      ctx!.lineTo(W, H - points[points.length - 1]);
      ctx!.lineTo(W, H);
      ctx!.closePath();
    }

    function drawStrokePath(points: number[], W: number, style: CanvasGradient | string) {
      ctx!.beginPath();
      for (let i = 0; i < points.length - 1; i++) {
        const x0 = (i / (points.length - 1)) * W;
        const x1 = ((i + 1) / (points.length - 1)) * W;
        const y0 = H - points[i];
        const y1 = H - points[i + 1];
        const cpX = (x0 + x1) / 2;
        if (i === 0) ctx!.moveTo(x0, y0);
        ctx!.quadraticCurveTo(x0, y0, cpX, (y0 + y1) / 2);
      }
      ctx!.lineTo(W, H - points[points.length - 1]);
      ctx!.strokeStyle = style;
      ctx!.lineWidth = 1.5;
      ctx!.lineJoin = "round";
      ctx!.stroke();
    }

    function drawFlat(W: number) {
      ctx!.beginPath();
      ctx!.moveTo(0, H);
      ctx!.lineTo(W, H);
      ctx!.strokeStyle = "rgba(0, 212, 160, 0.25)";
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }

    function draw3DRibbon(points: number[], W: number) {
      // 1. Back face (dark, extruded behind)
      ctx!.save();
      ctx!.translate(DX, DY);
      drawCurvePath(points, W);
      const backGrad = ctx!.createLinearGradient(0, 0, W, 0);
      backGrad.addColorStop(0, "rgba(0, 60, 42, 0.95)");
      backGrad.addColorStop(1, "rgba(90, 60, 0, 0.95)");
      ctx!.fillStyle = backGrad;
      ctx!.fill();
      ctx!.restore();

      // 2. Top face (connects front top edge to back top edge)
      ctx!.beginPath();
      // Trace front top edge left → right
      for (let i = 0; i < points.length; i++) {
        const x = (i / (points.length - 1)) * W;
        const y = H - points[i];
        if (i === 0) {
          ctx!.moveTo(x, y);
        } else {
          const px = ((i - 1) / (points.length - 1)) * W;
          const py = H - points[i - 1];
          ctx!.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
        }
      }
      // Connect last front top to last back top
      ctx!.lineTo(W + DX, H - points[points.length - 1] + DY);
      // Back top edge right → left (straight segments)
      for (let i = points.length - 1; i >= 0; i--) {
        ctx!.lineTo((i / (points.length - 1)) * W + DX, H - points[i] + DY);
      }
      ctx!.closePath();
      const topGrad = ctx!.createLinearGradient(0, 0, W, 0);
      topGrad.addColorStop(0, "rgba(0, 180, 120, 0.85)");
      topGrad.addColorStop(1, "rgba(220, 160, 0, 0.85)");
      ctx!.fillStyle = topGrad;
      ctx!.fill();

      // 3. Front face
      drawCurvePath(points, W);
      const frontGrad = ctx!.createLinearGradient(0, 0, W, 0);
      frontGrad.addColorStop(0, "rgba(0, 212, 160, 0.65)");
      frontGrad.addColorStop(1, "rgba(255, 194, 0, 0.65)");
      ctx!.fillStyle = frontGrad;
      ctx!.fill();

      // 4. Front edge highlight (brightest line)
      const edgeGrad = ctx!.createLinearGradient(0, 0, W, 0);
      edgeGrad.addColorStop(0, "rgba(0, 255, 200, 1.0)");
      edgeGrad.addColorStop(1, "rgba(255, 230, 0, 1.0)");
      drawStrokePath(points, W, edgeGrad);
    }

    function draw() {
      frameRef.current = requestAnimationFrame(draw);
      const W = dimsRef.current.W;
      ctx!.clearRect(0, 0, W, H);

      const { isPlaying, analyserNode } = stateRef.current;

      if (!analyserNode || !isPlaying) {
        drawFlat(W);
        return;
      }

      const data = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteFrequencyData(data);

      const usableBins = Math.floor(data.length * 0.5);
      const points: number[] = [];
      for (let i = 0; i < POINTS; i++) {
        const t = i / (POINTS - 1);
        const idx = Math.floor((i / POINTS) * usableBins);
        const raw = data[idx] / 255;
        const boost = 1 + t * 2.0;
        const amplified = Math.min(1, raw * 0.85 * boost);
        points.push(amplified * (H * 0.88)); // leave headroom for 3D extrusion top
      }

      if (threed) {
        draw3DRibbon(points, W);
      } else {
        const hGrad = ctx!.createLinearGradient(0, 0, W, 0);
        hGrad.addColorStop(0, "rgba(0, 212, 160, 0.9)");
        hGrad.addColorStop(1, "rgba(255, 194, 0, 0.9)");

        const fillGrad = ctx!.createLinearGradient(0, 0, W, 0);
        fillGrad.addColorStop(0, "rgba(0, 212, 160, 0.25)");
        fillGrad.addColorStop(1, "rgba(255, 194, 0, 0.25)");

        drawCurvePath(points, W);
        ctx!.fillStyle = fillGrad;
        ctx!.fill();
        drawStrokePath(points, W, hGrad);
      }
    }

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div ref={containerRef} className={className ?? ""}>
      <canvas ref={canvasRef} width={200} height={H} style={{ height: H }} />
    </div>
  );
}
