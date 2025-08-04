import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $isElementNode,
  $createParagraphNode,
  $getSelection,
  KEY_BACKSPACE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from 'lexical';

const CleanupEmptyCodePlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Cleanup on updates (removes empty code blocks)
    const removeEmptyCodeOnUpdate = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        root.getChildren().forEach((node) => {
          if (node.getType() === 'code' && $isElementNode(node)) {
            const text = node.getTextContent();
            if (text.trim() === '') {
              node.replace($createParagraphNode());
            }
          }
        });
      });
    });

    // Handle backspace inside empty code blocks
    const backspaceHandler = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      () => {
        const selection = $getSelection();
        const node = selection?.getNodes()[0];
        const parent = node?.getParent();
        if (parent?.getType() === 'code' && parent.getTextContent().trim() === '') {
          parent.replace($createParagraphNode());
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeEmptyCodeOnUpdate();
      backspaceHandler();
    };
  }, [editor]);

  return null;
};

export default CleanupEmptyCodePlugin;
