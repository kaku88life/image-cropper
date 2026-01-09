// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const toolbar = document.getElementById('toolbar');
const canvasContainer = document.getElementById('canvasContainer');
const canvasWrapper = document.getElementById('canvasWrapper');
const mainCanvas = document.getElementById('mainCanvas');
const drawCanvas = document.getElementById('drawCanvas');
const resetAllBtn = document.getElementById('resetAllBtn');
const cropBox = document.getElementById('cropBox');
const cropSize = document.getElementById('cropSize');
const cropInfo = document.getElementById('cropInfo');
const changeImageBtn = document.getElementById('changeImageBtn');
const formatSelect = document.getElementById('formatSelect');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const qualitySelect = document.getElementById('qualitySelect');
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
const strokeValue = document.getElementById('strokeValue');
const fillShape = document.getElementById('fillShape');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const clearDrawBtn = document.getElementById('clearDrawBtn');

// Text input elements
const textInputContainer = document.getElementById('textInputContainer');
const textInput = document.getElementById('textInput');
const textConfirm = document.getElementById('textConfirm');
const textCancel = document.getElementById('textCancel');

// Ratio dropdown elements
const ratioDropdownBtn = document.getElementById('ratioDropdownBtn');
const ratioDropdownMenu = document.getElementById('ratioDropdownMenu');
const customWidth = document.getElementById('customWidth');
const customHeight = document.getElementById('customHeight');
const applyCustomRatio = document.getElementById('applyCustomRatio');

// Contexts
let mainCtx = null;
let drawCtx = null;

// State
let image = null;
let scale = 1;
let currentMode = 'crop'; // 'crop' or 'draw'
let currentShape = 'rect';
let currentRatio = 16 / 10; // Default: 16:10 (1280x800)

// Target output dimensions (exact size for export)
let targetDimensions = { width: 1280, height: 800 }; // Default: 1280x800
let imageOffset = { x: 0, y: 0 };

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
let currentDrawing = null;
let penPoints = []; // For freehand drawing
let textPosition = { x: 0, y: 0 };
let currentResultCanvas = null;

// Initialize
function init() {
    mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
    drawCtx = drawCanvas.getContext('2d', { willReadFrequently: true });
    setupEventListeners();
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
    document.querySelectorAll('[data-tool]').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.tool));
    });

    // Shape selection
    document.querySelectorAll('[data-shape]').forEach(btn => {
        btn.addEventListener('click', () => setShape(btn.dataset.shape));
    });

    // Ratio dropdown
    ratioDropdownBtn.addEventListener('click', toggleRatioDropdown);
    document.querySelectorAll('.ratio-option').forEach(option => {
        option.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-ratio-inputs')) {
                selectRatio(option);
            }
        });
    });
    applyCustomRatio.addEventListener('click', applyCustomRatioValue);

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.ratio-dropdown-wrapper')) {
            ratioDropdownMenu.classList.remove('visible');
            ratioDropdownBtn.classList.remove('active');
        }
    });

    // Crop box events
    cropBox.addEventListener('mousedown', handleCropMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Touch events
    cropBox.addEventListener('touchstart', handleCropTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    // Draw canvas events
    drawCanvas.addEventListener('mousedown', handleDrawMouseDown);
    drawCanvas.addEventListener('touchstart', handleDrawTouchStart);

    // Draw options
    strokeWidth.addEventListener('input', () => {
        strokeValue.textContent = strokeWidth.value;
    });

    // Action buttons
    undoBtn.addEventListener('click', undoLastDraw);
    redoBtn.addEventListener('click', redoLastDraw);
    clearDrawBtn.addEventListener('click', clearAllDrawings);
    changeImageBtn.addEventListener('click', resetToUpload);
    resetAllBtn.addEventListener('click', resetAllSettings);

    // Text input
    textConfirm.addEventListener('click', confirmText);
    textCancel.addEventListener('click', cancelText);

    // Export events
    formatSelect.addEventListener('change', handleFormatChange);
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
    });
    completeBtn.addEventListener('click', showResult);
    downloadBtn.addEventListener('click', downloadImage);
    copyBtn.addEventListener('click', copyImageToClipboard);

    // Canvas drag-drop for replacing image
    canvasContainer.addEventListener('dragover', handleCanvasDragOver);
    canvasContainer.addEventListener('dragleave', handleCanvasDragLeave);
    canvasContainer.addEventListener('drop', handleCanvasDrop);
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
    updateRatioButton('16:10', '▬', '1280×800 (16:10)');
    currentRatio = 16 / 10;
    targetDimensions = { width: 1280, height: 800 };
}

