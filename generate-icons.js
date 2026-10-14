const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#7C3AED');
    
    // Rounded rectangle
    const radius = size * 0.15;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();
    
    // Letter "D"
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('D', size / 2, size / 2);
    
    // Checkmark
    ctx.strokeStyle = 'white';
    ctx.lineWidth = size * 0.025;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(size * 0.7, size * 0.75);
    ctx.lineTo(size * 0.78, size * 0.83);
    ctx.lineTo(size * 0.9, size * 0.7);
    ctx.stroke();
    
    return canvas;
}

// Generate icons
console.log('🎨 Генерация иконок PWA...');

const icon192 = drawIcon(192);
const icon512 = drawIcon(512);

const buffer192 = icon192.toBuffer('image/png');
const buffer512 = icon512.toBuffer('image/png');

fs.writeFileSync(path.join(__dirname, 'public', 'icon-192.png'), buffer192);
fs.writeFileSync(path.join(__dirname, 'public', 'icon-512.png'), buffer512);

console.log('✅ Иконки созданы:');
console.log('   - public/icon-192.png');
console.log('   - public/icon-512.png');
console.log('\n📝 Теперь выполните:');
console.log('   git add public/icon-*.png');
console.log('   git commit -m "Add PWA icons"');
console.log('   git push');
