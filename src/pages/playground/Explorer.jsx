import { Tree } from 'react-arborist';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAxiosPrivate } from '../../utils/useAxiosPrivate';

import styles from './Explorer.module.css';

const NodeRenderer = ({ node, style, dragHandle, onRightClick, createNewNode, removeNode, openFile }) => {
  /* This node instance can do many things. See the API reference. */
  const [name, setName] = useState('');
  const inputRef = useRef();

  if (node.data.isEditing) {
    return (
      <div
        style={style}
        ref={dragHandle}
        className={styles.node_row}
      >
        <div className={styles.guide_lines_container}>
          {Array.from({ length: node.level }).map((_, i) => {
            if (i === 0) return;

            const left = 14 + i * 24;
            return <div key={i} className={styles.guide_line} style={{ left }} />;
          })}
        </div>

        <div
          className={styles.input_grp}
        >
          <span>
            {
              node.isLeaf ?
                <ion-icon name="document-text-outline" /> :
                <ion-icon name="chevron-forward-outline" />
            }

            <input
              autoFocus
              value={name}
              name='temp_input'
              onChange={(e) => setName(e.target.value)}
              ref={inputRef}
              onClick={(e) => e.target.focus()}
              onKeyDown={(e) => {
                e.stopPropagation();

                if (e.key === 'Enter') {
                  createNewNode(node, name);
                }

                if (e.key === 'Escape') {
                  removeNode(node);
                }
              }}
              onBlur={() => {
                removeNode(node);
              }}
            />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      ref={dragHandle}
      className={styles.node_row}
      onDoubleClick={() => node.isLeaf && openFile(node)}
    >
      {/*
        this draws the guide lines for better understanding of
        what is inside the folder and what is not
      */}
      <div className={styles.guide_lines_container}>
        {Array.from({ length: node.level }).map((_, i) => {
          if (i === 0) return;

          const left = 14 + i * 24;
          return <div key={i} className={styles.guide_line} style={{ left }} />;
        })}
      </div>


      <div
        className={styles.node_content}
        onContextMenu={onRightClick}
        onClick={() => node.isInternal && node.toggle()}
      >
        {
          node.isLeaf ?
            <LeafNode node={node} openFile={openFile} /> :
            <NonLeafNode node={node} />
        }
      </div>
    </div>
  );
}

const LeafNode = ({ node }) => {
  return (
    <span>
      <ion-icon name="document-text-outline" />
      <div>{node.data.name}</div>
    </span>
  );
}

const NonLeafNode = ({ node }) => {
  return (
    <span>
      {
        node.isOpen ?
          <ion-icon name="chevron-down-outline" /> :
          <ion-icon name="chevron-forward-outline" />
      } {node.data.name}
    </span>
  );
}

const ContextMenu = ({ x, y, onClose, node, handleNewNodeCreate, handleNodeRemove }) => {
  return (
    <div
      className={styles.right_click_menu_overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onContextMenu={(e) => {
        e.preventDefault();

        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={styles.right_click_menu}
        style={{ transform: `translate(${x}px, ${y}px)`, }}
      >
        <ul
          className={styles.menu_options_container}
        >
          {
            node.isInternal &&
            <>
              <li
                onClick={() => handleNewNodeCreate('FOLDER')}
              >New Folder...
              </li>

              <li
                onClick={() => handleNewNodeCreate('FILE')}
              >
                New File...
              </li>
              <hr />
            </>
          }
          {
            node.level !== 0 &&
            <li
              onClick={() => {
                handleNodeRemove(node);

                onClose();
              }}
            >Delete</li>
          }
        </ul>
      </div>
    </div>
  );
}

export const Explorer = ({ projectId, openFile }) => {
  const [data, setData] = useState([]);
  const [rightClickMenu, setRightClickMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    node: null,
  });
  const treeRef = useRef();
  const axiosPrivateInstance = useAxiosPrivate();

  useEffect(() => {
    axiosPrivateInstance.get(
      `/api/v1/projects/${projectId}`
    )
      .then((res) => {
        if (res.status === 200) {
          setData([res.data]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);


  const handleContextMenu = (e, node) => {
    e.preventDefault();

    setRightClickMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      node: node,
    });
  };

  const closeMenu = () => setRightClickMenu({ ...rightClickMenu, isOpen: false });

  const handleNewNodeCreate = (type) => {
    const newNode = {
      id: `temp-${Date.now()}`,
      name: "",
      isEditing: true,
      children: type === 'FOLDER' ? [] : null,
      type
    };

    // opens the node if it's collapased
    rightClickMenu.node.open();

    const newData = addChildToData(data, rightClickMenu.node.id, newNode);
    setData(newData);

    // scroll to the newly made temp node for better ux
    treeRef.current.scrollTo(newNode.id);

    closeMenu();
  }

  const addChildToData = (list, parentId, newNode) => {
    return list.map(
      (node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newNode]
          };
        }

        if (node.children) {
          return {
            ...node,
            children: addChildToData(node.children, parentId, newNode)
          };
        }

        return node;
      }
    );
  }

  const replaceTempNode = (list, tempId, newNode) => {
    return list.map((node) => {
      if (tempId === node.id) {
        return {
          ...newNode,
          children: node.children ? [] : null
        };
      }

      if (node.children) {
        return {
          ...node,
          children: replaceTempNode(node.children, tempId, newNode)
        };
      }

      return node;
    });
  }

  const createNewNode = (node, name) => {
    if(node.level === 0) return;

    const subPath = node.data.type === 'FOLDER' ? 'folders' : 'files';
    const hash = node.parent.level === 0 ? null : node.parent.id;

    axiosPrivateInstance.post(
      `/api/v1/projects/${projectId}/` + subPath,
      {
        hash: hash,
        name: name
      }
    )
      .then((res) => {
        if (res.status !== 201) return;

        const newNode = {
          id: res.data.id,
          name: name,
          chlidren: node.children,
          type: node.data.type,
        };

        const newData = replaceTempNode(data, node.id, newNode);

        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const removeNodeFromData = (list, idToRemove) => {
    return list
      .filter((node) => node.id !== idToRemove)
      .map((node) => {
        if (node.children) {
          return {
            ...node,
            children: removeNodeFromData(node.children, idToRemove)
          }
        }

        return node;
      });
  }

  const handleNodeRemove = (node) => {
    const subPath = node.data.type === 'FOLDER' ? 'folders' : 'files';
    const hash = node.parent.level === 0 ? null : node.parent.id;

    axiosPrivateInstance.delete(
      `/api/v1/projects/${projectId}/` + subPath + `/${node.data.name}?parent_id=${hash}`,
    )
      .then((res) => {
        if (res.status !== 202) return;

        const newData = removeNodeFromData(data, node.id);

        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div
      className={styles.explorer_root}
    >
      <div className={styles.title}>
        Explorer
      </div>

      <div className={styles.tree_root}>
        <Tree
          data={data}
          openByDefault={false}
          indent={24}
          rowHeight={36}
          overscanCount={5} // decides how many extra non-visible rows are rendered above and below
          paddingTop={30}
          paddingBottom={10}
          disableDrag={true}
          padding={0}
          className={styles.tree}
          ref={treeRef}
        >
          {(props) => (
            <NodeRenderer
              {...props}
              onRightClick={(e) => handleContextMenu(e, props.node)}
              createNewNode={createNewNode}
              removeNode={handleNodeRemove}
              openFile={openFile}
            />
          )}
        </Tree>

        {rightClickMenu.isOpen && createPortal(
          <ContextMenu
            x={rightClickMenu.x}
            y={rightClickMenu.y}
            onClose={closeMenu}
            node={rightClickMenu.node}
            handleNewNodeCreate={handleNewNodeCreate}
            handleNodeRemove={handleNodeRemove}
          />,
          document.body
        )}
      </div>
    </div>
  );
}