function resetAllSettings() {
    // Reset ratio to default (16:10)
    document.querySelectorAll('.ratio-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.ratio === '16:10') opt.classList.add('active');
    });
    updateRatioButton('16:10', '▬', '1280×800 (16:10)');
    currentRatio = 16 / 10;
    targetDimensions = { width: 1280, height: 800 };

    // Reset mode to crop
    setMode('crop');

    // Clear all drawings
    drawHistory = [];
    redoHistory = [];
    clearDrawCanvas();
    updateUndoRedoButtons();

    // Reset drawing tool settings
    colorPicker.value = '#ff0000';
    strokeWidth.value = 3;
    strokeValue.textContent = '3';
    fillShape.checked = false;

    // Reset crop box if image is loaded
    if (image) {
        initCropBox();
        mainCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
    }

    // Hide result section
    resultSection.classList.remove('visible');
    currentResultCanvas = null;

    // Reset format select
    formatSelect.value = 'png';
    qualitySlider.value = 90;
    qualityValue.textContent = '90';
    handleFormatChange();
}

function setupCanvas() {
    const containerWidth = canvasContainer.clientWidth || 800;
    const containerHeight = 500;

    const scaleX = containerWidth / image.width;
    const scaleY = containerHeight / image.height;
    scale = Math.min(scaleX, scaleY, 1);

    const displayWidth = image.width * scale;
    const displayHeight = image.height * scale;

    mainCanvas.width = displayWidth;
    mainCanvas.height = displayHeight;
    drawCanvas.width = displayWidth;
    drawCanvas.height = displayHeight;

    // Position draw canvas
    drawCanvas.style.width = displayWidth + 'px';
    drawCanvas.style.height = displayHeight + 'px';

    // Set wrapper size to match canvas
    canvasWrapper.style.width = displayWidth + 'px';
    canvasWrapper.style.height = displayHeight + 'px';

    imageOffset.x = (containerWidth - displayWidth) / 2;
    imageOffset.y = 0;

    mainCtx.drawImage(image, 0, 0, displayWidth, displayHeight);

    initCropBox();
    clearDrawCanvas();
}

function initCropBox() {
    const padding = 40;
    cropState.x = padding;
    cropState.y = padding;
    cropState.width = mainCanvas.width - padding * 2;
    cropState.height = mainCanvas.height - padding * 2;

    if (currentRatio) applyCropRatio();
    updateCropBox();
}

// Mode handling
function setMode(mode) {
    currentMode = mode;

    // Update tool buttons
    document.querySelectorAll('[data-tool]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === mode);
    });

    // Update canvas container classes
    canvasContainer.classList.toggle('crop-mode', mode === 'crop');
    canvasContainer.classList.toggle('draw-mode', mode === 'draw');

    // Show/hide draw tools
    drawTools.classList.toggle('visible', mode === 'draw');
    drawOptions.classList.toggle('visible', mode === 'draw');

    // Set default shape when entering draw mode
    if (mode === 'draw' && !document.querySelector('[data-shape].active')) {
        setShape('pen');
    }
}

function setShape(shape) {
    currentShape = shape;
    document.querySelectorAll('[data-shape]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.shape === shape);
    });
}

// Ratio dropdown handling
function toggleRatioDropdown(e) {
    e.stopPropagation();
    ratioDropdownMenu.classList.toggle('visible');
    ratioDropdownBtn.classList.toggle('active');
}

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

