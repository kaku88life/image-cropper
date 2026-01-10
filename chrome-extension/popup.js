// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const toolbar = document.getElementById('toolbar');
const canvasContainer = document.getElementById('canvasContainer');
const canvasWrapper = document.getElementById('canvasWrapper');
const mainCanvas = document.getElementById('mainCanvas');
const drawCanvas = document.getElementById('drawCanvas');
const cropBox = document.getElementById('cropBox');
const cropSize = document.getElementById('cropSize');
const cropInfo = document.getElementById('cropInfo');
const changeImageBtn = document.getElementById('changeImageBtn');
const removeImageBtn = document.getElementById('removeImageBtn');
const formatSelect = document.getElementById('formatSelect');
const completeBtn = document.getElementById('completeBtn');
const resultSection = document.getElementById('resultSection');
const resultImage = document.getElementById('resultImage');
const resultFormatSelect = document.getElementById('resultFormatSelect');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');

// Draw tools elements
const drawTools = document.getElementById('drawTools');
const drawOptions = document.getElementById('drawOptions');
const colorPicker = document.getElementById('colorPicker');
const strokeWidth = document.getElementById('strokeWidth');
const strokePreview = document.getElementById('strokePreview');
const fillShape = document.getElementById('fillShape');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const clearBtn = document.getElementById('clearBtn');

// Text input elements
const textInputContainer = document.getElementById('textInputContainer');
const textInput = document.getElementById('textInput');
const textConfirm = document.getElementById('textConfirm');
const textCancel = document.getElementById('textCancel');

// Ratio dropdown elements
const ratioDropdownBtn = document.getElementById('ratioDropdownBtn');
const ratioDropdownMenu = document.getElementById('ratioDropdownMenu');
const customWidthInput = document.getElementById('customWidth');
const customHeightInput = document.getElementById('customHeight');
const applyCustomRatioBtn = document.getElementById('applyCustomRatio');

// Tool dropdown elements
const penDropdownBtn = document.getElementById('penDropdownBtn');
const penMenu = document.getElementById('penMenu');
const penIcon = document.getElementById('penIcon');
const shapeDropdownBtn = document.getElementById('shapeDropdownBtn');
const shapeMenu = document.getElementById('shapeMenu');
const shapeIcon = document.getElementById('shapeIcon');

// Contexts
let mainCtx = null;
let drawCtx = null;

// State
let image = null;
let scale = 1;
let currentMode = 'crop';
let currentShape = 'pen';
let currentRatio = 16 / 10; // Default: 16:10 (1280x800)

// Target output dimensions (exact size for export)
let targetDimensions = { width: 1280, height: 800 }; // Default: 1280x800

// Predefined target dimensions for each ratio
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

// Draw state
let isDrawing = false;
let drawStart = { x: 0, y: 0 };
let drawHistory = [];
let redoHistory = [];
let penPoints = [];
let textPosition = { x: 0, y: 0 };
let currentResultCanvas = null;

// Initialize
function init() {
    mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
    drawCtx = drawCanvas.getContext('2d', { willReadFrequently: true });
    setupEventListeners();
    checkForStoredImage();
}

// Check if there's a stored image from context menu
function checkForStoredImage() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['imageToLoad'], (result) => {
            if (result.imageToLoad) {
                loadImageFromUrl(result.imageToLoad);
                // Clear the stored image and badge
                chrome.storage.local.remove('imageToLoad');
                chrome.action.setBadgeText({ text: '' });
            }
        });
    }
}

// Load image from URL
function loadImageFromUrl(url) {
    const tempImage = new Image();
    tempImage.crossOrigin = 'anonymous';
    tempImage.onload = () => {
        ensureMinimumSize(tempImage, targetDimensions.width, targetDimensions.height, (finalImage) => {
            image = finalImage;
            showEditor();
            setupCanvas();
        });
    };
    tempImage.onerror = () => {
        console.error('Failed to load image from URL');
    };
    tempImage.src = url;
}

