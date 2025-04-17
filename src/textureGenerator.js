// Create a texture for floor
const createFloorTexture = () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 512;
  
  // Fill background with light gray
  context.fillStyle = '#f5f5f5';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add grid lines
  context.strokeStyle = '#e0e0e0';
  context.lineWidth = 2;
  
  // Vertical lines
  for (let x = 0; x <= canvas.width; x += canvas.width / 8) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
  
  // Horizontal lines
  for (let y = 0; y <= canvas.height; y += canvas.height / 8) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }
  
  return canvas.toDataURL();
};

// Export the floor texture as an image
const floorTextureDataUrl = createFloorTexture();
const floorTextureImg = new Image();
floorTextureImg.src = floorTextureDataUrl;

// Create a link to download the image
const downloadLink = document.createElement('a');
downloadLink.href = floorTextureDataUrl;
downloadLink.download = 'floor-texture.jpg';
downloadLink.style.display = 'none';
document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);
