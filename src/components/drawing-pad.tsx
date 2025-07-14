"use client";

import type React from "react";

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

export function DrawingPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setContext(ctx);
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000000"; // Black color
      }
    }
  }, []);

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!context) return;
      setIsDrawing(true);
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    },
    [context]
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !context) return;
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
    },
    [isDrawing, context]
  );

  const stopDrawing = useCallback(() => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  }, [context]);

  const clearCanvas = useCallback(() => {
    if (context && canvasRef.current) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  }, [context]);

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={340}
        height={200}
        className="border border-gray-300 rounded-md bg-white touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        // For touch devices
        onTouchStart={(e) => {
          if (!context) return;
          setIsDrawing(true);
          context.beginPath();
          const touch = e.touches[0];
          context.moveTo(
            touch.clientX - (canvasRef.current?.offsetLeft || 0),
            touch.clientY - (canvasRef.current?.offsetTop || 0)
          );
        }}
        onTouchMove={(e) => {
          if (!isDrawing || !context) return;
          const touch = e.touches[0];
          context.lineTo(
            touch.clientX - (canvasRef.current?.offsetLeft || 0),
            touch.clientY - (canvasRef.current?.offsetTop || 0)
          );
          context.stroke();
        }}
        onTouchEnd={stopDrawing}
      />
      <Button onClick={clearCanvas} className="bg-[#edae49] cursor-pointer">
        <Eraser className="mr-2 h-4 w-4" />
        Clear Canvas
      </Button>
      <p className="text-sm text-gray-500">Uses Canvas API.</p>
    </div>
  );
}
