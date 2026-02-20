import { useEffect, useRef, useState } from "react";
import Split from "react-split";
import { Editor } from "./Editor";
import { XTerminal } from "./XTerminal";

import styles from "./Playground.module.css";
import "./gutter.css";
import './codemirror.css';

export function Playground() {
  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const termRef = useRef(null);
  const workspaceRootRef = useRef(null);
  const sidebarRef = useRef(null);
  const gutterRef = useRef(null);

  const handleTerminalResize = () => {
    if(termRef.current) termRef.current.fit();
  }

  // initial setup for removing/adding explorer sidebar
  useEffect(() => {
    if(workspaceRootRef.current) {
      const parent = workspaceRootRef.current.parent;

      sidebarRef.current = parent.children[0];
      gutterRef.current = parent.children[1];
    }

    // call resize after some time to make
    // sure fit is called after the dom creation not
    // before it
    setTimeout(() => {
      handleTerminalResize();
    }, 500);
  }, []);

  const handleProjectToggle = () => {
    if(!workspaceRootRef.current) return;

    const sidebar = sidebarRef.current;
    const gutter = gutterRef.current;

    if(!sidebar || !gutter) return;

    if(isProjectOpen) {
      sidebar.setAttribute('style', 'display: none');

      const newStyle =
        gutter.getAttribute('class').concat(' hidden');

      gutter.setAttribute('class', newStyle);
    } else {
      sidebar.removeAttribute('style');

      const oldStyle = gutter.getAttribute('class');

      const newStyle = oldStyle.substring(0, oldStyle.lastIndexOf(' '));

      gutter.setAttribute('class', newStyle);
    }

    setIsProjectOpen(!isProjectOpen);
  };

  return (
    <div className={styles.playground_root}>
      <header className={styles.header_root}>
        <div className={styles.header_content}>
          <span className={styles.header_title}>Playground</span>
        </div>
      </header>

      <main className={styles.app_root}>
        <div className={styles.activity_bar_root}>
          <div className={styles.top_btn_grp}>
            <button
              className={`${styles.project_btn} ${isProjectOpen && styles.active}`}
              onClick={handleProjectToggle}
              title={isProjectOpen ? "Hide project" : "Show project"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                width="25px"
                height="25px"
              >
                <path
                  fillRule="evenodd"
                  d="M8.5 0h9L22 4.5v12.068L20.705 18H16v4.568L14.568 24H2.5L1 22.568V7.5L2.5 6H7V1.5zM16 1.5V6h4.5v10.5h-12v-15zm3.879 3L17.5 2.121V4.5zM7 7.5v9.068L8.5 18h6v4.5h-12v-15z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/*
          TODO: if user tries to go beyond minSize while closing
          just toggle the sidebar off.
          on second note might not be a good idea tbh
        */}
        <Split
          className={styles.workspace_root}
          sizes={[15, 85]}
          minSize={100}
          expandToMin={false}
          gutterSize={4}
          gutterAlign="center"
          snapOffset={0}
          dragInterval={0.5}
          direction="horizontal"
          cursor="ew-resize"
          ref={workspaceRootRef}
          onDrag={handleTerminalResize}
        >
          <div
            className={styles.sidebar_root}
          >
            <div className={styles.sidebar_content}>
              <h3 className={styles.sidebar_title}>Explorer</h3>
            </div>
          </div>
          <Split
            className={styles.workspace_main_root}
            sizes={[60, 40]}
            minSize={40}
            expandToMin={false}
            gutterSize={4}
            gutterAlign="center"
            snapOffset={0}
            dragInterval={0.5}
            direction="vertical"
            cursor="ns-resize"
            onDrag={handleTerminalResize}
          >
            <div className={styles.editor_root}>
              <div className={styles.editor_toolbar}>
                <div className={styles.toolbar_tabs}>
                  <button className={`${styles.tab} ${styles.editor_selected_tab}`}>
                    index.js
                  </button>

                  <button className={styles.tab}>
                    App.jsx
                  </button>

                  <button className={styles.tab}>
                    styles.css
                  </button>
                </div>
              </div>

              <div className={styles.editor_container}>
                <div className={styles.editor_pane}>
                  <Editor />
                </div>
              </div>
            </div>

            <div className={styles.terminal_root}>
              <div className={styles.terminal_toolbar}>
                <div className={styles.terminal_tabs}>
                  <button className={`${styles.tab} ${styles.terminal_selected_tab}`}>
                    Terminal
                  </button>
                </div>
              </div>

              <div className={styles.terminal_container}>
                <XTerminal terminalRef={termRef} />
              </div>
            </div>
          </Split>
        </Split>
      </main>
    </div>
  );
}