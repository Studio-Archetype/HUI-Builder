const fs = require('fs');

const crcTable = new Uint32Array(256);

// Hex codes matrix
const matrixHexCodes = [
    "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
    "00 E6 00 E6 E6 00 E6 E6 00 E6 E6 00 00 E6 00 00",
    "00 E6 E6 E6 E6 E6 E6 E6 E6 E6 E6 E6 E6 E6 E6 00",
    "00 E6 E6 00 00 00 00 E6 00 00 00 E6 E6 E6 00 00",
    "00 E6 00 00 E6 E6 E6 E6 E6 E6 E6 00 E6 00 00 00",
    "00 00 00 00 E6 E6 E6 E6 E6 E6 E6 00 E6 00 00 00",
    "00 00 00 00 E6 E6 E6 E6 E6 E6 E6 00 E6 E6 00 00",
    "00 00 00 00 E6 00 00 00 00 00 00 00 E6 E6 00 00",
    "00 00 00 00 E6 00 00 00 00 00 00 00 E6 00 00 00",
    "00 E6 00 00 E6 E6 00 00 00 00 00 00 E6 00 00 00",
    "00 E6 00 00 E6 00 00 00 00 00 00 00 E6 00 00 00",
    "00 E6 00 00 E6 00 00 00 00 00 00 00 E6 00 00 00",
    "00 E6 00 00 00 E6 E6 00 00 00 00 00 E6 00 00 00",
    "00 E6 00 E6 E6 E6 00 E6 E6 00 E6 E6 E6 00 00 00",
    "00 E6 00 E6 00 00 00 00 00 00 00 00 E6 00 00 00",
    "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00"
];

// Convert the matrix to an array of hex codes to a png
const hexArray = matrixHexCodes
    .map(line => line.split(' '))
    .reduce((acc, line) => acc.concat(line), [])
    .map(hex => parseInt(hex, 16));

const pngData = createPng(hexArray, 16, 16);

// Write the png to a file
fs.writeFileSync('test.png', pngData);

function createPng(hexArray, width, height) {
    const data = new Buffer.alloc(hexArray.length * 4);
    for (let i = 0; i < hexArray.length; i++) {
        const hex = hexArray[i];
        data[i * 4] = hex; // Red channel
        data[i * 4 + 1] = hex; // Green channel
        data[i * 4 + 2] = hex; // Blue channel
        data[i * 4 + 3] = 255; // Alpha channel
    }

    const pngHeader = Buffer.from([
        137, 80, 78, 71, 13, 10, 26, 10 // PNG file signature
    ]);

    const ihdrChunk = createIHDRChunk(width, height);
    const idatChunk = createIDATChunk(data);
    const iendChunk = createIENDChunk();

    const chunks = [ihdrChunk, idatChunk, iendChunk];
    const pngData = Buffer.concat([pngHeader, ...chunks]);

    return pngData;
}

function createIHDRChunk(width, height) {
    const buffer = Buffer.alloc(13);
    buffer.writeUInt32BE(width, 0);
    buffer.writeUInt32BE(height, 4);
    buffer[8] = 8; // Bit depth
    buffer[9] = 2; // Color type (RGB)
    buffer[10] = 0; // Compression method
    buffer[11] = 0; // Filter method
    buffer[12] = 0; // Interlace method
    const crc = crc32(buffer.slice(4, 12));
    buffer.writeUInt32BE(crc, 12);
    return createChunk('IHDR', buffer);
}

function createIDATChunk(data) {
    const buffer = Buffer.alloc(data.length + 4);
    data.copy(buffer, 4);
    const crc = crc32(data);
    buffer.writeUInt32BE(crc, data.length);
    return createChunk('IDAT', buffer);
}

function createIENDChunk() {
    const buffer = Buffer.alloc(0);
    return createChunk('IEND', buffer);
}

function createChunk(type, data) {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32BE(data.length, 0);

    const typeBuffer = Buffer.from(type);

    const chunkBuffer = Buffer.concat([lengthBuffer, typeBuffer, data]);
    return chunkBuffer;
}

function crc32(buffer) {
    let crc = -1;
    for (let i = 0; i < buffer.length; i++) {
        crc = crcTable[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ -1) >>> 0;
}

for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
        if (c & 1) {
            c = 0xedb88320 ^ (c >>> 1);
        } else {
            c = c >>> 1;
        }
    }
    crcTable[i] = c;
}
