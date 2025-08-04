// src/components/ToolbarPlugin.jsx
import React from "react";
import {useState,useEffect} from "react";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  $createParagraphNode,
  $getRoot,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $createCodeNode } from '@lexical/code';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  // ✅ Format Text Handler
  const formatText = (formatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };

  // ✅ Insert Heading Properly
  const insertHeading = (tag) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection?.isCollapsed()) {
        console.warn("Cannot insert heading with active selection.");
        return;
      }
      const root = $getRoot();
      const headingNode = $createHeadingNode(tag);
      root.append(headingNode);
      headingNode.select();
    });
  };

  
  // const insertCodeBlock = () => {
  //   editor.update(() => {
  //     const selection = $getSelection();
  //     if (selection?.isCollapsed()) {
  //       const codeNode = $createCodeNode();
  //       const root = $getRoot();
  //       root.append(codeNode);
  //       codeNode.select(); // Move cursor into the code block
  //     }else {
  //       console.warn("Code block cannot be inserted with an active selection.");
  //     }
  //   });
  // };
  const insertCodeBlock = () => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const codeNode = $createCodeNode(); // Create a code block node
      selection.insertNodes([codeNode]);
      codeNode.select(); // Move cursor into the code block
    }
  });
};



  const [showLinkModal, setShowLinkModal] = useState(false);
  const [url, setUrl] = useState("");

  const handleSaveLink = () => {
    if (url) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          // Apply the link to the selected text
          editor.dispatchCommand(TOGGLE_LINK_COMMAND,{url});
          console.log("Link applied!");

          setUrl("");
          setShowLinkModal(false);
        } else {
          alert("Please select some text to add a link.");
        }
      });
    }
  };

  const toggleLinkInput = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        setShowLinkModal(true);
      } else {
        alert("Please select some text to add a link.");
      }
    });
  };
  

  return (
    <div className="flex flex-wrap gap-2 mb-4 bg-gray-100  p-2 rounded-md shadow-sm sticky top-0 z-10">
      {/* ✅ Inline Formatting */}

      <button
        onClick={() => formatText("bold")}
        type="button"
        className="btn-toolbar font-bold cursor-pointer p-1"
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => formatText("italic")}
        type="button"
        className="btn-toolbar italic cursor-pointer p-1"
        title="Italic"
      >
        I
      </button>
      <button
        onClick={() => formatText("underline")}
        type="button"
        className="btn-toolbar underline cursor-pointer p-1"
        title="Underline"
      >
        U
      </button>
      <button
        onClick={() => formatText("strikethrough")}
        type="button"
        className="btn-toolbar line-through cursor-pointer p-1"
        title="Strikethrough"
      >
        S
      </button>

      {/* ✅ Headings */}
      <button
        onClick={() => insertHeading("h1")}
        type="button"
        className="btn-toolbar font-bold text-xl cursor-pointer"
        title="H1"
      >
        H1
      </button>
      <button
        onClick={() => insertHeading("h2")}
        type="button"
        className="btn-toolbar font-bold text-lg cursor-pointer"
        title="H2"
      >
        H2
      </button>
      <button
        onClick={() => insertHeading("h3")}
        type="button"
        className="btn-toolbar font-bold text-md cursor-pointer"
        title="H3"
      >
        H3
      </button>

        {/* ✅ Code Block */}
        <button
        onClick={() => insertCodeBlock()}
        type="button"
        className="btn-toolbar cursor-pointer"
        title="Insert Code Block"
      >
        &#x1F4C8; 
      </button>

      {/* ✅ Text Alignment */}
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        type="button"
        className="btn-toolbar cursor-pointer"
        title="Align Left"
      >
        ⬅️
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        type="button"
        className="btn-toolbar cursor-pointer"
        title="Align Center"
      >
        ⏺️
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        type="button"
        className="btn-toolbar cursor-pointer"
        title="Align Right"
      >
        ➡️
      </button>
      <button
        onClick={toggleLinkInput}
        type="button"
        className="btn-toolbar cursor-pointer"
        title="Add Link"
      >
        🔗
      </button>

      {showLinkModal && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-4 rounded z-50 border w-80">
          <h3 className="font-semibold mb-2">Insert Link</h3>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-2 border rounded mb-3"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowLinkModal(false)}
              className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveLink}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 