function setupEventListeners() {
    // Upload events
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
    document.addEventListener('paste', handlePaste);

    // Mode selection
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.tool));
    });

    // Shape selection
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => setShape(btn.dataset.shape));
    });

    // Ratio dropdown
    ratioDropdownBtn.addEventListener('click', toggleRatioDropdown);
    document.querySelectorAll('.ratio-option:not(.custom-ratio-option)').forEach(option => {
        option.addEventListener('click', () => selectRatio(option));
    });

    // Custom ratio
    if (applyCustomRatioBtn) {
        applyCustomRatioBtn.addEventListener('click', applyCustomRatio);
    }
    // Prevent dropdown close when clicking inside custom inputs
    document.querySelectorAll('.custom-ratio-inputs').forEach(el => {
        el.addEventListener('click', (e) => e.stopPropagation());
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.ratio-dropdown-wrapper')) {
            ratioDropdownMenu.classList.remove('visible');
            ratioDropdownBtn.classList.remove('active');
        }
        if (!e.target.closest('#penDropdown')) {
            penMenu.classList.remove('visible');
            penDropdownBtn.classList.remove('active');
        }
        if (!e.target.closest('#shapeDropdown')) {
            shapeMenu.classList.remove('visible');
            shapeDropdownBtn.classList.remove('active');
        }
    });

    // Pen dropdown
    penDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        penMenu.classList.toggle('visible');
        penDropdownBtn.classList.toggle('active');
        shapeMenu.classList.remove('visible');
        shapeDropdownBtn.classList.remove('active');
    });

    // Pen options
    penMenu.querySelectorAll('.tool-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const shape = option.dataset.shape;
            setShape(shape);
            penIcon.innerHTML = option.innerHTML;
            penMenu.classList.remove('visible');
            penDropdownBtn.classList.remove('active');
            penDropdownBtn.classList.add('active');
            shapeDropdownBtn.classList.remove('active');
            penMenu.querySelectorAll('.tool-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Shape dropdown
    shapeDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shapeMenu.classList.toggle('visible');
        shapeDropdownBtn.classList.toggle('active');
        penMenu.classList.remove('visible');
        penDropdownBtn.classList.remove('active');
    });

    // Shape options
    shapeMenu.querySelectorAll('.tool-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const shape = option.dataset.shape;
            setShape(shape);
            shapeIcon.innerHTML = option.innerHTML;
            shapeMenu.classList.remove('visible');
            shapeDropdownBtn.classList.remove('active');
            shapeDropdownBtn.classList.add('active');
            penDropdownBtn.classList.remove('active');
            shapeMenu.querySelectorAll('.tool-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Crop box events
    cropBox.addEventListener('mousedown', handleCropMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Draw canvas events
    drawCanvas.addEventListener('mousedown', handleDrawMouseDown);

    // Action buttons
    undoBtn.addEventListener('click', undoLastDraw);
    redoBtn.addEventListener('click', redoLastDraw);
    clearBtn.addEventListener('click', clearAllDrawings);
    changeImageBtn.addEventListener('click', resetToUpload);
    removeImageBtn.addEventListener('click', resetToUpload);

    // Stroke width preview
    strokeWidth.addEventListener('input', updateStrokePreview);
    colorPicker.addEventListener('input', updateStrokePreview);
    updateStrokePreview();

    // Text input
    textConfirm.addEventListener('click', confirmText);
    textCancel.addEventListener('click', cancelText);

    // Export
    completeBtn.addEventListener('click', showResult);
    downloadBtn.addEventListener('click', downloadImage);
    copyBtn.addEventListener('click', copyImageToClipboard);

    // Canvas drag-drop for replacing image
    canvasContainer.addEventListener('dragover', handleCanvasDragOver);
    canvasContainer.addEventListener('dragleave', handleCanvasDragLeave);
    canvasContainer.addEventListener('drop', handleCanvasDrop);

    // Result image drag events
    if (resultImage) {
        resultImage.addEventListener('dragstart', handleResultDragStart);
        resultImage.addEventListener('dragend', handleResultDragEnd);
    }
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
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
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
            const file = item.getAsFile();
            if (file) loadImage(file);
            break;
        }
    }
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const tempImage = new Image();
        tempImage.onload = () => {
            // Check if image needs to be scaled up for the default ratio (16:10 = 1280x800)
            ensureMinimumSize(tempImage, 1280, 800, (finalImage) => {
                image = finalImage;
                showEditor();
                setupCanvas();
            });
        };
        tempImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Canvas drag-drop handlers for replacing image
function handleCanvasDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    canvasContainer.classList.add('drag-over');
}

function handleCanvasDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    canvasContainer.classList.remove('drag-over');
}

function handleCanvasDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    canvasContainer.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        // Clear existing drawings and load new image
        drawHistory = [];
        redoHistory = [];
        updateUndoRedoButtons();
        resultSection.classList.remove('visible');
        currentResultCanvas = null;
        loadImage(files[0]);
    }
}

// Result image drag handlers
function handleResultDragStart(e) {
    if (!currentResultCanvas || !resultImage) return;

    resultImage.classList.add('dragging');

    // Get format settings
    const format = resultFormatSelect.value;
    const { mimeType, extension } = getFormatInfo(format);
    const quality = 0.9;

    // Create data URL for the image
    const dataUrl = currentResultCanvas.toDataURL(mimeType, quality);
    const filename = `edited-image.${extension}`;

    // Set drag data for external applications (Chrome/Chromium)
    e.dataTransfer.effectAllowed = 'copy';

    // DownloadURL format allows dragging to desktop/file explorer
    // Format: mime-type:filename:data-url
    e.dataTransfer.setData('DownloadURL', `${mimeType}:${filename}:${dataUrl}`);
    e.dataTransfer.setData('text/uri-list', dataUrl);
    e.dataTransfer.setData('text/plain', dataUrl);

    // Set drag image
    e.dataTransfer.setDragImage(resultImage, resultImage.width / 2, resultImage.height / 2);
}

