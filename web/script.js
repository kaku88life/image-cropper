// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const canvasContainer = document.getElementById('canvasContainer');
const canvasWrapper = document.getElementById('canvasWrapper');
const mainCanvas = document.getElementById('mainCanvas');
const drawCanvas = document.getElementById('drawCanvas');
const resetAllBtn = document.getElementById('resetAllBtn');
const cropBox = document.getElementById('cropBox');
const cropSize = document.getElementById('cropSize');
const canvasInfo = document.getElementById('canvasInfo');
const removeImageBtn = document.getElementById('removeImageBtn');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const qualityControl = document.getElementById('qualityControl');
const completeBtn = document.getElementById('completeBtn');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const floatingContainer = document.getElementById('floatingContainer');
const floatingBar = document.getElementById('floatingBar');
const drawToolbar = document.getElementById('drawToolbar');

// Tab elements
const tabHeader = document.getElementById('tabHeader');
const editTab = document.getElementById('editTab');
const resultTab = document.getElementById('resultTab');
const resultTabBtn = document.getElementById('resultTabBtn');

// Ratio dropdown elements
const ratioDropdownBtn = document.getElementById('ratioDropdownBtn');
const ratioDropdownMenu = document.getElementById('ratioDropdownMenu');
const currentRatioText = document.getElementById('currentRatioText');
const customWidth = document.getElementById('customWidth');
const customHeight = document.getElementById('customHeight');
const applyCustomRatio = document.getElementById('applyCustomRatio');

// Format dropdown elements
const formatDropdownBtn = document.getElementById('formatDropdownBtn');
const formatDropdownMenu = document.getElementById('formatDropdownMenu');
const currentFormatText = document.getElementById('currentFormatText');

// Draw tools elements
const drawTools = document.getElementById('drawTools');
const drawOptions = document.getElementById('drawOptions');
const colorPicker = document.getElementById('colorPicker');
const colorPickerBtn = document.getElementById('colorPickerBtn');
const colorPickerPopover = document.getElementById('colorPickerPopover');
const colorPreview = document.getElementById('colorPreview');
const colorHexInput = document.getElementById('colorHexInput');
const hueSlider = document.getElementById('hueSlider');
const strokeWidth = document.getElementById('strokeWidth');
const strokePreview = document.getElementById('strokePreview');
const fillShape = document.getElementById('fillShape');

// Current color state
let currentColor = '#ff0000';
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const clearDrawBtn = document.getElementById('clearDrawBtn');

// Text input elements
const textInputContainer = document.getElementById('textInputContainer');
const textInput = document.getElementById('textInput');
const textConfirm = document.getElementById('textConfirm');
const textCancel = document.getElementById('textCancel');

// Contexts
let mainCtx = null;
let drawCtx = null;

// State
let image = null;
let scale = 1;
let currentMode = 'crop';
let currentShape = 'rect';
let currentRatio = 16 / 10;
let currentFormat = 'png';

// Target output dimensions
let targetDimensions = { width: 1280, height: 800 };
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
let penPoints = [];
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

    // Tab switching
    tabHeader.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn') && !e.target.disabled) {
            switchTab(e.target.dataset.tab);
        }
    });

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

    // Format dropdown
    formatDropdownBtn.addEventListener('click', toggleFormatDropdown);
    document.querySelectorAll('.format-option').forEach(option => {
        option.addEventListener('click', () => selectFormat(option));
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.ratio-dropdown-wrapper')) {
            ratioDropdownMenu.classList.remove('visible');
            ratioDropdownBtn.classList.remove('active');
        }
        if (!e.target.closest('.format-dropdown-wrapper')) {
            formatDropdownMenu.classList.remove('visible');
            formatDropdownBtn.classList.remove('active');
        }
    });

    // Quality slider
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
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

    // Draw options - Color picker
    colorPickerBtn.addEventListener('click', toggleColorPicker);
    colorPicker.addEventListener('input', handleColorPickerChange);
    colorHexInput.addEventListener('input', handleHexInputChange);
    colorHexInput.addEventListener('blur', handleHexInputBlur);
    hueSlider.addEventListener('input', handleHueSliderChange);
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => selectColorSwatch(swatch));
    });

    // Close color picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.color-picker-wrapper')) {
            colorPickerPopover.classList.remove('visible');
        }
    });

    // Draw options - Stroke width
    strokeWidth.addEventListener('input', updateStrokePreview);
    updateStrokePreview();
    updateColorPreview('#ff0000');

    // Action buttons
    undoBtn.addEventListener('click', undoLastDraw);
    redoBtn.addEventListener('click', redoLastDraw);
    clearDrawBtn.addEventListener('click', clearAllDrawings);
    removeImageBtn.addEventListener('click', resetToUpload);
    resetAllBtn.addEventListener('click', resetAllSettings);

    // Text input
    textConfirm.addEventListener('click', confirmText);
    textCancel.addEventListener('click', cancelText);

    // Export events
    completeBtn.addEventListener('click', showResult);
    downloadBtn.addEventListener('click', downloadImage);
    copyBtn.addEventListener('click', copyImageToClipboard);

    // Canvas drag-drop for replacing image
    canvasContainer.addEventListener('dragover', handleCanvasDragOver);
    canvasContainer.addEventListener('dragleave', handleCanvasDragLeave);
    canvasContainer.addEventListener('drop', handleCanvasDrop);
}

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    editTab.classList.toggle('active', tabName === 'edit');
    resultTab.classList.toggle('active', tabName === 'result');
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

