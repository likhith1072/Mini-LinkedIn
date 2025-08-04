

export const lexicalToHtml = (lexicalData) => {
    if (!lexicalData || !lexicalData.root || !lexicalData.root.children) {
      return '<p>No content available</p>';
    }

    const formatTextNode = (node) => {
      let text = node.text;
      if ((node.format & 1) !== 0) text = `<strong>${text}</strong>`;     // bold
      if ((node.format & 2) !== 0) text = `<em>${text}</em>`;             // italic
      if ((node.format & 4) !== 0) text = `<u>${text}</u>`;               // underline
      if ((node.format & 8) !== 0) text = `<s>${text}</s>`;               // strikethrough
      return text;
    };

    const escapeHtml = (str) => {
      return str
        .replace(/&/g, '&amp;')   // Escape & to &amp;
        .replace(/</g, '&lt;')    // Escape < to &lt;
        .replace(/>/g, '&gt;')    // Escape > to &gt;
        .replace(/"/g, '&quot;')  // Escape " to &quot;
        .replace(/'/g, '&#039;'); // Escape ' to &#039;
    };

    const getAlignmentClass = (node) => {
      switch (node.format) {
        case 'center':
          return 'text-center';
        case 'right':
          return 'text-right';
        case 'left':
        default:
          return 'text-left';
      }
    };
  
    const nodeToHtml = (node) => {
      if (!node || !node.type) return '';

  
      // let children = '';
      // if (node.children && node.children.length) {
      //   children = node.children.map(traverse).join('');
      // }

      // Recursively handle nodes
    const children = node.children?.map(nodeToHtml).join('') || '';

      switch (node.type) {
        case 'text':
          return formatTextNode(node);
        case 'paragraph':
          return `<p class="${getAlignmentClass(node)}">${children}</p>`;
        case 'heading':
          return `<${node.tag} class="${getAlignmentClass(node)}">${children}</${node.tag}>`;
        case 'list':
          const listTag = node.listType === 'bullet' ? 'ul' : 'ol';
          return `<${listTag}>${children}</${listTag}>`;
        case 'listitem':
          return `<li>${children}</li>`;
        case 'quote':
          return `<blockquote class="${getAlignmentClass(node)}">${children}</blockquote>`;
        case 'link':
            return `<a href="${node.url}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">${children}</a>`;
        case 'code': {
              const rawLines = node.children?.map(child => child.text || '').join('\n') || '';
              return `
            <div class="code-block relative group">
             <button class="copy-btn bg-gray-400 rounded-md p-1 absolute top-10 right-2 text-sm cursor-pointer" onclick="copyCode(this)">Copy</button>           
              <pre>
                <code class="bg-gray-300 w-full m-2 p-4 text-gray-700" style="white-space: pre-wrap;">${escapeHtml(rawLines)}</code>
              </pre>
              </div>`;
            }
            
        default:
          // console.warn('Unhandled node type:', node.type, node);
          return '';
      }
    };
  
    return lexicalData.root.children.map(nodeToHtml).join('');
  };
  