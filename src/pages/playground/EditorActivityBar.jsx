import { useState } from 'react';
import { useAxiosPrivate } from '../../utils/useAxiosPrivate';

import styles from './EditorActivityBar.module.css';

const EditorTab = ({ tab, active, setActiveTabId, closeTab }) => {
  return (
    <div
      className={active ? `${styles.tab} ${styles.editor_selected_tab}` : styles.tab}
      onClick={() => setActiveTabId(tab.id)}
    >
      <span>
        {tab.name}
        {tab.unsaved && "*"}
      </span>
      <span className={styles.close_btn}
        onClick={(e) => {
          e.stopPropagation();

          closeTab(tab.id)
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon s-ion-icon" viewBox="0 0 512 512" stroke-width="40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M256 112v288M400 256H112"></path>
        </svg>
      </span>
    </div>
  );
}

export const EditorActivityBar = ({ tabs, activeTabId, setActiveTabId, closeTab }) => {
  return (
    <div className={styles.editor_toolbar}>
      <div className={styles.toolbar_tabs}>
        {
          tabs.map(
            tab => (
              <EditorTab
                key={tab.id}
                tab={tab}
                active={tab.id === activeTabId}
                setActiveTabId={setActiveTabId}
                onClick={() => setActiveTabId(tab.id)}
                closeTab={closeTab}
              />
            )
          )
        }
      </div>
    </div>
  );
}