function selectRatio(option) {
    const ratio = option.dataset.ratio;

    if (ratio === 'custom') return; // Custom is handled by apply button

    // Update active state
    document.querySelectorAll('.ratio-option').forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');

    // Apply ratio and set target dimensions
    if (ratio === 'free') {
        currentRatio = null;
        targetDimensions = null;
        updateRatioButton(ratio, '⊞', '自由裁切');
    } else {
        const [w, h] = ratio.split(':').map(Number);
        currentRatio = w / h;
        targetDimensions = ratioDimensions[ratio] || { width: w * 100, height: h * 100 };
        const icon = option.querySelector('.ratio-icon').textContent;
        updateRatioButton(ratio, icon, `${targetDimensions.width}×${targetDimensions.height} (${ratio})`);
    }

    if (image) {
        applyCropRatio();
        updateCropBox();
    }

    // Close dropdown
    ratioDropdownMenu.classList.remove('visible');
    ratioDropdownBtn.classList.remove('active');
}

function updateRatioButton(ratio, icon, label) {
    document.querySelector('.current-ratio-icon').textContent = icon;
    document.querySelector('.current-ratio-text').textContent = label;
}

function applyCustomRatioValue(e) {
    e.stopPropagation();
    const w = parseInt(customWidth.value) || 800;
    const h = parseInt(customHeight.value) || 600;

    // Use the input values directly as target dimensions
    targetDimensions = { width: w, height: h };
    currentRatio = w / h;

    // Update active state
    document.querySelectorAll('.ratio-option').forEach(opt => opt.classList.remove('active'));
    document.querySelector('.custom-ratio-option').classList.add('active');

    // Update button
    updateRatioButton('custom', '⚙', `${w}×${h}`);

    if (image) {
        applyCropRatio();
        updateCropBox();
    }

    // Close dropdown
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
        newWidth = Math.min(cropState.width, mainCanvas.width - 20);
        newHeight = newWidth / currentRatio;
    } else {
        newHeight = Math.min(cropState.height, mainCanvas.height - 20);
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

function handleCropTouchStart(e) {
    if (currentMode !== 'crop') return;
    const touch = e.touches[0];
    handleCropMouseDown({
        preventDefault: () => {},
        target: e.target,
        clientX: touch.clientX,
        clientY: touch.clientY
    });
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

    drawStart.x = x;
    drawStart.y = y;
    isDrawing = true;
    penPoints = [{ x, y }];

    // Clear redo history when starting new drawing
    redoHistory = [];
    updateUndoRedoButtons();
}

function handleDrawTouchStart(e) {
    if (currentMode !== 'draw') return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = drawCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (currentShape === 'text') {
        showTextInput(x, y);
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

function handleTouchMove(e) {
    const touch = e.touches[0];
    if (currentMode === 'crop' && (isDragging || isResizing)) {
        e.preventDefault();
        handleCropMove(touch.clientX, touch.clientY);
    } else if (currentMode === 'draw' && isDrawing) {
        e.preventDefault();
        const rect = drawCanvas.getBoundingClientRect();
        handleDrawMove(touch.clientX - rect.left, touch.clientY - rect.top);
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
    // Add point for pen/highlighter
    if (currentShape === 'pen' || currentShape === 'highlighter') {
        penPoints.push({ x, y });
    }

    // Clear and redraw preview
    clearDrawCanvas();
    redrawHistory();

    // Draw current shape preview
    const color = colorPicker.value;
    const lineWidth = parseInt(strokeWidth.value);
    const fill = fillShape.checked;

    if (currentShape === 'pen' || currentShape === 'highlighter') {
        drawPenStroke(drawCtx, penPoints, color, lineWidth, currentShape === 'highlighter');
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

function handleTouchEnd(e) {
    if (currentMode === 'crop') {
        isDragging = false;
        isResizing = false;
        activeHandle = null;
    } else if (currentMode === 'draw' && isDrawing) {
        const lastPoint = penPoints.length > 0 ? penPoints[penPoints.length - 1] : drawStart;
        finalizeDrawing(lastPoint.x, lastPoint.y);
    }
}

function finalizeDrawing(endX, endY) {
    if (!isDrawing) return;
    isDrawing = false;

    const color = colorPicker.value;
    const lineWidth = parseInt(strokeWidth.value);
    const fill = fillShape.checked;

    // Save to history
    if (currentShape === 'pen' || currentShape === 'highlighter') {
        drawHistory.push({
            shape: currentShape,
            points: [...penPoints],
            color,
            lineWidth,
            isHighlighter: currentShape === 'highlighter'
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

    // Redraw everything
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
    for (const item of drawHistory) {
        if (item.shape === 'pen' || item.shape === 'highlighter') {
            drawPenStroke(drawCtx, item.points, item.color, item.lineWidth, item.isHighlighter);
        } else if (item.shape === 'text') {
            drawText(drawCtx, item.text, item.x, item.y, item.color, item.fontSize);
        } else {
            drawShape(drawCtx, item.shape, item.x1, item.y1, item.x2, item.y2, item.color, item.lineWidth, item.fill);
        }
    }
}

function drawPenStroke(ctx, points, color, lineWidth, isHighlighter) {
    if (points.length < 2) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = isHighlighter ? lineWidth * 3 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isHighlighter) {
        ctx.globalAlpha = 0.4;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
    ctx.restore();
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

    // Normalize coordinates for shapes that need it
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
    const headLength = Math.max(lineWidth * 3, 15);
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function applyMosaic(ctx, x, y, width, height) {
    if (width < 5 || height < 5) return;

    // Ensure coordinates are within canvas bounds
    const canvasX = Math.max(0, Math.floor(x));
    const canvasY = Math.max(0, Math.floor(y));
    const canvasW = Math.min(Math.floor(width), mainCanvas.width - canvasX);
    const canvasH = Math.min(Math.floor(height), mainCanvas.height - canvasY);

    if (canvasW <= 0 || canvasH <= 0) return;

    const blockSize = 10;

    // Get image data from main canvas
    const imageData = mainCtx.getImageData(canvasX, canvasY, canvasW, canvasH);
    const data = imageData.data;

    // Apply mosaic effect
    for (let py = 0; py < canvasH; py += blockSize) {
        for (let px = 0; px < canvasW; px += blockSize) {
            let r = 0, g = 0, b = 0, count = 0;

            // Calculate average color for block
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

                // Draw block
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

    // Ensure coordinates are within canvas bounds
    const canvasX = Math.max(0, Math.floor(x));
    const canvasY = Math.max(0, Math.floor(y));
    const canvasW = Math.min(Math.floor(width), mainCanvas.width - canvasX);
    const canvasH = Math.min(Math.floor(height), mainCanvas.height - canvasY);

    if (canvasW <= 0 || canvasH <= 0) return;

    // Get image data from main canvas
    const imageData = mainCtx.getImageData(canvasX, canvasY, canvasW, canvasH);
    const data = imageData.data;
    const blurRadius = 5;

    // Simple box blur
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

    // Draw blurred area
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
function handleFormatChange() {
    const format = formatSelect.value;
    if (format === 'png') {
        qualitySelect.style.display = 'none';
    } else {
        qualitySelect.style.display = 'block';
    }
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

// Export functions
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
        for (const item of drawHistory) {
            tempCtx.save();

            if (item.shape === 'pen' || item.shape === 'highlighter') {
                const scaledPoints = item.points.map(p => ({
                    x: (p.x - cropState.x) / scale,
                    y: (p.y - cropState.y) / scale
                }));
                drawPenStroke(tempCtx, scaledPoints, item.color, item.lineWidth / scale, item.isHighlighter);
            } else if (item.shape === 'text') {
                const scaledX = (item.x - cropState.x) / scale;
                const scaledY = (item.y - cropState.y) / scale;
                drawText(tempCtx, item.text, scaledX, scaledY, item.color, item.fontSize / scale);
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

    // 顯示預覽圖
    resultImage.src = currentResultCanvas.toDataURL('image/png');
    resultSection.classList.add('visible');

    // 滾動到結果區域
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function downloadImage() {
    if (!currentResultCanvas) return;

    const format = resultFormatSelect.value;
    const { mimeType, extension } = getFormatInfo(format);
    const quality = qualitySlider.value / 100;

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

        // 顯示成功提示
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
