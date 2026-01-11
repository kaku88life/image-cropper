// Web version URL
const WEB_VERSION_URL = 'https://kaku88life.github.io/image-cropper/';

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const editorArea = document.getElementById('editorArea');
const openWebBtn = document.getElementById('openWebBtn');
const openWebLink = document.getElementById('openWebLink');

// Tab elements
const editTabBtn = document.getElementById('editTabBtn');
const resultTabBtn = document.getElementById('resultTabBtn');
const editTab = document.getElementById('editTab');
const resultTab = document.getElementById('resultTab');
const outputSize = document.getElementById('outputSize');

// Canvas elements
const canvasContainer = document.getElementById('canvasContainer');
const canvasWrapper = document.getElementById('canvasWrapper');
const mainCanvas = document.getElementById('mainCanvas');
const cropBox = document.getElementById('cropBox');
const removeImageBtn = document.getElementById('removeImageBtn');

// Crop settings
const lockRatioCheckbox = document.getElementById('lockRatio');
const ratioDropdownBtn = document.getElementById('ratioDropdownBtn');
const ratioDropdownMenu = document.getElementById('ratioDropdownMenu');
const currentRatioText = document.getElementById('currentRatio');
const customWidthInput = document.getElementById('customWidth');
const customHeightInput = document.getElementById('customHeight');
const applyCustomRatioBtn = document.getElementById('applyCustomRatio');

// Action buttons
const resetBtn = document.getElementById('resetBtn');
const completeBtn = document.getElementById('completeBtn');

// Result elements
const resultCloseBtn = document.getElementById('resultCloseBtn');
const resultImage = document.getElementById('resultImage');
const formatSelect = document.getElementById('formatSelect');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');

// Context
let mainCtx = null;

// State
let image = null;
let scale = 1;
let currentRatio = 16 / 10;
let targetDimensions = { width: 1280, height: 800 };
let currentResultCanvas = null;
let currentResultBlob = null;

// Ratio presets
const ratioDimensions = {
    '16:10': { width: 1280, height: 800 },
    '16:9': { width: 1920, height: 1080 },
    '4:3': { width: 1600, height: 1200 },
    '1:1': { width: 1080, height: 1080 },
    '3:2': { width: 1800, height: 1200 },
    '2:3': { width: 1200, height: 1800 },
    '9:16': { width: 1080, height: 1920 }
};

// Crop state
let cropState = { x: 0, y: 0, width: 0, height: 0 };
let isDragging = false;
let isResizing = false;
let activeHandle = null;
let dragStart = { x: 0, y: 0 };
let cropStart = { x: 0, y: 0, width: 0, height: 0 };

// Initialize
function init() {
    mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
    setupEventListeners();
    checkForStoredImage();
}

// Open web version
function openWebVersion() {
    chrome.tabs.create({ url: WEB_VERSION_URL });
}

// Check for stored image from context menu
function checkForStoredImage() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['imageToLoad'], (result) => {
            if (result.imageToLoad) {
                loadImageFromUrl(result.imageToLoad);
                chrome.storage.local.remove('imageToLoad');
                chrome.action.setBadgeText({ text: '' });
            }
        });
    }
}

function loadImageFromUrl(url) {
    const tempImage = new Image();
    tempImage.crossOrigin = 'anonymous';
    tempImage.onload = () => {
        ensureMinimumSize(tempImage, targetDimensions.width, targetDimensions.height, (finalImage) => {
            image = finalImage;
            showEditor();
        });
    };
    tempImage.onerror = () => console.error('Failed to load image');
    tempImage.src = url;
}

function setupEventListeners() {
    // Open web version
    openWebBtn.addEventListener('click', openWebVersion);
    openWebLink.addEventListener('click', (e) => {
        e.preventDefault();
        openWebVersion();
    });

    // Upload events
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
    document.addEventListener('paste', handlePaste);

    // Tab switching
    editTabBtn.addEventListener('click', () => switchTab('edit'));
    resultTabBtn.addEventListener('click', () => switchTab('result'));

    // Remove image
    removeImageBtn.addEventListener('click', resetToUpload);

    // Ratio dropdown
    ratioDropdownBtn.addEventListener('click', toggleRatioDropdown);
    document.querySelectorAll('.ratio-option:not(.custom-ratio-option)').forEach(option => {
        option.addEventListener('click', () => selectRatio(option));
    });
    applyCustomRatioBtn.addEventListener('click', applyCustomRatio);
    document.querySelectorAll('.custom-ratio-inputs, .lock-ratio-label').forEach(el => {
        el.addEventListener('click', (e) => e.stopPropagation());
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.ratio-dropdown-wrapper')) {
            ratioDropdownMenu.classList.remove('visible');
        }
    });

    // Crop box events
    cropBox.addEventListener('mousedown', handleCropMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Action buttons
    resetBtn.addEventListener('click', resetToUpload);
    completeBtn.addEventListener('click', showResult);

    // Result actions
    resultCloseBtn.addEventListener('click', () => switchTab('edit'));
    downloadBtn.addEventListener('click', downloadImage);
    copyBtn.addEventListener('click', copyImageToClipboard);

    // Result drag
    resultImage.addEventListener('dragstart', handleResultDragStart);
    resultImage.addEventListener('dragend', handleResultDragEnd);
}