function handleResultDragEnd(e) {
    if (!resultImage) return;
    resultImage.classList.remove('dragging');
}

// Ensure image is large enough for the target crop dimensions
function ensureMinimumSize(sourceImage, minWidth, minHeight, callback) {
    const imgWidth = sourceImage.width;
    const imgHeight = sourceImage.height;

    // Calculate required scale to meet minimum dimensions
    const scaleX = minWidth / imgWidth;
    const scaleY = minHeight / imgHeight;
    const requiredScale = Math.max(scaleX, scaleY);

    // If image is already large enough, return as-is
    if (requiredScale <= 1) {
        callback(sourceImage);
        return;
    }

    // Scale up the image
    const newWidth = Math.ceil(imgWidth * requiredScale);
    const newHeight = Math.ceil(imgHeight * requiredScale);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    const tempCtx = tempCanvas.getContext('2d');

    // Use better interpolation for upscaling
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(sourceImage, 0, 0, newWidth, newHeight);

    // Create new image from scaled canvas
    const scaledImage = new Image();
    scaledImage.onload = () => {
        callback(scaledImage);
    };
    scaledImage.src = tempCanvas.toDataURL('image/png');
}

function showEditor() {
    uploadArea.classList.add('hidden');
    toolbar.classList.add('visible');
    canvasContainer.classList.add('visible');
    canvasContainer.classList.add('crop-mode');
    cropInfo.classList.add('visible');
    completeBtn.disabled = false;
}

function resetToUpload() {
    image = null;
    uploadArea.classList.remove('hidden');
    toolbar.classList.remove('visible');
    canvasContainer.classList.remove('visible');
    canvasContainer.classList.remove('crop-mode');
    canvasContainer.classList.remove('draw-mode');
    cropInfo.classList.remove('visible');
    completeBtn.disabled = true;
    resultSection.classList.remove('visible');
    currentResultCanvas = null;
    fileInput.value = '';
    drawHistory = [];
    redoHistory = [];

    // Reset mode
    setMode('crop');

    // Reset ratio to 16:10 (default)
    document.querySelectorAll('.ratio-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.ratio === '16:10') opt.classList.add('active');
    });
    document.querySelector('.current-ratio').textContent = '1280×800';
    currentRatio = 16 / 10;
    targetDimensions = { width: 1280, height: 800 };
}

function setupCanvas() {
    const maxWidth = 396;
    const maxHeight = 220;

    const scaleX = maxWidth / image.width;
    const scaleY = maxHeight / image.height;
    scale = Math.min(scaleX, scaleY, 1);

    const displayWidth = image.width * scale;
    const displayHeight = image.height * scale;

    mainCanvas.width = displayWidth;
    mainCanvas.height = displayHeight;
    drawCanvas.width = displayWidth;
    drawCanvas.height = displayHeight;

    drawCanvas.style.width = displayWidth + 'px';
    drawCanvas.style.height = displayHeight + 'px';

    // Set wrapper size to match canvas
    canvasWrapper.style.width = displayWidth + 'px';
    canvasWrapper.style.height = displayHeight + 'px';

    mainCtx.drawImage(image, 0, 0, displayWidth, displayHeight);

    initCropBox();
    clearDrawCanvas();
}

function initCropBox() {
    const padding = 20;
    cropState.x = padding;
    cropState.y = padding;
    cropState.width = mainCanvas.width - padding * 2;
    cropState.height = mainCanvas.height - padding * 2;

    if (currentRatio) applyCropRatio();
    updateCropBox();
}

// Stroke preview update
function updateStrokePreview() {
    const size = Math.min(parseInt(strokeWidth.value), 24);
    const color = colorPicker.value;
    strokePreview.style.setProperty('--preview-size', size + 'px');
    strokePreview.style.setProperty('--preview-color', color);
    strokePreview.innerHTML = `<span style="width:${size}px;height:${size}px;background:${color};border-radius:50%;"></span>`;
}

// Mode handling
function setMode(mode) {
    currentMode = mode;

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === mode);
    });

    canvasContainer.classList.toggle('crop-mode', mode === 'crop');
    canvasContainer.classList.toggle('draw-mode', mode === 'draw');

    drawTools.classList.toggle('visible', mode === 'draw');
    drawOptions.classList.toggle('visible', mode === 'draw');

    if (mode === 'draw' && !document.querySelector('.tool-btn.active')) {
        setShape('pen');
    }
}

function setShape(shape) {
    currentShape = shape;
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.shape === shape);
    });
    // 更新填色桶游標樣式
    canvasContainer.classList.toggle('fill-mode', shape === 'fill');

    // 更新下拉選單的 active 狀態
    const penTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter'];
    const shapeTypes = ['rect', 'circle', 'arrow', 'line'];

    penDropdownBtn.classList.toggle('active', penTypes.includes(shape));
    shapeDropdownBtn.classList.toggle('active', shapeTypes.includes(shape));
}

