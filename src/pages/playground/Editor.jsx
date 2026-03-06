import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { keymap } from '@uiw/react-codemirror';

import styles from './Editor.module.css';

export const Editor = ({tab, updateTabContent, saveFile}) => {
  if (!tab) return null;

  const saveKeymap = keymap.of([
    {
      key: "Ctrl-s",
      run: () => {
        saveFile();

        return true;
      }
    },
  ]);

  return (
    <CodeMirror
      key={tab.id}
      value={tab.content}
      extensions={[cpp(), saveKeymap]}
      theme={tokyoNight}
      onChange={(value) => updateTabContent(value)}
      className={styles.editor}
    />
  );
}