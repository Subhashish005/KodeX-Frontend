import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useEffect, useRef, useImperativeHandle } from "react";

import "@xterm/xterm/css/xterm.css";
import "./xterm.css";
import { useAuth } from "../../utils/useAuth.js";

// not using forwardRef intentionally
export const XTerminal = ({termRef}) => {
  const containerRef          = useRef(null);
  const terminalRef           = useRef(null);
  const fitAddonRef           = useRef(null);
  const resizeObserverRef     = useRef(null);
  const socketRef             = useRef(null);
  const handleWindowResizeRef = useRef(null);
  const lastCalledTime        = useRef(null);

  const { auth } = useAuth();

  // again doing some dangerous stuff
  // of course avoid this
  useImperativeHandle(termRef, () => ({
    fit: () => handleWindowResizeRef.current(),
  }));

  useEffect(() => {
    const init = async () => {
      lastCalledTime.current = window.performance.now();

      // initialize terminal with *some*
      // attributes
      const term = new Terminal({
        cursorBlink: true,
        cursorStyle: "block",
        cursorWidth: 1,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontWeight: "normal",
        fontWeightBold: "bold",
        lineHeight: 1.2,
        letterSpacing: 0,
        theme: {
          background: "#120d1f",
          foreground: "#cccccc",
          cursor: "#ffffff",
          black: "#000000",
          red: "#cd3131",
          green: "#0dbc79",
          yellow: "#e5e510",
          blue: "#2472c8",
          magenta: "#bc3fbc",
          cyan: "#11a8cd",
          white: "#e5e5e5",
          brightBlack: "#666666",
          brightRed: "#f14c4c",
          brightGreen: "#23d18b",
          brightYellow: "#f5f543",
          brightBlue: "#3b8eea",
          brightMagenta: "#d670d6",
          brightCyan: "#29b8db",
          brightWhite: "#ffffff"
        },
        scrollback: 1000,
        convertEol: true,
        windowsMode: false,
        allowTransparency: false,
        disableStdin: false,
        drawBoldTextInBrightColors: true,
        scrollSensitivity: 1,
        fastScrollModifier: "alt",
        tabStopWidth: 8,
        bellStyle: "none",
      });

      const socket = new WebSocket('ws://localhost:8080/terminal');

      // sleep for some time to allow the websocket
      // to connect properly
      // wdym? this is production ready code ofc
      await new Promise(r => setTimeout(r, 100));

      // send the access token as the first message to authenticate user
      if(socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "auth",
            access_token: auth.accessToken,
          })
        );
      }

      fitAddonRef.current = new FitAddon();
      terminalRef.current = term;
      socketRef.current = socket;

      const fitAddon = fitAddonRef.current;

      term.loadAddon(fitAddon);

      const handleWindowResize = () => {
        // rate limiting how many times fit
        // can be called since calling it too
        // fast produces some unacceptable visual
        // glitches

        const now = window.performance.now();

        if(now - lastCalledTime.current < 50) return;

        lastCalledTime.current = now;
        fitAddon.fit();
      };

      handleWindowResizeRef.current = handleWindowResize;

      // Setup ResizeObserver for container
      resizeObserverRef.current = new ResizeObserver(() => {
        handleWindowResize();

        const cols = term.cols;
        const rows = term.rows;

        if(socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "resize",
            cols,
            rows
          }));
        }
      });

      window.addEventListener("resize", handleWindowResize);

      if(containerRef.current) {
        resizeObserverRef.current.observe(containerRef.current);
      }

      if(containerRef.current) {
        term.open(containerRef.current);

        // initial fit
        setTimeout(() => {
          fitAddon.fit();
        }, 100);
      }

      term.onData((data) => {
        if(socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "data",
            data
          }));
        }
      });

      socket.onmessage = async (event) => {
        if(event.data instanceof Blob) {
          const text = await event.data.text();
          term.write(text);
        }
      };
    }

    init();

    return () => {
      resizeObserverRef.current?.disconnect();
      window.removeEventListener("resize", handleWindowResizeRef.current);
      terminalRef.current?.dispose();
      socketRef.current?.close();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="terminal-container"
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#1e1e1e",
      }}
    />
  );
};