// Ratio dropdown handling
function toggleRatioDropdown(e) {
    e.stopPropagation();
    ratioDropdownMenu.classList.toggle('visible');
    ratioDropdownBtn.classList.toggle('active');
}

function selectRatio(option) {
    const ratio = option.dataset.ratio;

    document.querySelectorAll('.ratio-option').forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');

    // Apply ratio and set target dimensions
    if (ratio === 'free') {
        currentRatio = null;
        targetDimensions = null;
        document.querySelector('.current-ratio').textContent = '自由裁切';
    } else {
        const [w, h] = ratio.split(':').map(Number);
        currentRatio = w / h;
        targetDimensions = ratioDimensions[ratio] || { width: w * 100, height: h * 100 };
        document.querySelector('.current-ratio').textContent = `${targetDimensions.width}×${targetDimensions.height}`;
    }

    if (image) {
        applyCropRatio();
        updateCropBox();
    }

    ratioDropdownMenu.classList.remove('visible');
    ratioDropdownBtn.classList.remove('active');
}

function applyCustomRatio() {
    const width = parseInt(customWidthInput.value) || 1280;
    const height = parseInt(customHeightInput.value) || 800;

    if (width < 1 || height < 1) return;

    document.querySelectorAll('.ratio-option').forEach(opt => opt.classList.remove('active'));

    currentRatio = width / height;
    targetDimensions = { width, height };
    document.querySelector('.current-ratio').textContent = `${width}×${height}`;

    if (image) {
        applyCropRatio();
        updateCropBox();
    }

    ratioDropdownMenu.classList.remove('visible');
    ratioDropdownBtn.classList.remove('active');
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

// Crop box manipulation
function updateCropBox() {
    cropBox.style.left = `${cropState.x}px`;
    cropBox.style.top = `${cropState.y}px`;
    cropBox.style.width = `${cropState.width}px`;
    cropBox.style.height = `${cropState.height}px`;

    // Show target output size if set, otherwise show actual crop dimensions
    if (targetDimensions) {
        cropSize.textContent = `${targetDimensions.width} × ${targetDimensions.height}`;
    } else {
        // Free crop - show actual dimensions
        const actualWidth = Math.round(cropState.width / scale);
        const actualHeight = Math.round(cropState.height / scale);
        cropSize.textContent = `${actualWidth} × ${actualHeight}`;
    }
}

function constrainCropBox() {
    // 先確保尺寸不超過畫布
    cropState.width = Math.max(30, Math.min(cropState.width, mainCanvas.width));
    cropState.height = Math.max(30, Math.min(cropState.height, mainCanvas.height));
    // 再約束位置
    cropState.x = Math.max(0, Math.min(cropState.x, mainCanvas.width - cropState.width));
    cropState.y = Math.max(0, Math.min(cropState.y, mainCanvas.height - cropState.height));
}

// Crop mouse events
function handleCropMouseDown(e) {
    if (currentMode !== 'crop') return;
    e.preventDefault();
    const target = e.target;

    if (target.classList.contains('crop-handle')) {
        isResizing = true;
        activeHandle = target.dataset.handle;
    } else {
        isDragging = true;
    }

    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    cropStart = { ...cropState };
}

// Draw mouse events
function handleDrawMouseDown(e) {
    if (currentMode !== 'draw') return;
    e.preventDefault();

    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentShape === 'text') {
        showTextInput(x, y);
        return;
    }

    if (currentShape === 'fill') {
        applyFillBucket(x, y);
        return;
    }

    drawStart.x = x;
    drawStart.y = y;
    isDrawing = true;
    penPoints = [{ x, y }];

    redoHistory = [];
    updateUndoRedoButtons();
}

// Unified mouse move
function handleMouseMove(e) {
    if (currentMode === 'crop' && (isDragging || isResizing)) {
        handleCropMove(e.clientX, e.clientY);
    } else if (currentMode === 'draw' && isDrawing) {
        const rect = drawCanvas.getBoundingClientRect();
        handleDrawMove(e.clientX - rect.left, e.clientY - rect.top);
    }
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
}

function handleDrawMove(x, y) {
    const penTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter'];
    if (penTypes.includes(currentShape)) {
        penPoints.push({ x, y });
    }

    clearDrawCanvas();
    redrawHistory();

    const color = colorPicker.value;
    const lineWidth = parseInt(strokeWidth.value);
    const fill = fillShape.checked;

    if (penTypes.includes(currentShape)) {
        drawPenStroke(drawCtx, penPoints, color, lineWidth, currentShape);
    } else {
        drawShape(drawCtx, currentShape, drawStart.x, drawStart.y, x, y, color, lineWidth, fill);
    }
}

// Mouse up
function handleMouseUp(e) {
    if (currentMode === 'crop') {
        isDragging = false;
        isResizing = false;
        activeHandle = null;
    } else if (currentMode === 'draw' && isDrawing) {
        const rect = drawCanvas.getBoundingClientRect();
        finalizeDrawing(e.clientX - rect.left, e.clientY - rect.top);
    }
}