function ensureMinimumSize(sourceImage, minWidth, minHeight, callback) {
    const imgWidth = sourceImage.width;
    const imgHeight = sourceImage.height;
    const scaleX = minWidth / imgWidth;
    const scaleY = minHeight / imgHeight;
    const requiredScale = Math.max(scaleX, scaleY);

    if (requiredScale <= 1) {
        callback(sourceImage);
        return;
    }

    const newWidth = Math.ceil(imgWidth * requiredScale);
    const newHeight = Math.ceil(imgHeight * requiredScale);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(sourceImage, 0, 0, newWidth, newHeight);

    const scaledImage = new Image();
    scaledImage.onload = () => {
        callback(scaledImage);
    };
    scaledImage.src = tempCanvas.toDataURL('image/png');
}

function showEditor() {
    uploadArea.classList.add('hidden');
    canvasContainer.classList.add('visible');
    canvasContainer.classList.add('crop-mode');
    canvasInfo.classList.add('visible');
    completeBtn.disabled = false;
    floatingContainer.classList.add('visible');
    resultTabBtn.disabled = true;
    switchTab('edit');
}

function resetToUpload() {
    image = null;
    uploadArea.classList.remove('hidden');
    canvasContainer.classList.remove('visible');
    canvasContainer.classList.remove('crop-mode');
    canvasContainer.classList.remove('draw-mode');
    canvasInfo.classList.remove('visible');
    completeBtn.disabled = true;
    floatingContainer.classList.remove('visible');
    floatingContainer.classList.remove('draw-mode');
    resultTabBtn.disabled = true;
    currentResultCanvas = null;
    fileInput.value = '';
    drawHistory = [];
    redoHistory = [];
    switchTab('edit');

    setMode('crop');

    document.querySelectorAll('.ratio-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.ratio === '16:10') opt.classList.add('active');
    });
    currentRatioText.textContent = '1280×800';
    currentRatio = 16 / 10;
    targetDimensions = { width: 1280, height: 800 };
}

function resetAllSettings() {
    if (resetAllBtn) {
        resetAllBtn.style.transform = 'rotate(360deg)';
        resetAllBtn.style.transition = 'transform 0.3s';
        setTimeout(() => {
            resetAllBtn.style.transform = '';
        }, 300);
    }

    // Reset ratio
    document.querySelectorAll('.ratio-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.ratio === '16:10') opt.classList.add('active');
    });
    currentRatioText.textContent = '1280×800';
    currentRatio = 16 / 10;
    targetDimensions = { width: 1280, height: 800 };

    // Reset format
    document.querySelectorAll('.format-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.format === 'png');
    });
    currentFormatText.textContent = 'PNG';
    currentFormat = 'png';
    qualityControl.classList.remove('visible');

    // Reset mode
    setMode('crop');

    // Clear drawings
    drawHistory = [];
    redoHistory = [];
    clearDrawCanvas();
    updateUndoRedoButtons();

    // Reset drawing tools
    colorPicker.value = '#ff0000';
    colorHexInput.value = '#FF0000';
    hueSlider.value = 0;
    strokeWidth.value = 3;
    fillShape.checked = false;
    updateColorPreview('#ff0000');
    updateStrokePreview();

    // Reset crop box
    if (image) {
        initCropBox();
        mainCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
    }

    // Reset to edit tab
    resultTabBtn.disabled = true;
    currentResultCanvas = null;
    switchTab('edit');

    // Reset quality
    qualitySlider.value = 90;
    qualityValue.textContent = '90%';
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

    drawCanvas.style.width = displayWidth + 'px';
    drawCanvas.style.height = displayHeight + 'px';

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

    document.querySelectorAll('[data-tool]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === mode);
    });

    canvasContainer.classList.toggle('crop-mode', mode === 'crop');
    canvasContainer.classList.toggle('draw-mode', mode === 'draw');
    floatingContainer.classList.toggle('draw-mode', mode === 'draw');

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