// File handling
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadImage(file);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) loadImage(file);
}

function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            e.preventDefault();
            loadImage(item.getAsFile());
            break;
        }
    }
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const tempImage = new Image();
        tempImage.onload = () => {
            ensureMinimumSize(tempImage, targetDimensions.width, targetDimensions.height, (finalImage) => {
                image = finalImage;
                showEditor();
            });
        };
        tempImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function ensureMinimumSize(sourceImage, minWidth, minHeight, callback) {
    const scaleX = minWidth / sourceImage.width;
    const scaleY = minHeight / sourceImage.height;
    const requiredScale = Math.max(scaleX, scaleY);

    if (requiredScale <= 1) {
        callback(sourceImage);
        return;
    }

    const newWidth = Math.ceil(sourceImage.width * requiredScale);
    const newHeight = Math.ceil(sourceImage.height * requiredScale);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(sourceImage, 0, 0, newWidth, newHeight);

    const scaledImage = new Image();
    scaledImage.onload = () => callback(scaledImage);
    scaledImage.src = tempCanvas.toDataURL('image/png');
}

function showEditor() {
    uploadArea.classList.add('hidden');
    editorArea.classList.add('visible');
    setupCanvas();
}

function setupCanvas() {
    const maxWidth = 235;
    const maxHeight = 153;

    const scaleX = maxWidth / image.width;
    const scaleY = maxHeight / image.height;
    scale = Math.min(scaleX, scaleY, 1);

    const displayWidth = image.width * scale;
    const displayHeight = image.height * scale;

    mainCanvas.width = displayWidth;
    mainCanvas.height = displayHeight;

    canvasWrapper.style.width = displayWidth + 'px';
    canvasWrapper.style.height = displayHeight + 'px';

    mainCtx.drawImage(image, 0, 0, displayWidth, displayHeight);

    initCropBox();
    updateOutputSize();
}

function initCropBox() {
    const padding = 15;
    cropState.x = padding;
    cropState.y = padding;
    cropState.width = mainCanvas.width - padding * 2;
    cropState.height = mainCanvas.height - padding * 2;

    if (currentRatio) applyCropRatio();
    updateCropBox();
}

// Tab switching
function switchTab(tab) {
    editTabBtn.classList.toggle('active', tab === 'edit');
    resultTabBtn.classList.toggle('active', tab === 'result');
    editTab.classList.toggle('active', tab === 'edit');
    resultTab.classList.toggle('active', tab === 'result');
}

// Ratio functions
function toggleRatioDropdown(e) {
    e.stopPropagation();
    ratioDropdownMenu.classList.toggle('visible');
}

function selectRatio(option) {
    const ratio = option.dataset.ratio;

    document.querySelectorAll('.ratio-option').forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');

    if (ratio === 'free') {
        currentRatio = null;
        targetDimensions = null;
        currentRatioText.textContent = '自由裁切';
    } else {
        const [w, h] = ratio.split(':').map(Number);
        currentRatio = w / h;
        targetDimensions = ratioDimensions[ratio];
        currentRatioText.textContent = `${targetDimensions.width}×${targetDimensions.height}`;
    }

    if (image) {
        applyCropRatio();
        updateCropBox();
    }
    updateOutputSize();
    ratioDropdownMenu.classList.remove('visible');
}

function applyCustomRatio() {
    const width = parseInt(customWidthInput.value) || 1280;
    const height = parseInt(customHeightInput.value) || 800;
    if (width < 1 || height < 1) return;

    document.querySelectorAll('.ratio-option').forEach(opt => opt.classList.remove('active'));
    currentRatio = width / height;
    targetDimensions = { width, height };
    currentRatioText.textContent = `${width}×${height}`;

    if (image) {
        applyCropRatio();
        updateCropBox();
    }
    updateOutputSize();
    ratioDropdownMenu.classList.remove('visible');
}

