function downloadURL(data, fileName) {
  const a = document.createElement('a')
  a.href = data
  a.download = fileName
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function downloadBlob(data, fileName, mimeType) {
  let blob = new Blob([data], {
    type: mimeType
  });
  let url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(function () {
    return window.URL.revokeObjectURL(url);
  }, 1000);
};

export {
  downloadURL,
  downloadBlob,
}