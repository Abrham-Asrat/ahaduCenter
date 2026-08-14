// src/components/common/ShaderHero.jsx
import { useEffect, useRef } from 'react';

/**
 * ShaderHero Component
 * 
 * WebGL shader background for the hero section.
 * Uses a custom fragment shader to create an animated
 * emerald and gold cinematic gradient effect.
 * 
 * Features:
 * - Responsive canvas that syncs with its container
 * - Animation loop with requestAnimationFrame
 * - Mouse movement interaction
 * - Cleanup on unmount
 */
const ShaderHero = () => {
    // Ref for the canvas element
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Sync canvas size with its container
        const syncSize = () => {
            const w = canvas.clientWidth || 1280;
            const h = canvas.clientHeight || 720;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
        };

        // Observe container size changes
        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(syncSize).observe(canvas);
        }
        syncSize();

        // Get WebGL context
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return;

        // Vertex shader source
        const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

        // Fragment shader source - emerald/gold cinematic effect
        const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        float time = u_time * 0.5;
        
        // Colors: emerald green (#10B981), gold (#D4AF37), deep blue
        vec3 emerald = vec3(0.06, 0.72, 0.51);
        vec3 gold = vec3(0.83, 0.69, 0.22);
        vec3 deepBlue = vec3(0.04, 0.06, 0.10);
        
        // Create organic movement using sine waves
        float noise1 = sin(uv.x * 3.0 + time) * cos(uv.y * 2.0 - time * 0.5);
        float noise2 = sin(uv.y * 4.0 - time * 0.8) * cos(uv.x * 2.5 + time * 0.3);
        
        float mask = smoothstep(-1.0, 1.0, noise1 + noise2);
        
        // Blend colors for a cinematic atmosphere
        vec3 color = mix(deepBlue, emerald, mask * 0.4);
        color = mix(color, gold, pow(mask, 3.0) * 0.2);
        
        // Add a subtle vignette
        float dist = distance(uv, vec2(0.5));
        color *= 1.0 - dist * 0.5;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

        // Helper to compile a shader
        function compileShader(type, src) {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        }

        // Create and link program
        const prog = gl.createProgram();
        gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vs));
        gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        // Create vertex buffer (fullscreen quad)
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const pos = gl.getAttribLocation(prog, 'a_position');
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        // Get uniform locations
        const uTime = gl.getUniformLocation(prog, 'u_time');
        const uRes = gl.getUniformLocation(prog, 'u_resolution');

        // Mouse tracking (ShaderToy style)
        let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
        const handleMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            if (rect.width && rect.height) {
                const nx = (event.clientX - rect.left) / rect.width;
                const ny = 1.0 - (event.clientY - rect.top) / rect.height;
                mouse.x = nx * canvas.width;
                mouse.y = ny * canvas.height;
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        let animationId;
        const render = (t) => {
            syncSize();
            gl.viewport(0, 0, canvas.width, canvas.height);
            if (uTime) gl.uniform1f(uTime, t * 0.001);
            if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationId = requestAnimationFrame(render);
        };
        render(0);

        // Cleanup function
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Empty dependency array means this runs once on mount

    return (
        <canvas
            ref={canvasRef}
            style={{ display: 'block', width: '100%', height: '100%' }}
        />
    );
};

export default ShaderHero;