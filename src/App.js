import "./styles.css";
import { useState } from "react";
import { json } from "./data.js";

const List = ({ data, addNodeTree, deleteFolder }) => {
  const [isExpend, setIsExpand] = useState({});

  return (
    <div>
      {data.map((input) => (
        <div className="list" key={input.name}>
          {input?.isFolder && (
            <span
              onClick={() =>
                setIsExpand((prev) => ({
                  ...prev,
                  [input.name]: !prev[input.name],
                }))
              }
            >
              {" "}
              {isExpend?.[input.name] ? "+" : "-"}
            </span>
          )}
          <span>
            {input?.isFolder ? (
              <span>
                <span
                  onClick={() => {
                    addNodeTree(input?.id);
                  }}
                >
                  📁
                </span>
                <span onClick={() => deleteFolder(input?.id)}>❌</span>
              </span>
            ) : (
              <span>📄 </span>
            )}{" "}
            {input?.name}
          </span>
          {isExpend?.[input.name] && input?.children && (
            <List
              data={input?.children}
              addNodeTree={addNodeTree}
              deleteFolder={deleteFolder}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [data, setData] = useState(json);
  console.log(data);

  const addNodeTree = (parentId) => {
    const name = prompt("Enter a Name");
    const updateTree = (list) => {
      return list.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              { id: Date.now(), name: name, isFolder: true, children: [] },
            ],
          };
        }

        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }

        return node;
      });
    };

    setData((prev) => updateTree(prev));
  };

  const deleteFolder = (itemId) => {
    const updateTree = (list) => {
      return list
        .filter((node) => node.id !== itemId)
        .map((node) => {
          if (node.children) {
            return { ...node, children: updateTree(node.children) };
          }
          return node;
        });
    };

    setData((prev) => updateTree(prev));
  };

  return (
    <div className="App">
      <h1>File Explore</h1>
      <List data={data} addNodeTree={addNodeTree} deleteFolder={deleteFolder} />
    </div>
  );
}