function applyCropRatio() {
    if (!currentRatio) return;

    const canvasRatio = mainCanvas.width / mainCanvas.height;
    const centerX = cropState.x + cropState.width / 2;
    const centerY = cropState.y + cropState.height / 2;

    let newWidth, newHeight;
    if (currentRatio > canvasRatio) {
        newWidth = Math.min(cropState.width, mainCanvas.width - 10);
        newHeight = newWidth / currentRatio;
    } else {
        newHeight = Math.min(cropState.height, mainCanvas.height - 10);
        newWidth = newHeight * currentRatio;
    }

    cropState.width = newWidth;
    cropState.height = newHeight;
    cropState.x = centerX - newWidth / 2;
    cropState.y = centerY - newHeight / 2;

    constrainCropBox();
}

function updateCropBox() {
    cropBox.style.left = `${cropState.x}px`;
    cropBox.style.top = `${cropState.y}px`;
    cropBox.style.width = `${cropState.width}px`;
    cropBox.style.height = `${cropState.height}px`;
}

function constrainCropBox() {
    cropState.width = Math.max(30, Math.min(cropState.width, mainCanvas.width));
    cropState.height = Math.max(30, Math.min(cropState.height, mainCanvas.height));
    cropState.x = Math.max(0, Math.min(cropState.x, mainCanvas.width - cropState.width));
    cropState.y = Math.max(0, Math.min(cropState.y, mainCanvas.height - cropState.height));
}

function updateOutputSize() {
    if (targetDimensions) {
        outputSize.textContent = `${targetDimensions.width}×${targetDimensions.height}`;
    } else {
        const w = Math.round(cropState.width / scale);
        const h = Math.round(cropState.height / scale);
        outputSize.textContent = `${w}×${h}`;
    }
}

// Crop mouse handlers
function handleCropMouseDown(e) {
    e.preventDefault();

    if (e.target.classList.contains('crop-handle')) {
        isResizing = true;
        activeHandle = e.target.dataset.handle;
    } else {
        isDragging = true;
    }

    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    cropStart = { ...cropState };
}

function handleMouseMove(e) {
    if (isDragging || isResizing) {
        handleCropMove(e.clientX, e.clientY);
    }
}

function handleMouseUp() {
    isDragging = false;
    isResizing = false;
    activeHandle = null;
}

function handleCropMove(clientX, clientY) {
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;

    if (isDragging) {
        cropState.x = cropStart.x + dx;
        cropState.y = cropStart.y + dy;
        constrainCropBox();
    } else if (isResizing) {
        resizeCropBox(dx, dy);
    }

    updateCropBox();
    updateOutputSize();
}

function resizeCropBox(dx, dy) {
    const minSize = 30;
    let newX = cropStart.x, newY = cropStart.y;
    let newWidth = cropStart.width, newHeight = cropStart.height;
    const shouldLockRatio = lockRatioCheckbox.checked && currentRatio;

    switch (activeHandle) {
        case 'nw': newX = cropStart.x + dx; newY = cropStart.y + dy; newWidth = cropStart.width - dx; newHeight = cropStart.height - dy; break;
        case 'n': newY = cropStart.y + dy; newHeight = cropStart.height - dy; break;
        case 'ne': newY = cropStart.y + dy; newWidth = cropStart.width + dx; newHeight = cropStart.height - dy; break;
        case 'w': newX = cropStart.x + dx; newWidth = cropStart.width - dx; break;
        case 'e': newWidth = cropStart.width + dx; break;
        case 'sw': newX = cropStart.x + dx; newWidth = cropStart.width - dx; newHeight = cropStart.height + dy; break;
        case 's': newHeight = cropStart.height + dy; break;
        case 'se': newWidth = cropStart.width + dx; newHeight = cropStart.height + dy; break;
    }

    newWidth = Math.max(minSize, newWidth);
    newHeight = Math.max(minSize, newHeight);

    if (shouldLockRatio) {
        if (['n', 's'].includes(activeHandle)) newWidth = newHeight * currentRatio;
        else if (['e', 'w'].includes(activeHandle)) newHeight = newWidth / currentRatio;
        else {
            if (Math.abs(dx) > Math.abs(dy)) newHeight = newWidth / currentRatio;
            else newWidth = newHeight * currentRatio;
        }
        if (['nw', 'n', 'ne'].includes(activeHandle)) newY = cropStart.y + cropStart.height - newHeight;
        if (['nw', 'w', 'sw'].includes(activeHandle)) newX = cropStart.x + cropStart.width - newWidth;
    }

    // Constrain to canvas
    if (newX < 0) { newWidth += newX; newX = 0; if (shouldLockRatio) newHeight = newWidth / currentRatio; }
    if (newY < 0) { newHeight += newY; newY = 0; if (shouldLockRatio) newWidth = newHeight * currentRatio; }
    if (newX + newWidth > mainCanvas.width) { newWidth = mainCanvas.width - newX; if (shouldLockRatio) newHeight = newWidth / currentRatio; }
    if (newY + newHeight > mainCanvas.height) { newHeight = mainCanvas.height - newY; if (shouldLockRatio) newWidth = newHeight * currentRatio; }

    if (newWidth >= minSize) { cropState.x = newX; cropState.width = newWidth; }
    if (newHeight >= minSize) { cropState.y = newY; cropState.height = newHeight; }
}

