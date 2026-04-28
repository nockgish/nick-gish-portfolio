"use client";

import { useEffect, useRef } from "react";
import { useAudio } from "@/components/AudioProvider";

const POINTS = 32;
const H = 56;

export default function AudioVisualizer({ className }: { className?: string }) {
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

  // Keep canvas width in sync with container
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

    function drawCurve(points: number[], W: number) {
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

    function draw() {
      frameRef.current = requestAnimationFrame(draw);
      const W = dimsRef.current.W;
      ctx!.clearRect(0, 0, W, H);

      const { isPlaying, analyserNode } = stateRef.current;

      if (!analyserNode || !isPlaying) {
        ctx!.beginPath();
        ctx!.moveTo(0, H);
        ctx!.lineTo(W, H);
        ctx!.strokeStyle = "rgba(0, 212, 160, 0.25)";
        ctx!.lineWidth = 1;
        ctx!.stroke();
        return;
      }

      const data = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteFrequencyData(data);

      const usableBins = Math.floor(data.length * 0.6);
      const points: number[] = [];
      for (let i = 0; i < POINTS; i++) {
        const idx = Math.floor((i / POINTS) * usableBins);
        const amplified = Math.min(1, (data[idx] / 255) * 1.1);
        points.push(amplified * H);
      }

      const hGrad = ctx!.createLinearGradient(0, 0, W, 0);
      hGrad.addColorStop(0, "rgba(0, 212, 160, 0.9)");
      hGrad.addColorStop(1, "rgba(255, 194, 0, 0.9)");

      const fillGrad = ctx!.createLinearGradient(0, 0, W, 0);
      fillGrad.addColorStop(0, "rgba(0, 212, 160, 0.25)");
      fillGrad.addColorStop(1, "rgba(255, 194, 0, 0.25)");

      drawCurve(points, W);
      ctx!.fillStyle = fillGrad;
      ctx!.fill();

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
      ctx!.strokeStyle = hGrad;
      ctx!.lineWidth = 1.5;
      ctx!.lineJoin = "round";
      ctx!.stroke();
    }

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div ref={containerRef} className={`hidden sm:block ${className ?? ""}`}>
      <canvas ref={canvasRef} width={200} height={H} />
    </div>
  );
}