// Color picker functions
function toggleColorPicker(e) {
    e.stopPropagation();
    colorPickerPopover.classList.toggle('visible');
}

function handleColorPickerChange() {
    const color = colorPicker.value;
    updateColorPreview(color);
    colorHexInput.value = color.toUpperCase();
    updateSwatchSelection(color);
}

function handleHexInputChange() {
    let hex = colorHexInput.value;
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        colorPicker.value = hex;
        updateColorPreview(hex);
        updateSwatchSelection(hex);
    }
}

function handleHexInputBlur() {
    colorHexInput.value = colorPicker.value.toUpperCase();
}

function selectColorSwatch(swatch) {
    const color = swatch.dataset.color;
    colorPicker.value = color;
    colorHexInput.value = color.toUpperCase();
    updateColorPreview(color);
    updateSwatchSelection(color);
    colorPickerPopover.classList.remove('visible');
}

function updateColorPreview(color) {
    colorPreview.style.background = color;
    // Also update stroke preview color
    const strokeDot = strokePreview.querySelector('.stroke-dot');
    if (strokeDot) {
        strokeDot.style.background = color;
    }
}

function updateSwatchSelection(color) {
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.classList.toggle('active', swatch.dataset.color.toLowerCase() === color.toLowerCase());
    });
}

// Hue slider handler
function handleHueSliderChange() {
    const hue = parseInt(hueSlider.value);
    const color = hslToHex(hue, 100, 50);
    colorPicker.value = color;
    colorHexInput.value = color.toUpperCase();
    updateColorPreview(color);
    updateSwatchSelection(color);
}

// Convert HSL to HEX
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function updateStrokePreview() {
    const size = Math.min(Math.max(parseInt(strokeWidth.value), 1), 28);
    const strokeDot = strokePreview.querySelector('.stroke-dot');
    if (strokeDot) {
        strokeDot.style.width = size + 'px';
        strokeDot.style.height = size + 'px';
        strokeDot.style.background = colorPicker.value;
    }
}

// Ratio dropdown
function toggleRatioDropdown(e) {
    e.stopPropagation();
    ratioDropdownMenu.classList.toggle('visible');
    ratioDropdownBtn.classList.toggle('active');
    formatDropdownMenu.classList.remove('visible');
    formatDropdownBtn.classList.remove('active');
}

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
    if (ratio === 'custom') return;

    document.querySelectorAll('.ratio-option').forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');

    if (ratio === 'free') {
        currentRatio = null;
        targetDimensions = null;
        currentRatioText.textContent = '自由';
    } else {
        const [w, h] = ratio.split(':').map(Number);
        currentRatio = w / h;
        targetDimensions = ratioDimensions[ratio] || { width: w * 100, height: h * 100 };
        currentRatioText.textContent = `${targetDimensions.width}×${targetDimensions.height}`;
    }

    if (image) {
        applyCropRatio();
        updateCropBox();
    }

    ratioDropdownMenu.classList.remove('visible');
    ratioDropdownBtn.classList.remove('active');
}