// Result
function showResult() {
    currentResultCanvas = generateResultCanvas();
    if (!currentResultCanvas) return;

    const mimeType = getFormatInfo(formatSelect.value).mimeType;
    currentResultCanvas.toBlob((blob) => {
        currentResultBlob = blob;
    }, mimeType, 0.9);

    resultImage.src = currentResultCanvas.toDataURL('image/png');
    resultTabBtn.disabled = false;
    switchTab('result');
}

function generateResultCanvas() {
    if (!image) return null;

    const actualX = cropState.x / scale;
    const actualY = cropState.y / scale;
    const actualWidth = cropState.width / scale;
    const actualHeight = cropState.height / scale;

    const finalWidth = targetDimensions ? targetDimensions.width : Math.round(actualWidth);
    const finalHeight = targetDimensions ? targetDimensions.height : Math.round(actualHeight);

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = finalWidth;
    outputCanvas.height = finalHeight;
    const outputCtx = outputCanvas.getContext('2d', { willReadFrequently: true });

    outputCtx.imageSmoothingEnabled = true;
    outputCtx.imageSmoothingQuality = 'high';
    outputCtx.drawImage(image, actualX, actualY, actualWidth, actualHeight, 0, 0, finalWidth, finalHeight);

    return outputCanvas;
}

// Reset
function resetToUpload() {
    image = null;
    currentResultCanvas = null;
    currentResultBlob = null;
    fileInput.value = '';

    document.querySelectorAll('.ratio-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.ratio === '16:10') opt.classList.add('active');
    });
    currentRatioText.textContent = '1280×800';
    currentRatio = 16 / 10;
    targetDimensions = { width: 1280, height: 800 };

    uploadArea.classList.remove('hidden');
    editorArea.classList.remove('visible');
    resultTabBtn.disabled = true;
    switchTab('edit');
}

// Result drag
function handleResultDragStart(e) {
    if (!currentResultCanvas) return;
    resultImage.classList.add('dragging');

    const { mimeType, extension } = getFormatInfo(formatSelect.value);
    const dataUrl = currentResultCanvas.toDataURL(mimeType, 0.9);
    const filename = `cropped-image.${extension}`;

    e.dataTransfer.effectAllowed = 'copyMove';

    let fileAdded = false;
    if (currentResultBlob && e.dataTransfer.items) {
        try {
            const file = new File([currentResultBlob], filename, { type: mimeType });
            e.dataTransfer.items.add(file);
            fileAdded = true;
        } catch (err) {
            console.log('Could not add file:', err);
        }
    }

    e.dataTransfer.setData('DownloadURL', `${mimeType}:${filename}:${dataUrl}`);
    if (!fileAdded) {
        e.dataTransfer.setData('text/uri-list', dataUrl);
    }

    e.dataTransfer.setDragImage(resultImage, resultImage.width / 2, resultImage.height / 2);
}

function handleResultDragEnd() {
    resultImage.classList.remove('dragging');
}

// Export
function getFormatInfo(format) {
    const formats = {
        'png': { mimeType: 'image/png', extension: 'png' },
        'jpeg': { mimeType: 'image/jpeg', extension: 'jpg' },
        'webp': { mimeType: 'image/webp', extension: 'webp' }
    };
    return formats[format] || formats['png'];
}

function downloadImage() {
    if (!currentResultCanvas) return;
    const { mimeType, extension } = getFormatInfo(formatSelect.value);
    const link = document.createElement('a');
    link.download = `cropped-image.${extension}`;
    link.href = currentResultCanvas.toDataURL(mimeType, 0.9);
    link.click();
}

async function copyImageToClipboard() {
    if (!currentResultCanvas) return;
    try {
        const blob = await (await fetch(currentResultCanvas.toDataURL('image/png'))).blob();
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        copyBtn.style.color = '#22c55e';
        copyBtn.style.borderColor = '#22c55e';
        setTimeout(() => { copyBtn.style.color = ''; copyBtn.style.borderColor = ''; }, 1500);
    } catch (err) {
        console.error('Copy failed:', err);
        copyBtn.style.color = '#ef4444';
        copyBtn.style.borderColor = '#ef4444';
        setTimeout(() => { copyBtn.style.color = ''; copyBtn.style.borderColor = ''; }, 1500);
    }
}

// Initialize
init();