function finalizeDrawing(endX, endY) {
    if (!isDrawing) return;
    isDrawing = false;

    const color = colorPicker.value;
    const lineWidth = parseInt(strokeWidth.value);
    const fill = fillShape.checked;
    const penTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter'];

    if (penTypes.includes(currentShape)) {
        drawHistory.push({
            shape: currentShape,
            points: [...penPoints],
            color,
            lineWidth,
            penType: currentShape
        });
    } else {
        drawHistory.push({
            shape: currentShape,
            x1: drawStart.x,
            y1: drawStart.y,
            x2: endX,
            y2: endY,
            color,
            lineWidth,
            fill
        });
    }

    clearDrawCanvas();
    redrawHistory();

    penPoints = [];
    updateUndoRedoButtons();
}

// Crop resize
function resizeCropBox(dx, dy) {
    const minSize = 30;
    let newX = cropStart.x;
    let newY = cropStart.y;
    let newWidth = cropStart.width;
    let newHeight = cropStart.height;

    switch (activeHandle) {
        case 'nw':
            newX = cropStart.x + dx;
            newY = cropStart.y + dy;
            newWidth = cropStart.width - dx;
            newHeight = cropStart.height - dy;
            break;
        case 'n':
            newY = cropStart.y + dy;
            newHeight = cropStart.height - dy;
            break;
        case 'ne':
            newY = cropStart.y + dy;
            newWidth = cropStart.width + dx;
            newHeight = cropStart.height - dy;
            break;
        case 'w':
            newX = cropStart.x + dx;
            newWidth = cropStart.width - dx;
            break;
        case 'e':
            newWidth = cropStart.width + dx;
            break;
        case 'sw':
            newX = cropStart.x + dx;
            newWidth = cropStart.width - dx;
            newHeight = cropStart.height + dy;
            break;
        case 's':
            newHeight = cropStart.height + dy;
            break;
        case 'se':
            newWidth = cropStart.width + dx;
            newHeight = cropStart.height + dy;
            break;
    }

    // 自由調整，不鎖定比例
    // 確保最小尺寸
    newWidth = Math.max(minSize, newWidth);
    newHeight = Math.max(minSize, newHeight);

    // 確保不超出畫布邊界
    if (newX < 0) {
        newWidth += newX;
        newX = 0;
    }
    if (newY < 0) {
        newHeight += newY;
        newY = 0;
    }
    if (newX + newWidth > mainCanvas.width) {
        newWidth = mainCanvas.width - newX;
    }
    if (newY + newHeight > mainCanvas.height) {
        newHeight = mainCanvas.height - newY;
    }

    // 再次確保最小尺寸
    if (newWidth >= minSize) {
        cropState.x = newX;
        cropState.width = newWidth;
    }
    if (newHeight >= minSize) {
        cropState.y = newY;
        cropState.height = newHeight;
    }
}

// Text input handling
function showTextInput(x, y) {
    textPosition = { x, y };
    textInputContainer.style.left = `${x}px`;
    textInputContainer.style.top = `${y}px`;
    textInputContainer.classList.add('visible');
    textInput.value = '';
    textInput.focus();
}

function confirmText() {
    const text = textInput.value.trim();
    if (text) {
        const color = colorPicker.value;
        const fontSize = parseInt(strokeWidth.value) * 4 + 12;

        drawHistory.push({
            shape: 'text',
            text,
            x: textPosition.x,
            y: textPosition.y,
            color,
            fontSize
        });

        clearDrawCanvas();
        redrawHistory();
        updateUndoRedoButtons();
    }
    cancelText();
}

function cancelText() {
    textInputContainer.classList.remove('visible');
    textInput.value = '';
}

// Drawing functions
function clearDrawCanvas() {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
}

function redrawHistory() {
    const penTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter'];
    for (const item of drawHistory) {
        if (penTypes.includes(item.shape)) {
            drawPenStroke(drawCtx, item.points, item.color, item.lineWidth, item.penType || item.shape);
        } else if (item.shape === 'text') {
            drawText(drawCtx, item.text, item.x, item.y, item.color, item.fontSize);
        } else if (item.shape === 'fillBucket') {
            // 重新繪製填充區域
            if (item.imageData) {
                const currentData = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
                const fillData = item.imageData.data;
                const currData = currentData.data;
                for (let i = 0; i < fillData.length; i += 4) {
                    if (fillData[i + 3] > 0) {
                        currData[i] = fillData[i];
                        currData[i + 1] = fillData[i + 1];
                        currData[i + 2] = fillData[i + 2];
                        currData[i + 3] = fillData[i + 3];
                    }
                }
                drawCtx.putImageData(currentData, 0, 0);
            }
        } else {
            drawShape(drawCtx, item.shape, item.x1, item.y1, item.x2, item.y2, item.color, item.lineWidth, item.fill);
        }
    }
}

