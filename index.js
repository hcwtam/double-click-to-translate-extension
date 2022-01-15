function logSelection(event) {
    const selection = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd);
  }
  
  document.addEventListener('mouseup', (event) => {
    console.log('Selected text:', window.getSelection().toString());
    console.log(window.getSelection().getRangeAt(0).getBoundingClientRect());
  });
  