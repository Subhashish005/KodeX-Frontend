import { useEffect, useRef, useState } from "react";
import Split from "react-split";
import { Editor } from "./Editor";
import { XTerminal } from "./XTerminal";
import { useParams } from "react-router-dom";
import { Explorer } from "./Explorer.jsx";
import { EditorActivityBar } from './EditorActivityBar.jsx';
import { useAxiosPrivate } from '../../utils/useAxiosPrivate';
import { customErrorPopup, customSuccessPopup } from '../../utils/customPopup.js';

import styles from "./Playground.module.css";
import "./gutter.css";
import './codemirror.css';

export function Playground() {
  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const termRef = useRef(null);
  const workspaceRootRef = useRef(null);
  const sidebarRef = useRef(null);
  const gutterRef = useRef(null);
  const { project_id } = useParams();
  const axiosPrivateInstance = useAxiosPrivate();
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const confirmationPopupRef = useRef(null);

  const activeTab = tabs.find(t => t.id === activeTabId);

  useEffect(() => {
    const handler = (e) => {
      saveProject();

      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);

    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const saveProject = () => {
    // hit backend api to save project somehow
    // as the page/tab/browser might be closing
    // and access token might expire
  }

  const updateTabContent = (newContent) => {
    setTabs(prev => prev.map(
      tab => tab.id === activeTabId
        ? { ...tab, content: newContent, unsaved: true }
        : tab
    ));
  }

  const openFile = async (node) => {
    const existing = tabs.find(t => t.id === node.id);
    const parentId = node.parent.level === 0 ? null : node.parent.id;

    if (existing) {
      setActiveTabId(existing.id);

      return;
    }

    await axiosPrivateInstance.get(
      `/api/v1/projects/${project_id}/files/${node.data.name}?parent_id=${parentId}`
    )
      .then((res) => {
        if (res.status === 200) {
          const content = res.data ? res.data : "";

          const newTab = {
            id: node.id,
            name: node.data.name,
            parentId: node.parent.id,
            parentLevel: node.parent.level,
            content: content,
            unsaved: false
          };

          setTabs(prev => [...prev, newTab]);
          setActiveTabId(newTab.id);
        }
      })
      .catch((err) => {
        customErrorPopup(`Error while fetching data for ${node.data.name}!`);

        console.log(err);
      });
  }

  const saveFile = async () => {
    if (!activeTab) return;

    const parentId = activeTab.parentLevel === 0 ? null : activeTab.parentId;

    await axiosPrivateInstance.put(
      `/api/v1/projects/${project_id}/files/${activeTab.name}?parent_id=${parentId}`,
      activeTab.content,
      {
        headers: {
          "Content-Type": "text/plain"
        }
      }
    )
      .then((res) => {
        if (res.status === 200) {
          setTabs(
            prev => prev.map(
              tab => tab.id === activeTabId
                ? { ...tab, unsaved: false }
                : tab
            )
          );
        }

        customSuccessPopup(`${activeTab.name} saved successfully!`, 400);
      })
      .catch((err) => {
        customErrorPopup(`Error while saving ${activeTab.name}!`);

        console.log(err);
      });
  }

  const closeTab = (id) => {
    const tab = tabs.find(tab => tab.id === id);

    if (tab.unsaved) {
      const confirmClose = window.confirm(
        `${tab.name} has unsaved changes. Close anyway?`
      );

      if (!confirmClose) return;
    }

    setTabs(prev => prev.filter(tab => tab.id !== id));

    // if this tab was focused
    // then check whether there are any tabs before or after it
    // if yes then try to focus the before it otherwise after it
    if (activeTabId === id) {
      let index = 0;

      for (let i = 0; i < tabs.length; ++i) {
        if (activeTabId === tabs[i].id) {
          index = i;

          break;
        }
      }

      if (index > 0) {
        setActiveTabId(tabs[index - 1].id);
      } else if (index < tabs.length - 1) {
        setActiveTabId(tabs[index + 1].id);
      } else {
        setActiveTabId(null);
      }
    }
  }

  const handleSplitDrag = () => {
    if (termRef.current) termRef.current.fit();
  }

  // initial setup for removing/adding explorer sidebar
  useEffect(() => {
    if (workspaceRootRef.current) {
      const parent = workspaceRootRef.current.parent;

      sidebarRef.current = parent.children[0];
      gutterRef.current = parent.children[1];
    }

    // call resize after some time to make
    // sure fit is called after the dom creation not
    // before it
    setTimeout(() => {
      handleSplitDrag();
    }, 500);
  }, []);

  useEffect(() => {
    const confirmExit = (e) => {
      const hasUnsavedChanges = tabs.some(tab => tab.unsaved);

      if (!hasUnsavedChanges) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", confirmExit);

    return () => window.removeEventListener("beforeunload", confirmExit);
  }, [tabs]);

  const handleProjectToggle = () => {
    if (!workspaceRootRef.current) return;

    const sidebar = sidebarRef.current;
    const gutter = gutterRef.current;

    if (!sidebar || !gutter) return;

    if (isProjectOpen) {
      let newStyle = gutter.getAttribute('class').concat(' hidden');

      gutter.setAttribute('class', newStyle);

      newStyle = sidebar.getAttribute('class').concat(' hidden');

      sidebar.setAttribute('class', newStyle);
    } else {
      let oldStyle = gutter.getAttribute('class');

      let newStyle = oldStyle.substring(0, oldStyle.lastIndexOf(' '));

      gutter.setAttribute('class', newStyle);

      oldStyle = sidebar.getAttribute('class');

      newStyle = oldStyle.substring(0, oldStyle.lastIndexOf(' '));

      sidebar.setAttribute('class', newStyle);
    }

    setIsProjectOpen(!isProjectOpen);
  };

  const openConfirmationPopup = () => {
     if(confirmationPopupRef.current) {
      confirmationPopupRef.current.setAttribute('style', 'display: flex');
    }
  }

  const closeConfirmationPopup = () => {
    if(confirmationPopupRef.current) {
      confirmationPopupRef.current.removeAttribute('style');
    }
  };

  return (
    <>
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
          {/*
          TODO: add debouncer or rate-limiter
        */}
          <Split
            className={styles.workspace_root}
            sizes={[20, 80]}
            minSize={100}
            expandToMin={false}
            gutterSize={4}
            gutterAlign="center"
            snapOffset={0}
            dragInterval={0.5}
            direction="horizontal"
            cursor="ew-resize"
            ref={workspaceRootRef}
            onDrag={handleSplitDrag}
          >
            <div
              className={styles.sidebar_root}
            >
              <Explorer
                projectId={project_id}
                openFile={openFile}
              />
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
              onDrag={handleSplitDrag}
            >
              <div className={styles.editor_root}>
                <EditorActivityBar
                  tabs={tabs}
                  activeTabId={activeTabId}
                  setActiveTabId={setActiveTabId}
                  closeTab={closeTab}
                />

                <div className={styles.editor_container}>
                  <div className={styles.editor_pane}>
                    <Editor
                      tab={activeTab}
                      updateTabContent={updateTabContent}
                      saveFile={saveFile}
                    />
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
                  <XTerminal
                    terminalRef={termRef}
                    projectId={project_id}
                  />
                </div>
              </div>
            </Split>
          </Split>
        </main>
      </div>

      <div className={styles.confirmation_overlay}
        onClick={(e) => {
          if(e.target === e.currentTarget) {
            closeConfirmationPopup();
          }
        }}
      >
        <div
          className={styles.confirmation_popup}
          ref={confirmationPopupRef}
        >
          <div className={styles.confirmation_text}>
            Do you want to save and backup project before leaving?
          </div>

          <div className={styles.confirmation_btn_grp}>
            <button className={styles.confirmation_btn}>
              Yes
            </button>
            <button className={styles.confirmation_btn}>
              No
            </button>
            <button className={styles.confirmation_btn}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}