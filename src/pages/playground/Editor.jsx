import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { useState } from 'react';

import styles from './Editor.module.css';

export const Editor = () => {
  const [value, setValue] = useState(
    `int main() {\n\tstd::cout << "hello, mortals.";\n\n\treturn 0;\n}`
  );

  return (
    <CodeMirror
      value={value}
      extensions={[cpp()]}
      theme={tokyoNight}
      onChange={(value) => {
        setValue(value);
      }}
      className={styles.editor}
    />
  );
}