function drawPenStroke(ctx, points, color, lineWidth, penType) {
    if (points.length < 2) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (penType) {
        case 'pen':
            // 鉛筆 - 細緻、一致的線條
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = 0.9;
            drawSmoothLine(ctx, points);
            break;

        case 'marker':
            // 簽字筆 - 粗、飽和、略帶壓感
            ctx.lineWidth = lineWidth * 1.5;
            ctx.globalAlpha = 1;
            ctx.lineCap = 'square';
            drawSmoothLine(ctx, points);
            break;

        case 'watercolor':
            // 水彩筆 - 半透明、柔和、有暈染效果
            ctx.globalAlpha = 0.3;
            for (let w = lineWidth * 2; w > 0; w -= 2) {
                ctx.lineWidth = w;
                ctx.globalAlpha = 0.1 + (1 - w / (lineWidth * 2)) * 0.2;
                drawSmoothLine(ctx, points);
            }
            break;

        case 'crayon':
            // 蠟筆 - 有紋理、不規則邊緣
            ctx.lineWidth = lineWidth * 1.2;
            ctx.globalAlpha = 0.85;
            // 繪製多層來模擬蠟筆紋理
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(points[0].x + (Math.random() - 0.5) * 2, points[0].y + (Math.random() - 0.5) * 2);
                for (let j = 1; j < points.length; j++) {
                    const jitter = (Math.random() - 0.5) * (lineWidth * 0.3);
                    ctx.lineTo(points[j].x + jitter, points[j].y + jitter);
                }
                ctx.stroke();
            }
            break;

        case 'highlighter':
            // 螢光筆 - 寬、半透明
            ctx.lineWidth = lineWidth * 3;
            ctx.globalAlpha = 0.4;
            ctx.lineCap = 'square';
            drawSmoothLine(ctx, points);
            break;

        default:
            ctx.lineWidth = lineWidth;
            drawSmoothLine(ctx, points);
    }

    ctx.restore();
}

function drawSmoothLine(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
}

// 填色桶功能 - Flood Fill
function applyFillBucket(x, y) {
    const color = colorPicker.value;
    const tolerance = 32; // 顏色容差

    // 合併主畫布和繪圖畫布
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = mainCanvas.width;
    tempCanvas.height = mainCanvas.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.drawImage(mainCanvas, 0, 0);
    tempCtx.drawImage(drawCanvas, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;
    const width = tempCanvas.width;
    const height = tempCanvas.height;

    const startX = Math.floor(x);
    const startY = Math.floor(y);

    if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

    const startIdx = (startY * width + startX) * 4;
    const startColor = {
        r: data[startIdx],
        g: data[startIdx + 1],
        b: data[startIdx + 2],
        a: data[startIdx + 3]
    };

    // 解析填充顏色
    const fillColor = hexToRgb(color);
    if (!fillColor) return;

    // 如果起始顏色和填充顏色相同，不填充
    if (colorsMatch(startColor, { ...fillColor, a: 255 }, 5)) return;

    // Flood fill 演算法
    const visited = new Set();
    const stack = [[startX, startY]];

    while (stack.length > 0) {
        const [cx, cy] = stack.pop();
        const key = `${cx},${cy}`;

        if (visited.has(key)) continue;
        if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;

        const idx = (cy * width + cx) * 4;
        const currentColor = {
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2],
            a: data[idx + 3]
        };

        if (!colorsMatch(startColor, currentColor, tolerance)) continue;

        visited.add(key);

        // 填充顏色
        data[idx] = fillColor.r;
        data[idx + 1] = fillColor.g;
        data[idx + 2] = fillColor.b;
        data[idx + 3] = 255;

        // 添加相鄰像素
        stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    // 將填充結果繪製到繪圖畫布
    const resultCanvas = document.createElement('canvas');
    resultCanvas.width = width;
    resultCanvas.height = height;
    const resultCtx = resultCanvas.getContext('2d');
    resultCtx.putImageData(imageData, 0, 0);

    // 只保留填充的部分（與原始不同的像素）
    const originalData = tempCtx.getImageData(0, 0, width, height).data;
    const fillData = drawCtx.getImageData(0, 0, width, height);
    const fd = fillData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i] !== originalData[i] || data[i + 1] !== originalData[i + 1] ||
            data[i + 2] !== originalData[i + 2]) {
            fd[i] = data[i];
            fd[i + 1] = data[i + 1];
            fd[i + 2] = data[i + 2];
            fd[i + 3] = 255;
        }
    }

    drawCtx.putImageData(fillData, 0, 0);

    // 記錄到歷史
    drawHistory.push({
        shape: 'fillBucket',
        imageData: drawCtx.getImageData(0, 0, width, height),
        x: startX,
        y: startY,
        color
    });

    redoHistory = [];
    updateUndoRedoButtons();
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colorsMatch(c1, c2, tolerance) {
    return Math.abs(c1.r - c2.r) <= tolerance &&
           Math.abs(c1.g - c2.g) <= tolerance &&
           Math.abs(c1.b - c2.b) <= tolerance &&
           Math.abs(c1.a - c2.a) <= tolerance;
}