function applyCustomRatioValue(e) {
    e.stopPropagation();
    const w = parseInt(customWidth.value) || 800;
    const h = parseInt(customHeight.value) || 600;

    targetDimensions = { width: w, height: h };
    currentRatio = w / h;

    document.querySelectorAll('.ratio-option').forEach(opt => opt.classList.remove('active'));
    document.querySelector('.custom-ratio-option').classList.add('active');

    currentRatioText.textContent = `${w}×${h}`;

    if (image) {
        applyCropRatio();
        updateCropBox();
    }

    ratioDropdownMenu.classList.remove('visible');
    ratioDropdownBtn.classList.remove('active');
}

// Format dropdown
function toggleFormatDropdown(e) {
    e.stopPropagation();
    formatDropdownMenu.classList.toggle('visible');
    formatDropdownBtn.classList.toggle('active');
    ratioDropdownMenu.classList.remove('visible');
    ratioDropdownBtn.classList.remove('active');
}

function selectFormat(option) {
    const format = option.dataset.format;
    currentFormat = format;

    document.querySelectorAll('.format-option').forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');

    currentFormatText.textContent = format.toUpperCase();

    // Show/hide quality control
    if (format === 'png') {
        qualityControl.classList.remove('visible');
    } else {
        qualityControl.classList.add('visible');
    }

    formatDropdownMenu.classList.remove('visible');
    formatDropdownBtn.classList.remove('active');
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

    if (targetDimensions) {
        cropSize.textContent = `${targetDimensions.width} × ${targetDimensions.height}`;
    } else {
        const actualWidth = Math.round(cropState.width / scale);
        const actualHeight = Math.round(cropState.height / scale);
        cropSize.textContent = `${actualWidth} × ${actualHeight}`;
    }
}

function constrainCropBox() {
    cropState.width = Math.max(30, Math.min(cropState.width, mainCanvas.width));
    cropState.height = Math.max(30, Math.min(cropState.height, mainCanvas.height));
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
    if (currentShape === 'pen' || currentShape === 'highlighter') {
        penPoints.push({ x, y });
    }

    clearDrawCanvas();
    redrawHistory();

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

    newWidth = Math.max(minSize, newWidth);
    newHeight = Math.max(minSize, newHeight);

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

    const blockSize = 10;
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
    const blurRadius = 5;

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

// Canvas drag-drop handlers
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
        drawHistory = [];
        redoHistory = [];
        updateUndoRedoButtons();
        resultTabBtn.disabled = true;
        currentResultCanvas = null;
        switchTab('edit');
        loadImage(files[0]);
    }
}

// Export functions
function generateResultCanvas() {
    if (!image) return null;

    const actualX = cropState.x / scale;
    const actualY = cropState.y / scale;
    const actualWidth = cropState.width / scale;
    const actualHeight = cropState.height / scale;

    const finalWidth = targetDimensions ? targetDimensions.width : Math.round(actualWidth);
    const finalHeight = targetDimensions ? targetDimensions.height : Math.round(actualHeight);

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = actualWidth;
    tempCanvas.height = actualHeight;

    tempCtx.drawImage(
        image,
        actualX, actualY, actualWidth, actualHeight,
        0, 0, actualWidth, actualHeight
    );

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

    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d');
    outputCanvas.width = finalWidth;
    outputCanvas.height = finalHeight;

    outputCtx.imageSmoothingEnabled = true;
    outputCtx.imageSmoothingQuality = 'high';
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

    resultImage.src = currentResultCanvas.toDataURL('image/png');
    resultTabBtn.disabled = false;
    switchTab('result');
}

function downloadImage() {
    if (!image) return;

    // Generate result canvas on-the-fly
    const canvas = generateResultCanvas();
    if (!canvas) return;

    const { mimeType, extension } = getFormatInfo(currentFormat);
    const quality = qualitySlider.value / 100;

    const dataUrl = canvas.toDataURL(mimeType, quality);
    const link = document.createElement('a');
    link.download = `edited-image.${extension}`;
    link.href = dataUrl;
    link.click();
}

async function copyImageToClipboard() {
    if (!image) return;

    try {
        // Generate result canvas on-the-fly
        const canvas = generateResultCanvas();
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png');
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ]);

        copyBtn.classList.add('success');
        setTimeout(() => {
            copyBtn.classList.remove('success');
        }, 1500);
    } catch (err) {
        console.error('複製失敗:', err);
        copyBtn.classList.add('error');
        setTimeout(() => {
            copyBtn.classList.remove('error');
        }, 1500);
    }
}

// Initialize
init();