function drawText(ctx, text, x, y, color, fontSize) {
    ctx.save();
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';

    const lines = text.split('\n');
    lines.forEach((line, index) => {
        ctx.fillText(line, x, y + index * fontSize * 1.2);
    });
    ctx.restore();
}

function drawShape(ctx, shape, x1, y1, x2, y2, color, lineWidth, fill) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    const width = maxX - minX;
    const height = maxY - minY;

    switch (shape) {
        case 'rect':
            if (fill) {
                ctx.fillRect(minX, minY, width, height);
            } else {
                ctx.strokeRect(minX, minY, width, height);
            }
            break;

        case 'circle':
            const centerX = minX + width / 2;
            const centerY = minY + height / 2;
            const radiusX = width / 2;
            const radiusY = height / 2;
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            if (fill) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
            break;

        case 'line':
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            break;

        case 'arrow':
            drawArrow(ctx, x1, y1, x2, y2, lineWidth);
            break;

        case 'mosaic':
            applyMosaic(ctx, minX, minY, width, height);
            break;

        case 'blur':
            applyBlur(ctx, minX, minY, width, height);
            break;
    }
}

function drawArrow(ctx, x1, y1, x2, y2, lineWidth) {
    const headLength = Math.max(lineWidth * 3, 12);
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function applyMosaic(ctx, x, y, width, height) {
    if (width < 5 || height < 5) return;

    const canvasX = Math.max(0, Math.floor(x));
    const canvasY = Math.max(0, Math.floor(y));
    const canvasW = Math.min(Math.floor(width), mainCanvas.width - canvasX);
    const canvasH = Math.min(Math.floor(height), mainCanvas.height - canvasY);

    if (canvasW <= 0 || canvasH <= 0) return;

    const blockSize = 8;
    const imageData = mainCtx.getImageData(canvasX, canvasY, canvasW, canvasH);
    const data = imageData.data;

    for (let py = 0; py < canvasH; py += blockSize) {
        for (let px = 0; px < canvasW; px += blockSize) {
            let r = 0, g = 0, b = 0, count = 0;

            for (let dy = 0; dy < blockSize && py + dy < canvasH; dy++) {
                for (let dx = 0; dx < blockSize && px + dx < canvasW; dx++) {
                    const i = ((py + dy) * canvasW + (px + dx)) * 4;
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }
            }

            if (count > 0) {
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(canvasX + px, canvasY + py,
                    Math.min(blockSize, canvasW - px),
                    Math.min(blockSize, canvasH - py));
            }
        }
    }
}

function applyBlur(ctx, x, y, width, height) {
    if (width < 5 || height < 5) return;

    const canvasX = Math.max(0, Math.floor(x));
    const canvasY = Math.max(0, Math.floor(y));
    const canvasW = Math.min(Math.floor(width), mainCanvas.width - canvasX);
    const canvasH = Math.min(Math.floor(height), mainCanvas.height - canvasY);

    if (canvasW <= 0 || canvasH <= 0) return;

    const imageData = mainCtx.getImageData(canvasX, canvasY, canvasW, canvasH);
    const data = imageData.data;
    const blurRadius = 4;

    const output = new Uint8ClampedArray(data);

    for (let py = 0; py < canvasH; py++) {
        for (let px = 0; px < canvasW; px++) {
            let r = 0, g = 0, b = 0, count = 0;

            for (let dy = -blurRadius; dy <= blurRadius; dy++) {
                for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                    const ny = py + dy;
                    const nx = px + dx;
                    if (ny >= 0 && ny < canvasH && nx >= 0 && nx < canvasW) {
                        const i = (ny * canvasW + nx) * 4;
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        count++;
                    }
                }
            }

            const i = (py * canvasW + px) * 4;
            output[i] = Math.round(r / count);
            output[i + 1] = Math.round(g / count);
            output[i + 2] = Math.round(b / count);
            output[i + 3] = data[i + 3];
        }
    }

    const blurredData = new ImageData(output, canvasW, canvasH);
    ctx.putImageData(blurredData, canvasX, canvasY);
}

// Undo, Redo, and clear
function undoLastDraw() {
    if (drawHistory.length > 0) {
        const item = drawHistory.pop();
        redoHistory.push(item);
        clearDrawCanvas();
        redrawHistory();
        updateUndoRedoButtons();
    }
}

function redoLastDraw() {
    if (redoHistory.length > 0) {
        const item = redoHistory.pop();
        drawHistory.push(item);
        clearDrawCanvas();
        redrawHistory();
        updateUndoRedoButtons();
    }
}

function clearAllDrawings() {
    drawHistory = [];
    redoHistory = [];
    clearDrawCanvas();
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    undoBtn.disabled = drawHistory.length === 0;
    redoBtn.disabled = redoHistory.length === 0;
}

// Export
function generateResultCanvas() {
    if (!image) return null;

    // Calculate crop area in original image coordinates
    const actualX = cropState.x / scale;
    const actualY = cropState.y / scale;
    const actualWidth = cropState.width / scale;
    const actualHeight = cropState.height / scale;

    // Determine final output dimensions
    const finalWidth = targetDimensions ? targetDimensions.width : Math.round(actualWidth);
    const finalHeight = targetDimensions ? targetDimensions.height : Math.round(actualHeight);

    // Create temporary canvas for cropping at original resolution
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = actualWidth;
    tempCanvas.height = actualHeight;

    // Draw original image cropped
    tempCtx.drawImage(
        image,
        actualX, actualY, actualWidth, actualHeight,
        0, 0, actualWidth, actualHeight
    );

    // Draw drawings scaled to crop area
    if (drawHistory.length > 0) {
        const penTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter'];
        for (const item of drawHistory) {
            tempCtx.save();

            if (penTypes.includes(item.shape)) {
                const scaledPoints = item.points.map(p => ({
                    x: (p.x - cropState.x) / scale,
                    y: (p.y - cropState.y) / scale
                }));
                drawPenStroke(tempCtx, scaledPoints, item.color, item.lineWidth / scale, item.penType || item.shape);
            } else if (item.shape === 'text') {
                const scaledX = (item.x - cropState.x) / scale;
                const scaledY = (item.y - cropState.y) / scale;
                drawText(tempCtx, item.text, scaledX, scaledY, item.color, item.fontSize / scale);
            } else if (item.shape === 'fillBucket' && item.imageData) {
                // 繪製填充區域，按比例縮放
                const fillCanvas = document.createElement('canvas');
                fillCanvas.width = item.imageData.width;
                fillCanvas.height = item.imageData.height;
                const fillCtx = fillCanvas.getContext('2d');
                fillCtx.putImageData(item.imageData, 0, 0);

                // 計算裁切區域在填充畫布中的位置
                const srcX = cropState.x;
                const srcY = cropState.y;
                const srcW = cropState.width;
                const srcH = cropState.height;

                tempCtx.drawImage(fillCanvas, srcX, srcY, srcW, srcH, 0, 0, actualWidth, actualHeight);
            } else {
                const scaledX1 = (item.x1 - cropState.x) / scale;
                const scaledY1 = (item.y1 - cropState.y) / scale;
                const scaledX2 = (item.x2 - cropState.x) / scale;
                const scaledY2 = (item.y2 - cropState.y) / scale;
                drawShape(tempCtx, item.shape, scaledX1, scaledY1, scaledX2, scaledY2, item.color, item.lineWidth / scale, item.fill);
            }

            tempCtx.restore();
        }
    }

    // Create final output canvas at exact target dimensions
    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d');
    outputCanvas.width = finalWidth;
    outputCanvas.height = finalHeight;

    // Use high quality interpolation for resizing
    outputCtx.imageSmoothingEnabled = true;
    outputCtx.imageSmoothingQuality = 'high';

    // Draw the cropped image scaled to exact target dimensions
    outputCtx.drawImage(tempCanvas, 0, 0, finalWidth, finalHeight);

    return outputCanvas;
}

function getFormatInfo(format) {
    const formats = {
        'png': { mimeType: 'image/png', extension: 'png' },
        'jpeg': { mimeType: 'image/jpeg', extension: 'jpg' },
        'webp': { mimeType: 'image/webp', extension: 'webp' }
    };
    return formats[format] || formats['png'];
}

function showResult() {
    currentResultCanvas = generateResultCanvas();
    if (!currentResultCanvas) return;

    // 同步格式選擇器
    resultFormatSelect.value = formatSelect.value;

    // 顯示預覽圖（使用 PNG 以保持品質）
    resultImage.src = currentResultCanvas.toDataURL('image/png');
    resultSection.classList.add('visible');

    // 滾動到結果區域
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function downloadImage() {
    if (!currentResultCanvas) return;

    const format = resultFormatSelect.value;
    const { mimeType, extension } = getFormatInfo(format);
    const quality = 0.9;

    const dataUrl = currentResultCanvas.toDataURL(mimeType, quality);
    const link = document.createElement('a');
    link.download = `edited-image.${extension}`;
    link.href = dataUrl;
    link.click();
}

async function copyImageToClipboard() {
    if (!currentResultCanvas) return;

    try {
        // 使用 PNG 格式複製（剪貼簿相容性最好）
        const dataUrl = currentResultCanvas.toDataURL('image/png');
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        // 複製到剪貼簿
        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ]);

        // 顯示成功提示（改變按鈕樣式）
        copyBtn.style.color = '#22c55e';
        copyBtn.style.borderColor = '#22c55e';
        setTimeout(() => {
            copyBtn.style.color = '';
            copyBtn.style.borderColor = '';
        }, 1500);
    } catch (err) {
        console.error('複製失敗:', err);
        // 顯示失敗提示
        copyBtn.style.color = '#ef4444';
        copyBtn.style.borderColor = '#ef4444';
        setTimeout(() => {
            copyBtn.style.color = '';
            copyBtn.style.borderColor = '';
        }, 1500);
    }
}

// Initialize
init();
