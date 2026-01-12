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
const qualityDropdownBtn = document.getElementById('qualityDropdownBtn');
const qualityDropdownMenu = document.getElementById('qualityDropdownMenu');
const currentQualityText = document.getElementById('currentQualityText');
const completeBtn = document.getElementById('completeBtn');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const resultDownloadBtn = document.getElementById('resultDownloadBtn');
const resultCopyBtn = document.getElementById('resultCopyBtn');
const resultShareBtn = document.getElementById('resultShareBtn');
const resultCloseBtn = document.getElementById('resultCloseBtn');
const floatingContainer = document.getElementById('floatingContainer');
const floatingBar = document.getElementById('floatingBar');
const drawToolbar = document.getElementById('drawToolbar');

// 新增：調整工具列元素
const adjustmentToolbar = document.getElementById('adjustmentToolbar');
const filterToolbar = document.getElementById('filterToolbar');
const brightnessSlider = document.getElementById('brightnessSlider');
const contrastSlider = document.getElementById('contrastSlider');
const saturationSlider = document.getElementById('saturationSlider');
const hueSliderAdjust = document.getElementById('hueSliderAdjust');
const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');
const saturationValue = document.getElementById('saturationValue');
const hueValueDisplay = document.getElementById('hueValue');

// 新增：變換工具元素
const rotateDropdownBtn = document.getElementById('rotateDropdownBtn');
const rotateMenu = document.getElementById('rotateMenu');
const flipHBtn = document.getElementById('flipHBtn');
const flipVBtn = document.getElementById('flipVBtn');
const resizeBtn = document.getElementById('resizeBtn');

// 新增：更多功能下拉選單元素
const moreDropdownBtn = document.getElementById('moreDropdownBtn');
const moreMenu = document.getElementById('moreMenu');

// 新增：檔案操作元素（現在在更多選單內）
const openUrlBtn = document.getElementById('openUrlBtn');
const printBtn = document.getElementById('printBtn');

// 新增：資訊/效果工具元素（現在在更多選單內）
const histogramBtn = document.getElementById('histogramBtn');
const watermarkBtn = document.getElementById('watermarkBtn');

// 新增：對話框元素
const urlModal = document.getElementById('urlModal');
const resizeModal = document.getElementById('resizeModal');
const watermarkModal = document.getElementById('watermarkModal');
const histogramPanel = document.getElementById('histogramPanel');
const histogramCanvas = document.getElementById('histogramCanvas');

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
const lockRatioCheckbox = document.getElementById('lockRatio');

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
const colorCodeDisplay = document.getElementById('colorCodeDisplay');
const hueSlider = document.getElementById('hueSlider');
const strokeWidth = document.getElementById('strokeWidth');
const strokePreview = document.getElementById('strokePreview');
const textSizeSelect = document.getElementById('textSizeSelect');
const textSizeInput = document.getElementById('textSizeInput');

// Tool dropdown elements
const penDropdown = document.getElementById('penDropdown');
const penDropdownBtn = document.getElementById('penDropdownBtn');
const penMenu = document.getElementById('penMenu');
const penIcon = document.getElementById('penIcon');
const shapeDropdown = document.getElementById('shapeDropdown');
const shapeDropdownBtn = document.getElementById('shapeDropdownBtn');
const shapeMenu = document.getElementById('shapeMenu');
const shapeIcon = document.getElementById('shapeIcon');

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
let currentShape = 'none';  // 初始為 none，需要點選工具才能繪圖
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
let currentResultBlob = null;
let fillEnabled = false;

// 新增：調整狀態
let originalImage = null; // 保存原始圖片供重置
let adjustmentState = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0
};
let currentFilter = 'none';
let watermarkSettings = {
    type: 'text',
    text: '',
    fontSize: 24,
    color: '#ffffff',
    opacity: 0.5,
    position: 'bottom-right',
    image: null,
    imageSize: 30,
    imageOpacity: 0.8
};

// Fill toggle button
const fillToggleBtn = document.getElementById('fillToggleBtn');

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

    // Shape selection (both tool-btn and tool-option)
    document.querySelectorAll('[data-shape]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            setShape(btn.dataset.shape);
        });
    });

    // Fill toggle button
    if (fillToggleBtn) {
        fillToggleBtn.addEventListener('click', () => {
            fillEnabled = !fillEnabled;
            fillToggleBtn.classList.toggle('active', fillEnabled);
        });
    }

    // Tool dropdown buttons
    if (penDropdownBtn) {
        penDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            penMenu.classList.toggle('visible');
            shapeMenu?.classList.remove('visible');
        });
    }
    if (shapeDropdownBtn) {
        shapeDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shapeMenu.classList.toggle('visible');
            penMenu?.classList.remove('visible');
        });
    }

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
        // Close tool dropdowns
        if (!e.target.closest('.tool-dropdown')) {
            penMenu?.classList.remove('visible');
            shapeMenu?.classList.remove('visible');
        }
    });

    // Quality dropdown
    if (qualityDropdownBtn) {
        qualityDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            qualityDropdownBtn.classList.toggle('active');
            qualityDropdownMenu.classList.toggle('visible');
            // Close other dropdowns
            formatDropdownBtn?.classList.remove('active');
            formatDropdownMenu?.classList.remove('visible');
            ratioDropdownBtn?.classList.remove('active');
            ratioDropdownMenu?.classList.remove('visible');
        });
    }

    // Quality slider
    qualitySlider.addEventListener('input', () => {
        const val = qualitySlider.value + '%';
        qualityValue.textContent = val;
        if (currentQualityText) currentQualityText.textContent = val;
        // Update preset active state
        updateQualityPresetActive(parseInt(qualitySlider.value));
    });

    // Quality presets
    document.querySelectorAll('.quality-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const quality = parseInt(btn.dataset.quality);
            qualitySlider.value = quality;
            qualityValue.textContent = quality + '%';
            if (currentQualityText) currentQualityText.textContent = quality + '%';
            updateQualityPresetActive(quality);
        });
    });

    // Close quality dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.quality-dropdown-wrapper')) {
            qualityDropdownBtn?.classList.remove('active');
            qualityDropdownMenu?.classList.remove('visible');
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

    // Text size sync
    if (textSizeSelect) {
        textSizeSelect.addEventListener('change', () => {
            if (textSizeInput) textSizeInput.value = textSizeSelect.value;
        });
    }
    if (textSizeInput) {
        textSizeInput.addEventListener('input', () => {
            const val = parseInt(textSizeInput.value) || 36;
            // Update select if matching option exists
            const option = textSizeSelect?.querySelector(`option[value="${val}"]`);
            if (option) {
                textSizeSelect.value = val;
            }
        });
    }

    // Export events
    completeBtn.addEventListener('click', showResult);
    downloadBtn.addEventListener('click', downloadImage);
    copyBtn.addEventListener('click', copyImageToClipboard);

    // Result page download/copy/share buttons
    if (resultDownloadBtn) resultDownloadBtn.addEventListener('click', downloadResultImage);
    if (resultCopyBtn) resultCopyBtn.addEventListener('click', copyResultImageToClipboard);
    if (resultShareBtn) resultShareBtn.addEventListener('click', shareResultImage);
    if (resultCloseBtn) resultCloseBtn.addEventListener('click', closeResult);

    // Canvas drag-drop for replacing image
    canvasContainer.addEventListener('dragover', handleCanvasDragOver);
    canvasContainer.addEventListener('dragleave', handleCanvasDragLeave);
    canvasContainer.addEventListener('drop', handleCanvasDrop);

    // Result image drag events
    resultImage.addEventListener('dragstart', handleResultDragStart);
    resultImage.addEventListener('dragend', handleResultDragEnd);

    // 新增：調整滑桿事件
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', handleAdjustmentChange);
    }
    if (contrastSlider) {
        contrastSlider.addEventListener('input', handleAdjustmentChange);
    }
    if (saturationSlider) {
        saturationSlider.addEventListener('input', handleAdjustmentChange);
    }
    if (hueSliderAdjust) {
        hueSliderAdjust.addEventListener('input', handleAdjustmentChange);
    }

    // 新增：快速效果按鈕
    const autoAdjustBtn = document.getElementById('autoAdjustBtn');
    const grayscaleBtn = document.getElementById('grayscaleBtn');
    const negativeBtn = document.getElementById('negativeBtn');
    const resetAdjustBtn = document.getElementById('resetAdjustBtn');

    if (autoAdjustBtn) autoAdjustBtn.addEventListener('click', applyAutoAdjust);
    if (grayscaleBtn) grayscaleBtn.addEventListener('click', applyGrayscale);
    if (negativeBtn) negativeBtn.addEventListener('click', applyNegative);
    if (resetAdjustBtn) resetAdjustBtn.addEventListener('click', resetAdjustments);

    // 新增：濾鏡按鈕
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            applyAdjustmentPreview();
        });
    });

    // 新增：變換工具事件
    if (rotateDropdownBtn) {
        rotateDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            rotateMenu.classList.toggle('visible');
            moreMenu?.classList.remove('visible');
        });
    }
    document.querySelectorAll('[data-rotate]').forEach(btn => {
        btn.addEventListener('click', () => {
            const degrees = parseInt(btn.dataset.rotate);
            rotateImage(degrees);
            rotateMenu.classList.remove('visible');
        });
    });
    if (flipHBtn) {
        flipHBtn.addEventListener('click', () => {
            flipImage('horizontal');
            rotateMenu?.classList.remove('visible');
        });
    }
    if (flipVBtn) {
        flipVBtn.addEventListener('click', () => {
            flipImage('vertical');
            rotateMenu?.classList.remove('visible');
        });
    }
    if (resizeBtn) resizeBtn.addEventListener('click', showResizeModal);

    // 新增：更多功能下拉選單事件
    if (moreDropdownBtn) {
        moreDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moreMenu.classList.toggle('visible');
            rotateMenu?.classList.remove('visible');
        });
    }

    // 新增：檔案操作事件（現在在更多選單內）
    if (openUrlBtn) {
        openUrlBtn.addEventListener('click', () => {
            showUrlModal();
            moreMenu?.classList.remove('visible');
        });
    }
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            printImage();
            moreMenu?.classList.remove('visible');
        });
    }

    // 新增：資訊/效果工具事件（現在在更多選單內）
    if (histogramBtn) {
        histogramBtn.addEventListener('click', () => {
            toggleHistogramPanel();
            moreMenu?.classList.remove('visible');
        });
    }
    if (watermarkBtn) {
        watermarkBtn.addEventListener('click', () => {
            showWatermarkModal();
            moreMenu?.classList.remove('visible');
        });
    }

    // 新增：取色器事件
    const eyedropperBtn = document.getElementById('eyedropperBtn');
    if (eyedropperBtn) {
        eyedropperBtn.addEventListener('click', () => {
            toggleEyedropperMode();
        });
    }

    // 新增：對話框事件
    setupModalEvents();

    // 關閉下拉選單
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#rotateDropdown')) {
            rotateMenu?.classList.remove('visible');
        }
        if (!e.target.closest('#moreDropdown')) {
            moreMenu?.classList.remove('visible');
        }
    });
}

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    editTab.classList.toggle('active', tabName === 'edit');
    resultTab.classList.toggle('active', tabName === 'result');
}

// Close result and go back to edit
function closeResult() {
    switchTab('edit');
    resultImage.src = '';
    currentResultCanvas = null;
    currentResultBlob = null;
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
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
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
    currentResultBlob = null;
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
    // 點擊回饋效果（簡單的透明度變化）
    if (resetAllBtn) {
        resetAllBtn.style.opacity = '0.6';
        setTimeout(() => {
            resetAllBtn.style.opacity = '';
        }, 150);
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
    currentShape = 'none';
    document.querySelectorAll('.tool-option').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tool-btn[data-shape]').forEach(btn => btn.classList.remove('active'));
    if (penDropdownBtn) penDropdownBtn.classList.remove('active');
    if (shapeDropdownBtn) shapeDropdownBtn.classList.remove('active');
    colorPicker.value = '#ff0000';
    colorHexInput.value = '#FF0000';
    hueSlider.value = 0;
    strokeWidth.value = 3;
    fillEnabled = false;
    if (fillToggleBtn) fillToggleBtn.classList.remove('active');
    updateColorPreview('#ff0000');
    updateStrokePreview();

    // Reset adjustments
    adjustmentState = { brightness: 0, contrast: 0, saturation: 0, hue: 0 };
    currentFilter = 'none';
    if (brightnessSlider) brightnessSlider.value = 0;
    if (contrastSlider) contrastSlider.value = 0;
    if (saturationSlider) saturationSlider.value = 0;
    if (hueSliderAdjust) hueSliderAdjust.value = 0;
    if (brightnessValue) brightnessValue.textContent = '0';
    if (contrastValue) contrastValue.textContent = '0';
    if (saturationValue) saturationValue.textContent = '0';
    if (hueValueDisplay) hueValueDisplay.textContent = '0';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="none"]')?.classList.add('active');
    mainCanvas.style.filter = '';

    // Reset original image if exists
    if (originalImage) {
        image = originalImage;
        originalImage = null;
    }

    // Reset crop box
    if (image) {
        initCropBox();
        mainCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
    }

    // Reset to edit tab
    resultTabBtn.disabled = true;
    currentResultCanvas = null;
    currentResultBlob = null;
    switchTab('edit');

    // Reset quality
    qualitySlider.value = 90;
    qualityValue.textContent = '90%';
    if (currentQualityText) currentQualityText.textContent = '90%';
    updateQualityPresetActive(90);
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
    canvasContainer.classList.toggle('adjust-mode', mode === 'adjust');
    floatingContainer.classList.toggle('draw-mode', mode === 'draw');
    floatingContainer.classList.toggle('adjust-mode', mode === 'adjust');

    // 切換到繪圖模式時，更新游標樣式
    if (mode === 'draw') {
        updateDrawCursor();
    }

    // 調整模式下更新預覽
    if (mode === 'adjust' && image) {
        applyAdjustmentPreview();
    } else if (mode !== 'adjust') {
        // 離開調整模式時，保持 CSS filter 效果
        // (不清除，讓用戶可以看到效果)
    }
}

function setShape(shape) {
    const penShapes = ['pen', 'marker', 'highlighter', 'eraser', 'mosaic', 'blur'];
    const geometryShapes = ['rect', 'circle', 'arrow', 'line'];

    // 如果點擊同一個工具，則取消選取（切換到 'none' 模式）
    if (currentShape === shape) {
        currentShape = 'none';
    } else {
        currentShape = shape;
    }

    const activeShape = currentShape;

    // 清除所有工具的 active 狀態
    document.querySelectorAll('.tool-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tool-btn[data-shape]').forEach(btn => {
        btn.classList.remove('active');
    });
    if (penDropdownBtn) penDropdownBtn.classList.remove('active');
    if (shapeDropdownBtn) shapeDropdownBtn.classList.remove('active');

    // 如果有選取工具，設定 active 狀態
    if (activeShape !== 'none') {
        // Update active states
        document.querySelectorAll('.tool-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.shape === activeShape);
        });
        document.querySelectorAll('.tool-btn[data-shape]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.shape === activeShape);
        });

        // Update dropdown button states
        if (penDropdownBtn) {
            penDropdownBtn.classList.toggle('active', penShapes.includes(activeShape));
        }
        if (shapeDropdownBtn) {
            shapeDropdownBtn.classList.toggle('active', geometryShapes.includes(activeShape));
        }

        // Update dropdown icons based on selected shape
        if (penShapes.includes(activeShape) && penIcon) {
            const selectedOption = penMenu?.querySelector(`[data-shape="${activeShape}"] svg`);
            if (selectedOption) {
                penIcon.innerHTML = selectedOption.outerHTML;
            }
        }
        if (geometryShapes.includes(activeShape) && shapeIcon) {
            const selectedOption = shapeMenu?.querySelector(`[data-shape="${activeShape}"] svg`);
            if (selectedOption) {
                shapeIcon.innerHTML = selectedOption.outerHTML;
            }
        }
    }

    // 更新游標樣式
    updateDrawCursor();

    // Close dropdown menus
    penMenu?.classList.remove('visible');
    shapeMenu?.classList.remove('visible');
}

// 更新繪圖游標
function updateDrawCursor() {
    if (!drawCanvas) return;

    if (currentShape === 'none') {
        drawCanvas.style.cursor = 'default';
    } else if (currentShape === 'text') {
        drawCanvas.style.cursor = 'text';
    } else {
        drawCanvas.style.cursor = 'crosshair';
    }
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
    // Update color code display
    if (colorCodeDisplay) {
        colorCodeDisplay.textContent = color.toUpperCase();
    }
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

// Update quality preset button active state
function updateQualityPresetActive(value) {
    document.querySelectorAll('.quality-preset').forEach(btn => {
        const presetValue = parseInt(btn.dataset.quality);
        if (presetValue === value) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
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

    // 沒有選取工具時，不執行任何繪圖操作
    if (currentShape === 'none') {
        return;
    }

    // 處理填色桶工具
    if (currentShape === 'fillBucket') {
        applyFillBucket(x, y);
        return;
    }

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

    // 沒有選取工具時，不執行任何繪圖操作
    if (currentShape === 'none') {
        return;
    }

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
    const brushTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter', 'eraser', 'mosaic', 'blur'];
    if (brushTypes.includes(currentShape)) {
        penPoints.push({ x, y });
    }

    clearDrawCanvas();
    redrawHistory();

    const color = colorPicker.value;
    const lineWidth = parseInt(strokeWidth.value);

    if (brushTypes.includes(currentShape)) {
        if (currentShape === 'mosaic') {
            drawMosaicBrushDisplay(drawCtx, penPoints, lineWidth);
        } else if (currentShape === 'blur') {
            drawBlurBrushDisplay(drawCtx, penPoints, lineWidth);
        } else {
            drawPenStroke(drawCtx, penPoints, color, lineWidth, currentShape);
        }
    } else {
        drawShape(drawCtx, currentShape, drawStart.x, drawStart.y, x, y, color, lineWidth, fillEnabled);
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
    const brushTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter', 'eraser', 'mosaic', 'blur'];

    if (brushTypes.includes(currentShape)) {
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
            fill: fillEnabled
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

    // Check if ratio should be locked
    const shouldLockRatio = lockRatioCheckbox && lockRatioCheckbox.checked && currentRatio;

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

    // 如果鎖定比例，根據拖動的方向調整尺寸
    if (shouldLockRatio) {
        const aspectRatio = currentRatio;

        // 根據拖動方向決定以哪個軸為主
        if (['n', 's'].includes(activeHandle)) {
            // 上下拖動，以高度為主
            newWidth = newHeight * aspectRatio;
        } else if (['e', 'w'].includes(activeHandle)) {
            // 左右拖動，以寬度為主
            newHeight = newWidth / aspectRatio;
        } else {
            // 角落拖動，取較大的變化
            const widthFromHeight = newHeight * aspectRatio;
            const heightFromWidth = newWidth / aspectRatio;

            if (Math.abs(dx) > Math.abs(dy)) {
                newHeight = heightFromWidth;
            } else {
                newWidth = widthFromHeight;
            }
        }

        // 調整位置以保持對角固定
        if (['nw', 'n', 'ne'].includes(activeHandle)) {
            newY = cropStart.y + cropStart.height - newHeight;
        }
        if (['nw', 'w', 'sw'].includes(activeHandle)) {
            newX = cropStart.x + cropStart.width - newWidth;
        }
    }

    // 確保不超出畫布邊界
    if (newX < 0) {
        if (shouldLockRatio) {
            const overflow = -newX;
            newX = 0;
            newWidth -= overflow;
            newHeight = newWidth / currentRatio;
        } else {
            newWidth += newX;
            newX = 0;
        }
    }
    if (newY < 0) {
        if (shouldLockRatio) {
            const overflow = -newY;
            newY = 0;
            newHeight -= overflow;
            newWidth = newHeight * currentRatio;
        } else {
            newHeight += newY;
            newY = 0;
        }
    }
    if (newX + newWidth > mainCanvas.width) {
        if (shouldLockRatio) {
            newWidth = mainCanvas.width - newX;
            newHeight = newWidth / currentRatio;
        } else {
            newWidth = mainCanvas.width - newX;
        }
    }
    if (newY + newHeight > mainCanvas.height) {
        if (shouldLockRatio) {
            newHeight = mainCanvas.height - newY;
            newWidth = newHeight * currentRatio;
        } else {
            newHeight = mainCanvas.height - newY;
        }
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
        const fontSize = parseInt(textSizeInput?.value || textSizeSelect?.value || 36);

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
    const brushTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter', 'eraser'];
    for (const item of drawHistory) {
        if (item.shape === 'fillBucket') {
            // Restore fill bucket image data
            if (item.imageData) {
                drawCtx.putImageData(item.imageData, 0, 0);
            }
        } else if (brushTypes.includes(item.shape)) {
            drawPenStroke(drawCtx, item.points, item.color, item.lineWidth, item.penType || item.shape);
        } else if (item.shape === 'mosaic') {
            applyMosaicBrush(drawCtx, item.points, item.lineWidth);
        } else if (item.shape === 'blur') {
            applyBlurBrush(drawCtx, item.points, item.lineWidth);
        } else if (item.shape === 'text') {
            drawText(drawCtx, item.text, item.x, item.y, item.color, item.fontSize);
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

    // Handle legacy isHighlighter boolean
    if (penType === true) penType = 'highlighter';
    if (penType === false) penType = 'pen';

    switch (penType) {
        case 'highlighter':
            ctx.lineWidth = lineWidth * 3;
            ctx.globalAlpha = 0.4;
            break;
        case 'marker':
            ctx.lineWidth = lineWidth * 1.5;
            ctx.globalAlpha = 0.85;
            break;
        case 'watercolor':
            ctx.lineWidth = lineWidth * 2;
            ctx.globalAlpha = 0.3;
            break;
        case 'crayon':
            ctx.lineWidth = lineWidth * 1.8;
            ctx.globalAlpha = 0.7;
            // Add texture effect for crayon
            ctx.shadowColor = color;
            ctx.shadowBlur = 1;
            break;
        case 'eraser':
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = lineWidth * 2;
            ctx.globalAlpha = 1;
            break;
        default: // pen
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = 0.9;
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

function drawShape(ctx, shape, x1, y1, x2, y2, color, lineWidth, fill, sourceCtx = null) {
    if (shape === 'blur' || shape === 'mosaic') {
        console.log('drawShape:', shape, 'x1:', x1, 'y1:', y1, 'x2:', x2, 'y2:', y2, 'hasSourceCtx:', !!sourceCtx);
    }

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

    if (shape === 'blur' || shape === 'mosaic') {
        console.log('drawShape calculated:', 'minX:', minX, 'minY:', minY, 'width:', width, 'height:', height);
    }

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
            applyMosaic(ctx, minX, minY, width, height, sourceCtx);
            break;

        case 'blur':
            applyBlur(ctx, minX, minY, width, height, sourceCtx);
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

function applyMosaic(ctx, x, y, width, height, sourceCtx = null) {
    console.log('applyMosaic called:', { x, y, width, height, hasSourceCtx: !!sourceCtx });

    if (width < 5 || height < 5) {
        console.log('applyMosaic: early return - size too small');
        return;
    }

    const source = sourceCtx || mainCtx;
    const sourceCanvas = source.canvas;

    console.log('applyMosaic: sourceCanvas dimensions:', sourceCanvas.width, 'x', sourceCanvas.height);

    // Calculate the visible portion within canvas bounds
    const startX = Math.floor(x);
    const startY = Math.floor(y);
    const endX = Math.floor(x + width);
    const endY = Math.floor(y + height);

    // Clip to canvas bounds
    const canvasX = Math.max(0, startX);
    const canvasY = Math.max(0, startY);
    const canvasEndX = Math.min(sourceCanvas.width, endX);
    const canvasEndY = Math.min(sourceCanvas.height, endY);

    const canvasW = canvasEndX - canvasX;
    const canvasH = canvasEndY - canvasY;

    console.log('applyMosaic: clipped region:', { canvasX, canvasY, canvasEndX, canvasEndY, canvasW, canvasH });

    if (canvasW <= 0 || canvasH <= 0) {
        console.log('applyMosaic: early return - clipped size is zero or negative');
        return;
    }

    const blockSize = 10;
    console.log('applyMosaic: about to getImageData');
    const imageData = source.getImageData(canvasX, canvasY, canvasW, canvasH);
    console.log('applyMosaic: got imageData, size:', imageData.data.length);
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

function applyBlur(ctx, x, y, width, height, sourceCtx = null) {
    console.log('applyBlur called:', { x, y, width, height, hasSourceCtx: !!sourceCtx });

    if (width < 5 || height < 5) {
        console.log('applyBlur: early return - size too small');
        return;
    }

    const source = sourceCtx || mainCtx;
    const sourceCanvas = source.canvas;

    console.log('applyBlur: sourceCanvas dimensions:', sourceCanvas.width, 'x', sourceCanvas.height);

    // Calculate the visible portion within canvas bounds
    const startX = Math.floor(x);
    const startY = Math.floor(y);
    const endX = Math.floor(x + width);
    const endY = Math.floor(y + height);

    // Clip to canvas bounds
    const canvasX = Math.max(0, startX);
    const canvasY = Math.max(0, startY);
    const canvasEndX = Math.min(sourceCanvas.width, endX);
    const canvasEndY = Math.min(sourceCanvas.height, endY);

    const canvasW = canvasEndX - canvasX;
    const canvasH = canvasEndY - canvasY;

    console.log('applyBlur: clipped region:', { canvasX, canvasY, canvasEndX, canvasEndY, canvasW, canvasH });

    if (canvasW <= 0 || canvasH <= 0) {
        console.log('applyBlur: early return - clipped size is zero or negative');
        return;
    }

    console.log('applyBlur: about to getImageData');
    const imageData = source.getImageData(canvasX, canvasY, canvasW, canvasH);
    console.log('applyBlur: got imageData, size:', imageData.data.length);
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
    console.log('applyBlur: about to putImageData at', canvasX, canvasY);
    ctx.putImageData(blurredData, canvasX, canvasY);
    console.log('applyBlur: completed successfully');
}

// Brush-style mosaic display (preview while drawing)
function drawMosaicBrushDisplay(ctx, points, lineWidth) {
    if (points.length < 1) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
    ctx.lineWidth = lineWidth * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();
}

// Brush-style blur display (preview while drawing)
function drawBlurBrushDisplay(ctx, points, lineWidth) {
    if (points.length < 1) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
    ctx.lineWidth = lineWidth * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();
}

// Apply mosaic brush effect along path (optimized with pre-computed mask)
function applyMosaicBrush(ctx, points, lineWidth) {
    if (!points || points.length < 2) return;

    const brushRadius = lineWidth * 2;
    const blockSize = Math.max(8, Math.floor(lineWidth));
    const sourceCanvas = mainCanvas;

    // Get the bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x - brushRadius);
        minY = Math.min(minY, p.y - brushRadius);
        maxX = Math.max(maxX, p.x + brushRadius);
        maxY = Math.max(maxY, p.y + brushRadius);
    }

    minX = Math.max(0, Math.floor(minX));
    minY = Math.max(0, Math.floor(minY));
    maxX = Math.min(sourceCanvas.width, Math.ceil(maxX));
    maxY = Math.min(sourceCanvas.height, Math.ceil(maxY));

    if (maxX <= minX || maxY <= minY) return;

    const width = maxX - minX;
    const height = maxY - minY;

    // Pre-compute brush mask using canvas (much faster than per-pixel check)
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, width, height);
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushRadius * 2;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.beginPath();
    maskCtx.moveTo(points[0].x - minX, points[0].y - minY);
    for (let i = 1; i < points.length; i++) {
        maskCtx.lineTo(points[i].x - minX, points[i].y - minY);
    }
    maskCtx.stroke();
    const maskData = maskCtx.getImageData(0, 0, width, height).data;

    // Get combined image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceCanvas.width;
    tempCanvas.height = sourceCanvas.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.drawImage(sourceCanvas, 0, 0);
    tempCtx.drawImage(drawCanvas, 0, 0);

    const imageData = tempCtx.getImageData(minX, minY, width, height);
    const data = imageData.data;
    const currentDrawData = ctx.getImageData(minX, minY, width, height);
    const output = currentDrawData.data;

    // Apply mosaic using pre-computed mask
    for (let by = 0; by < height; by += blockSize) {
        for (let bx = 0; bx < width; bx += blockSize) {
            let r = 0, g = 0, b = 0, count = 0;

            for (let dy = 0; dy < blockSize && by + dy < height; dy++) {
                for (let dx = 0; dx < blockSize && bx + dx < width; dx++) {
                    const px = bx + dx, py = by + dy;
                    const mi = (py * width + px) * 4;
                    if (maskData[mi] > 128) {
                        const i = mi;
                        r += data[i]; g += data[i + 1]; b += data[i + 2];
                        count++;
                    }
                }
            }

            if (count > 0) {
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);

                for (let dy = 0; dy < blockSize && by + dy < height; dy++) {
                    for (let dx = 0; dx < blockSize && bx + dx < width; dx++) {
                        const px = bx + dx, py = by + dy;
                        const mi = (py * width + px) * 4;
                        if (maskData[mi] > 128) {
                            output[mi] = r; output[mi + 1] = g; output[mi + 2] = b; output[mi + 3] = 255;
                        }
                    }
                }
            }
        }
    }

    ctx.putImageData(new ImageData(output, width, height), minX, minY);
}

// Apply blur brush effect along path (optimized with pre-computed mask)
function applyBlurBrush(ctx, points, lineWidth) {
    if (!points || points.length < 2) return;

    const brushRadius = lineWidth * 2;
    const blurRadius = 4;
    const sourceCanvas = mainCanvas;

    // Get the bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x - brushRadius - blurRadius);
        minY = Math.min(minY, p.y - brushRadius - blurRadius);
        maxX = Math.max(maxX, p.x + brushRadius + blurRadius);
        maxY = Math.max(maxY, p.y + brushRadius + blurRadius);
    }

    minX = Math.max(0, Math.floor(minX));
    minY = Math.max(0, Math.floor(minY));
    maxX = Math.min(sourceCanvas.width, Math.ceil(maxX));
    maxY = Math.min(sourceCanvas.height, Math.ceil(maxY));

    if (maxX <= minX || maxY <= minY) return;

    const width = maxX - minX;
    const height = maxY - minY;

    // Pre-compute brush mask using canvas
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, width, height);
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushRadius * 2;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.beginPath();
    maskCtx.moveTo(points[0].x - minX, points[0].y - minY);
    for (let i = 1; i < points.length; i++) {
        maskCtx.lineTo(points[i].x - minX, points[i].y - minY);
    }
    maskCtx.stroke();
    const maskData = maskCtx.getImageData(0, 0, width, height).data;

    // Get combined image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceCanvas.width;
    tempCanvas.height = sourceCanvas.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.drawImage(sourceCanvas, 0, 0);
    tempCtx.drawImage(drawCanvas, 0, 0);

    const imageData = tempCtx.getImageData(minX, minY, width, height);
    const data = imageData.data;
    const currentDrawData = ctx.getImageData(minX, minY, width, height);
    const output = currentDrawData.data;

    // Fast box blur using separable passes (horizontal then vertical)
    let current = new Uint8ClampedArray(data);
    let temp = new Uint8ClampedArray(data.length);

    // 2-pass blur for smoother result
    for (let pass = 0; pass < 2; pass++) {
        // Horizontal blur
        for (let py = 0; py < height; py++) {
            for (let px = 0; px < width; px++) {
                const i = (py * width + px) * 4;
                let r = 0, g = 0, b = 0, count = 0;
                for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                    const nx = px + dx;
                    if (nx >= 0 && nx < width) {
                        const j = (py * width + nx) * 4;
                        r += current[j]; g += current[j + 1]; b += current[j + 2];
                        count++;
                    }
                }
                temp[i] = r / count; temp[i + 1] = g / count; temp[i + 2] = b / count; temp[i + 3] = 255;
            }
        }
        // Vertical blur
        for (let py = 0; py < height; py++) {
            for (let px = 0; px < width; px++) {
                const i = (py * width + px) * 4;
                let r = 0, g = 0, b = 0, count = 0;
                for (let dy = -blurRadius; dy <= blurRadius; dy++) {
                    const ny = py + dy;
                    if (ny >= 0 && ny < height) {
                        const j = (ny * width + px) * 4;
                        r += temp[j]; g += temp[j + 1]; b += temp[j + 2];
                        count++;
                    }
                }
                current[i] = r / count; current[i + 1] = g / count; current[i + 2] = b / count; current[i + 3] = 255;
            }
        }
    }

    // Copy only masked pixels to output
    for (let i = 0; i < width * height; i++) {
        if (maskData[i * 4] > 128) {
            const idx = i * 4;
            output[idx] = current[idx];
            output[idx + 1] = current[idx + 1];
            output[idx + 2] = current[idx + 2];
            output[idx + 3] = 255;
        }
    }

    ctx.putImageData(new ImageData(output, width, height), minX, minY);
}

// Apply mosaic brush on specific canvas (for final output, optimized)
function applyMosaicBrushOnCanvas(ctx, sourceCtx, points, lineWidth) {
    if (!points || points.length < 2) return;

    const brushRadius = lineWidth * 2;
    const blockSize = Math.max(8, Math.floor(lineWidth));
    const sourceCanvas = sourceCtx.canvas;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x - brushRadius);
        minY = Math.min(minY, p.y - brushRadius);
        maxX = Math.max(maxX, p.x + brushRadius);
        maxY = Math.max(maxY, p.y + brushRadius);
    }

    minX = Math.max(0, Math.floor(minX));
    minY = Math.max(0, Math.floor(minY));
    maxX = Math.min(sourceCanvas.width, Math.ceil(maxX));
    maxY = Math.min(sourceCanvas.height, Math.ceil(maxY));

    if (maxX <= minX || maxY <= minY) return;

    const width = maxX - minX;
    const height = maxY - minY;

    // Pre-compute brush mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, width, height);
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushRadius * 2;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.beginPath();
    maskCtx.moveTo(points[0].x - minX, points[0].y - minY);
    for (let i = 1; i < points.length; i++) {
        maskCtx.lineTo(points[i].x - minX, points[i].y - minY);
    }
    maskCtx.stroke();
    const maskData = maskCtx.getImageData(0, 0, width, height).data;

    const imageData = sourceCtx.getImageData(minX, minY, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);

    for (let by = 0; by < height; by += blockSize) {
        for (let bx = 0; bx < width; bx += blockSize) {
            let r = 0, g = 0, b = 0, count = 0;

            for (let dy = 0; dy < blockSize && by + dy < height; dy++) {
                for (let dx = 0; dx < blockSize && bx + dx < width; dx++) {
                    const px = bx + dx, py = by + dy;
                    const mi = (py * width + px) * 4;
                    if (maskData[mi] > 128) {
                        r += data[mi]; g += data[mi + 1]; b += data[mi + 2];
                        count++;
                    }
                }
            }

            if (count > 0) {
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);

                for (let dy = 0; dy < blockSize && by + dy < height; dy++) {
                    for (let dx = 0; dx < blockSize && bx + dx < width; dx++) {
                        const px = bx + dx, py = by + dy;
                        const mi = (py * width + px) * 4;
                        if (maskData[mi] > 128) {
                            output[mi] = r; output[mi + 1] = g; output[mi + 2] = b; output[mi + 3] = 255;
                        }
                    }
                }
            }
        }
    }

    ctx.putImageData(new ImageData(output, width, height), minX, minY);
}

// Apply blur brush on specific canvas (for final output, optimized)
function applyBlurBrushOnCanvas(ctx, sourceCtx, points, lineWidth) {
    if (!points || points.length < 2) return;

    const brushRadius = lineWidth * 2;
    const blurRadius = 4;
    const sourceCanvas = sourceCtx.canvas;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x - brushRadius - blurRadius);
        minY = Math.min(minY, p.y - brushRadius - blurRadius);
        maxX = Math.max(maxX, p.x + brushRadius + blurRadius);
        maxY = Math.max(maxY, p.y + brushRadius + blurRadius);
    }

    minX = Math.max(0, Math.floor(minX));
    minY = Math.max(0, Math.floor(minY));
    maxX = Math.min(sourceCanvas.width, Math.ceil(maxX));
    maxY = Math.min(sourceCanvas.height, Math.ceil(maxY));

    if (maxX <= minX || maxY <= minY) return;

    const width = maxX - minX;
    const height = maxY - minY;

    // Pre-compute brush mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, width, height);
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushRadius * 2;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.beginPath();
    maskCtx.moveTo(points[0].x - minX, points[0].y - minY);
    for (let i = 1; i < points.length; i++) {
        maskCtx.lineTo(points[i].x - minX, points[i].y - minY);
    }
    maskCtx.stroke();
    const maskData = maskCtx.getImageData(0, 0, width, height).data;

    const imageData = sourceCtx.getImageData(minX, minY, width, height);
    const data = imageData.data;

    // Fast separable blur
    let current = new Uint8ClampedArray(data);
    let temp = new Uint8ClampedArray(data.length);

    for (let pass = 0; pass < 2; pass++) {
        // Horizontal blur
        for (let py = 0; py < height; py++) {
            for (let px = 0; px < width; px++) {
                const i = (py * width + px) * 4;
                let r = 0, g = 0, b = 0, count = 0;
                for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                    const nx = px + dx;
                    if (nx >= 0 && nx < width) {
                        const j = (py * width + nx) * 4;
                        r += current[j]; g += current[j + 1]; b += current[j + 2];
                        count++;
                    }
                }
                temp[i] = r / count; temp[i + 1] = g / count; temp[i + 2] = b / count; temp[i + 3] = 255;
            }
        }
        // Vertical blur
        for (let py = 0; py < height; py++) {
            for (let px = 0; px < width; px++) {
                const i = (py * width + px) * 4;
                let r = 0, g = 0, b = 0, count = 0;
                for (let dy = -blurRadius; dy <= blurRadius; dy++) {
                    const ny = py + dy;
                    if (ny >= 0 && ny < height) {
                        const j = (ny * width + px) * 4;
                        r += temp[j]; g += temp[j + 1]; b += temp[j + 2];
                        count++;
                    }
                }
                current[i] = r / count; current[i + 1] = g / count; current[i + 2] = b / count; current[i + 3] = 255;
            }
        }
    }

    // Copy only masked pixels
    for (let i = 0; i < width * height; i++) {
        if (maskData[i * 4] > 128) {
            const idx = i * 4;
            data[idx] = current[idx];
            data[idx + 1] = current[idx + 1];
            data[idx + 2] = current[idx + 2];
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imageData, minX, minY);
}

// Fill bucket tool with smart boundary detection
function applyFillBucket(x, y) {
    const color = colorPicker.value;
    const tolerance = 32;
    const fillColor = hexToRgb(color);
    if (!fillColor) return;

    const width = mainCanvas.width;
    const height = mainCanvas.height;
    const totalPixels = width * height;
    const startX = Math.floor(x);
    const startY = Math.floor(y);

    if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

    // Create temp canvas with current state
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.drawImage(mainCanvas, 0, 0);
    tempCtx.drawImage(drawCanvas, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const startIdx = (startY * width + startX) * 4;
    const startColor = { r: data[startIdx], g: data[startIdx+1], b: data[startIdx+2], a: data[startIdx+3] };

    // Skip if clicking on same color
    if (colorsMatch(startColor, { ...fillColor, a: 255 }, 5)) return;

    // Flood fill to determine area
    const visited = new Uint8Array(width * height);
    const stack = [startY * width + startX];
    let fillCount = 0;

    while (stack.length > 0) {
        const pos = stack.pop();
        if (visited[pos]) continue;

        const cx = pos % width;
        const cy = Math.floor(pos / width);
        const idx = pos * 4;

        if (!colorsMatch(startColor, { r: data[idx], g: data[idx+1], b: data[idx+2], a: data[idx+3] }, tolerance)) continue;

        visited[pos] = 1;
        fillCount++;

        if (cx > 0) stack.push(pos - 1);
        if (cx < width - 1) stack.push(pos + 1);
        if (cy > 0) stack.push(pos - width);
        if (cy < height - 1) stack.push(pos + width);
    }

    // Create fill result
    const fillData = drawCtx.getImageData(0, 0, width, height);
    const fd = fillData.data;

    // If fill covers >70% of canvas, fill entire canvas
    if (fillCount > totalPixels * 0.7) {
        for (let i = 0; i < fd.length; i += 4) {
            fd[i] = fillColor.r;
            fd[i+1] = fillColor.g;
            fd[i+2] = fillColor.b;
            fd[i+3] = 255;
        }
    } else {
        // Use flood fill result
        for (let i = 0; i < visited.length; i++) {
            if (visited[i]) {
                const idx = i * 4;
                fd[idx] = fillColor.r;
                fd[idx+1] = fillColor.g;
                fd[idx+2] = fillColor.b;
                fd[idx+3] = 255;
            }
        }
    }

    drawCtx.putImageData(fillData, 0, 0);
    drawHistory.push({ shape: 'fillBucket', imageData: drawCtx.getImageData(0, 0, width, height), x: startX, y: startY, color });
    redoHistory = [];
    updateUndoRedoButtons();
}

// Helper functions for fill bucket
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

// Result image drag handlers
function handleResultDragStart(e) {
    if (!currentResultCanvas) return;

    resultImage.classList.add('dragging');

    // Get format and quality settings
    const { mimeType, extension } = getFormatInfo(currentFormat);
    const quality = qualitySlider.value / 100;

    // Create data URL for the image
    const dataUrl = currentResultCanvas.toDataURL(mimeType, quality);
    const filename = `edited-image.${extension}`;

    // Set drag data for external applications
    e.dataTransfer.effectAllowed = 'copyMove';

    // Try to add file first (before any setData calls)
    let fileAdded = false;
    if (currentResultBlob && e.dataTransfer.items) {
        try {
            const file = new File([currentResultBlob], filename, { type: mimeType });
            e.dataTransfer.items.add(file);
            fileAdded = true;
        } catch (err) {
            console.log('Could not add file to drag:', err);
        }
    }

    // DownloadURL format allows dragging to desktop/file explorer (Chrome)
    e.dataTransfer.setData('DownloadURL', `${mimeType}:${filename}:${dataUrl}`);

    // Only add text fallbacks if file wasn't added
    if (!fileAdded) {
        e.dataTransfer.setData('text/uri-list', dataUrl);
    }

    // Set drag image
    e.dataTransfer.setDragImage(resultImage, resultImage.width / 2, resultImage.height / 2);
}

function handleResultDragEnd(e) {
    resultImage.classList.remove('dragging');
}

// Export functions
function generateResultCanvas() {
    console.log('=== generateResultCanvas START ===');
    if (!image) return null;

    console.log('image dimensions:', image.width, 'x', image.height);
    console.log('cropState:', JSON.stringify(cropState));
    console.log('scale:', scale);
    console.log('drawHistory length:', drawHistory.length);

    const actualX = cropState.x / scale;
    const actualY = cropState.y / scale;
    const actualWidth = cropState.width / scale;
    const actualHeight = cropState.height / scale;

    const finalWidth = targetDimensions ? targetDimensions.width : Math.round(actualWidth);
    const finalHeight = targetDimensions ? targetDimensions.height : Math.round(actualHeight);

    // Use integer dimensions to avoid canvas size issues
    const canvasWidth = Math.round(actualWidth);
    const canvasHeight = Math.round(actualHeight);

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    console.log('generateResultCanvas: canvasWidth:', canvasWidth, 'canvasHeight:', canvasHeight);

    tempCtx.drawImage(
        image,
        actualX, actualY, actualWidth, actualHeight,
        0, 0, canvasWidth, canvasHeight
    );

    if (drawHistory.length > 0) {
        // Create a source canvas for blur/mosaic operations
        const sourceCanvas = document.createElement('canvas');
        const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
        sourceCanvas.width = canvasWidth;
        sourceCanvas.height = canvasHeight;
        sourceCtx.drawImage(tempCanvas, 0, 0);

        const brushTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter', 'eraser'];

        for (const item of drawHistory) {
            tempCtx.save();

            if (item.shape === 'fillBucket') {
                // For fill bucket, we need to scale the imageData
                if (item.imageData) {
                    // Create a temp canvas with the stored imageData
                    const fillCanvas = document.createElement('canvas');
                    fillCanvas.width = item.imageData.width;
                    fillCanvas.height = item.imageData.height;
                    const fillCtx = fillCanvas.getContext('2d', { willReadFrequently: true });
                    fillCtx.putImageData(item.imageData, 0, 0);

                    // Draw scaled and offset to output
                    tempCtx.drawImage(
                        fillCanvas,
                        cropState.x, cropState.y, cropState.width, cropState.height,
                        0, 0, canvasWidth, canvasHeight
                    );
                }
            } else if (brushTypes.includes(item.shape)) {
                const scaledPoints = item.points.map(p => ({
                    x: (p.x - cropState.x) / scale,
                    y: (p.y - cropState.y) / scale
                }));
                drawPenStroke(tempCtx, scaledPoints, item.color, item.lineWidth / scale, item.penType || item.shape);
            } else if (item.shape === 'mosaic') {
                const scaledPoints = item.points.map(p => ({
                    x: (p.x - cropState.x) / scale,
                    y: (p.y - cropState.y) / scale
                }));
                applyMosaicBrushOnCanvas(tempCtx, sourceCtx, scaledPoints, item.lineWidth / scale);
            } else if (item.shape === 'blur') {
                const scaledPoints = item.points.map(p => ({
                    x: (p.x - cropState.x) / scale,
                    y: (p.y - cropState.y) / scale
                }));
                applyBlurBrushOnCanvas(tempCtx, sourceCtx, scaledPoints, item.lineWidth / scale);
            } else if (item.shape === 'text') {
                const scaledX = (item.x - cropState.x) / scale;
                const scaledY = (item.y - cropState.y) / scale;
                drawText(tempCtx, item.text, scaledX, scaledY, item.color, item.fontSize / scale);
            } else {
                const scaledX1 = (item.x1 - cropState.x) / scale;
                const scaledY1 = (item.y1 - cropState.y) / scale;
                const scaledX2 = (item.x2 - cropState.x) / scale;
                const scaledY2 = (item.y2 - cropState.y) / scale;
                drawShape(tempCtx, item.shape, scaledX1, scaledY1, scaledX2, scaledY2, item.color, item.lineWidth / scale, item.fill, sourceCtx);
            }

            tempCtx.restore();
        }
    }

    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d', { willReadFrequently: true });
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
        'webp': { mimeType: 'image/webp', extension: 'webp' },
        'avif': { mimeType: 'image/avif', extension: 'avif' },
        'bmp': { mimeType: 'image/bmp', extension: 'bmp' },
        'svg': { mimeType: 'image/svg+xml', extension: 'svg' }
    };
    return formats[format] || formats['png'];
}

function showResult() {
    // 使用帶調整的版本
    currentResultCanvas = generateResultCanvasWithAdjustments();
    if (!currentResultCanvas) return;

    const { mimeType } = getFormatInfo(currentFormat);
    const quality = qualitySlider.value / 100;

    // Pre-generate blob for drag and drop
    currentResultCanvas.toBlob((blob) => {
        currentResultBlob = blob;
    }, mimeType, quality);

    resultImage.src = currentResultCanvas.toDataURL('image/png');
    resultTabBtn.disabled = false;
    switchTab('result');
}

function downloadImage() {
    if (!image) return;

    // Generate result canvas on-the-fly with adjustments
    const canvas = generateResultCanvasWithAdjustments();
    if (!canvas) return;

    const { mimeType, extension } = getFormatInfo(currentFormat);
    const quality = qualitySlider.value / 100;

    // BMP 格式需要特殊處理
    if (currentFormat === 'bmp') {
        const bmpBlob = canvasToBMP(canvas);
        const link = document.createElement('a');
        link.download = `edited-image.${extension}`;
        link.href = URL.createObjectURL(bmpBlob);
        link.click();
        URL.revokeObjectURL(link.href);
        return;
    }

    // SVG 格式：將圖片嵌入 SVG 容器
    if (currentFormat === 'svg') {
        const svgBlob = canvasToSVG(canvas);
        const link = document.createElement('a');
        link.download = `edited-image.${extension}`;
        link.href = URL.createObjectURL(svgBlob);
        link.click();
        URL.revokeObjectURL(link.href);
        return;
    }

    // 檢查瀏覽器是否支援該格式
    const dataUrl = canvas.toDataURL(mimeType, quality);

    // 如果瀏覽器不支援該格式，toDataURL 會返回 PNG
    if (currentFormat !== 'png' && dataUrl.startsWith('data:image/png')) {
        alert(`您的瀏覽器不支援 ${currentFormat.toUpperCase()} 格式，將改用 PNG 格式下載。`);
    }

    const link = document.createElement('a');
    link.download = `edited-image.${extension}`;
    link.href = dataUrl;
    link.click();
}

// 將 Canvas 轉換為 BMP 格式
function canvasToBMP(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // BMP 檔案結構
    const rowSize = Math.floor((24 * width + 31) / 32) * 4;
    const pixelArraySize = rowSize * height;
    const fileSize = 54 + pixelArraySize;

    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);

    // BMP 檔頭 (14 bytes)
    view.setUint8(0, 0x42); // 'B'
    view.setUint8(1, 0x4D); // 'M'
    view.setUint32(2, fileSize, true); // 檔案大小
    view.setUint32(6, 0, true); // 保留
    view.setUint32(10, 54, true); // 像素資料偏移

    // DIB 標頭 (40 bytes)
    view.setUint32(14, 40, true); // 標頭大小
    view.setInt32(18, width, true); // 寬度
    view.setInt32(22, -height, true); // 高度 (負值表示從上到下)
    view.setUint16(26, 1, true); // 色彩平面數
    view.setUint16(28, 24, true); // 每像素位元數
    view.setUint32(30, 0, true); // 壓縮方式 (無壓縮)
    view.setUint32(34, pixelArraySize, true); // 圖像大小
    view.setInt32(38, 2835, true); // 水平解析度 (72 DPI)
    view.setInt32(42, 2835, true); // 垂直解析度
    view.setUint32(46, 0, true); // 調色板顏色數
    view.setUint32(50, 0, true); // 重要顏色數

    // 像素資料 (BGR 順序)
    let offset = 54;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            view.setUint8(offset++, data[i + 2]); // B
            view.setUint8(offset++, data[i + 1]); // G
            view.setUint8(offset++, data[i]);     // R
        }
        // 每行需要 4 byte 對齊
        const padding = rowSize - width * 3;
        for (let p = 0; p < padding; p++) {
            view.setUint8(offset++, 0);
        }
    }

    return new Blob([buffer], { type: 'image/bmp' });
}

// 將 Canvas 轉換為 SVG 格式（嵌入點陣圖）
function canvasToSVG(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const dataUrl = canvas.toDataURL('image/png');

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <title>Edited Image</title>
    <desc>Generated by Image Editor</desc>
    <image x="0" y="0" width="${width}" height="${height}"
           xlink:href="${dataUrl}"
           preserveAspectRatio="none"/>
</svg>`;

    return new Blob([svgContent], { type: 'image/svg+xml' });
}

async function copyImageToClipboard() {
    if (!image) return;

    try {
        // Generate result canvas on-the-fly with adjustments
        const canvas = generateResultCanvasWithAdjustments();
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

// Result page download function
function downloadResultImage() {
    if (!resultImage || !resultImage.src) return;

    const link = document.createElement('a');
    const { extension } = getFormatInfo(currentFormat);
    link.download = `edited-image.${extension}`;
    link.href = resultImage.src;
    link.click();
}

// Result page copy function
async function copyResultImageToClipboard() {
    if (!resultImage || !resultImage.src) return;

    try {
        const response = await fetch(resultImage.src);
        const blob = await response.blob();

        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ]);

        resultCopyBtn.classList.add('success');
        setTimeout(() => {
            resultCopyBtn.classList.remove('success');
        }, 1500);
    } catch (err) {
        console.error('複製失敗:', err);
        resultCopyBtn.classList.add('error');
        setTimeout(() => {
            resultCopyBtn.classList.remove('error');
        }, 1500);
    }
}

// Result page share function using Web Share API
async function shareResultImage() {
    if (!resultImage || !resultImage.src) return;

    // Check if Web Share API is available
    if (!navigator.share) {
        alert('您的瀏覽器不支援分享功能，請改用複製或下載');
        return;
    }

    try {
        const response = await fetch(resultImage.src);
        const blob = await response.blob();

        // Get format from result image src
        const format = currentFormat || 'png';
        const formatInfo = getFormatInfo(format);
        const fileName = `image.${formatInfo.extension}`;

        // Create a file from the blob
        const file = new File([blob], fileName, { type: formatInfo.mimeType });

        // Check if files can be shared
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: '分享圖片',
                text: '來自圖片編輯工具的圖片'
            });

            resultShareBtn.classList.add('success');
            setTimeout(() => {
                resultShareBtn.classList.remove('success');
            }, 1500);
        } else {
            // Fallback: share without file (just text)
            await navigator.share({
                title: '圖片編輯工具',
                text: '使用圖片編輯工具編輯的圖片'
            });
        }
    } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
            console.error('分享失敗:', err);
            resultShareBtn.classList.add('error');
            setTimeout(() => {
                resultShareBtn.classList.remove('error');
            }, 1500);
        }
    }
}

// ========================================
// 新增功能：對話框事件設置
// ========================================
function setupModalEvents() {
    // URL 對話框
    const urlModalClose = document.getElementById('urlModalClose');
    const urlModalCancel = document.getElementById('urlModalCancel');
    const urlModalConfirm = document.getElementById('urlModalConfirm');
    if (urlModalClose) urlModalClose.addEventListener('click', () => hideModal(urlModal));
    if (urlModalCancel) urlModalCancel.addEventListener('click', () => hideModal(urlModal));
    if (urlModalConfirm) urlModalConfirm.addEventListener('click', loadImageFromUrl);

    // 調整大小對話框
    const resizeModalClose = document.getElementById('resizeModalClose');
    const resizeModalCancel = document.getElementById('resizeModalCancel');
    const resizeModalConfirm = document.getElementById('resizeModalConfirm');
    const resizeWidth = document.getElementById('resizeWidth');
    const resizeHeight = document.getElementById('resizeHeight');
    const resizeMaintainRatio = document.getElementById('resizeMaintainRatio');

    if (resizeModalClose) resizeModalClose.addEventListener('click', () => hideModal(resizeModal));
    if (resizeModalCancel) resizeModalCancel.addEventListener('click', () => hideModal(resizeModal));
    if (resizeModalConfirm) resizeModalConfirm.addEventListener('click', applyResize);

    // 維持比例邏輯
    let resizeAspectRatio = 1;
    if (resizeWidth) {
        resizeWidth.addEventListener('input', () => {
            if (resizeMaintainRatio?.checked && resizeAspectRatio) {
                resizeHeight.value = Math.round(resizeWidth.value / resizeAspectRatio);
            }
        });
    }
    if (resizeHeight) {
        resizeHeight.addEventListener('input', () => {
            if (resizeMaintainRatio?.checked && resizeAspectRatio) {
                resizeWidth.value = Math.round(resizeHeight.value * resizeAspectRatio);
            }
        });
    }

    // 浮水印對話框
    const watermarkModalClose = document.getElementById('watermarkModalClose');
    const watermarkModalCancel = document.getElementById('watermarkModalCancel');
    const watermarkModalConfirm = document.getElementById('watermarkModalConfirm');
    const watermarkOpacity = document.getElementById('watermarkOpacity');
    const watermarkOpacityValue = document.getElementById('watermarkOpacityValue');
    const watermarkImageOpacity = document.getElementById('watermarkImageOpacity');
    const watermarkImageOpacityValue = document.getElementById('watermarkImageOpacityValue');
    const watermarkImageSize = document.getElementById('watermarkImageSize');
    const watermarkImageSizeValue = document.getElementById('watermarkImageSizeValue');
    const watermarkImageUpload = document.getElementById('watermarkImageUpload');
    const watermarkImageInput = document.getElementById('watermarkImageInput');

    if (watermarkModalClose) watermarkModalClose.addEventListener('click', () => hideModal(watermarkModal));
    if (watermarkModalCancel) watermarkModalCancel.addEventListener('click', () => hideModal(watermarkModal));
    if (watermarkModalConfirm) watermarkModalConfirm.addEventListener('click', applyWatermark);

    // 浮水印類型切換
    document.querySelectorAll('.watermark-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.watermark-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const type = tab.dataset.type;
            watermarkSettings.type = type;
            document.getElementById('watermarkTextContent')?.classList.toggle('hidden', type !== 'text');
            document.getElementById('watermarkImageContent')?.classList.toggle('hidden', type !== 'image');
        });
    });

    // 浮水印位置選擇
    document.querySelectorAll('.position-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.position-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            watermarkSettings.position = btn.dataset.position;
        });
    });

    // 浮水印透明度更新
    if (watermarkOpacity) {
        watermarkOpacity.addEventListener('input', () => {
            if (watermarkOpacityValue) watermarkOpacityValue.textContent = watermarkOpacity.value + '%';
        });
    }
    if (watermarkImageOpacity) {
        watermarkImageOpacity.addEventListener('input', () => {
            if (watermarkImageOpacityValue) watermarkImageOpacityValue.textContent = watermarkImageOpacity.value + '%';
        });
    }
    if (watermarkImageSize) {
        watermarkImageSize.addEventListener('input', () => {
            if (watermarkImageSizeValue) watermarkImageSizeValue.textContent = watermarkImageSize.value + '%';
        });
    }

    // 浮水印圖片上傳
    if (watermarkImageUpload) {
        watermarkImageUpload.addEventListener('click', () => watermarkImageInput?.click());
    }
    if (watermarkImageInput) {
        watermarkImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                        watermarkSettings.image = img;
                        watermarkImageUpload.innerHTML = '<p>圖片已選擇</p>';
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 直方圖面板
    const histogramPanelClose = document.getElementById('histogramPanelClose');
    if (histogramPanelClose) histogramPanelClose.addEventListener('click', () => {
        histogramPanel?.classList.remove('visible');
    });

    // 直方圖通道切換
    document.querySelectorAll('.channel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.channel-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (histogramPanel?.classList.contains('visible')) {
                generateHistogram(btn.dataset.channel);
            }
        });
    });

    // 點擊外部關閉對話框
    [urlModal, resizeModal, watermarkModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) hideModal(modal);
            });
        }
    });
}

function showModal(modal) {
    if (modal) modal.classList.add('visible');
}

function hideModal(modal) {
    if (modal) modal.classList.remove('visible');
}

// ========================================
// 新增功能：變換功能
// ========================================
function rotateImage(degrees) {
    if (!image) return;

    // 保存原始圖片
    if (!originalImage) originalImage = image;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const radians = (degrees * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));

    // 計算旋轉後的尺寸
    const newWidth = Math.round(image.width * cos + image.height * sin);
    const newHeight = Math.round(image.width * sin + image.height * cos);

    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;

    tempCtx.translate(newWidth / 2, newHeight / 2);
    tempCtx.rotate(radians);
    tempCtx.drawImage(image, -image.width / 2, -image.height / 2);

    const rotatedImage = new Image();
    rotatedImage.onload = () => {
        image = rotatedImage;
        setupCanvas();
    };
    rotatedImage.src = tempCanvas.toDataURL('image/png');
}

function flipImage(direction) {
    if (!image) return;

    // 保存原始圖片
    if (!originalImage) originalImage = image;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = image.width;
    tempCanvas.height = image.height;

    if (direction === 'horizontal') {
        tempCtx.translate(image.width, 0);
        tempCtx.scale(-1, 1);
    } else {
        tempCtx.translate(0, image.height);
        tempCtx.scale(1, -1);
    }

    tempCtx.drawImage(image, 0, 0);

    const flippedImage = new Image();
    flippedImage.onload = () => {
        image = flippedImage;
        setupCanvas();
    };
    flippedImage.src = tempCanvas.toDataURL('image/png');
}

function showResizeModal() {
    if (!image) return;

    const resizeWidth = document.getElementById('resizeWidth');
    const resizeHeight = document.getElementById('resizeHeight');
    const originalSizeText = document.getElementById('originalSizeText');

    if (resizeWidth) resizeWidth.value = image.width;
    if (resizeHeight) resizeHeight.value = image.height;
    if (originalSizeText) originalSizeText.textContent = `${image.width} × ${image.height}`;

    showModal(resizeModal);
}

function applyResize() {
    if (!image) return;

    const newWidth = parseInt(document.getElementById('resizeWidth')?.value) || image.width;
    const newHeight = parseInt(document.getElementById('resizeHeight')?.value) || image.height;

    if (newWidth === image.width && newHeight === image.height) {
        hideModal(resizeModal);
        return;
    }

    // 保存原始圖片
    if (!originalImage) originalImage = image;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(image, 0, 0, newWidth, newHeight);

    const resizedImage = new Image();
    resizedImage.onload = () => {
        image = resizedImage;
        setupCanvas();
        hideModal(resizeModal);
    };
    resizedImage.src = tempCanvas.toDataURL('image/png');
}

// ========================================
// 新增功能：色彩調整
// ========================================
function handleAdjustmentChange() {
    adjustmentState.brightness = parseInt(brightnessSlider?.value) || 0;
    adjustmentState.contrast = parseInt(contrastSlider?.value) || 0;
    adjustmentState.saturation = parseInt(saturationSlider?.value) || 0;
    adjustmentState.hue = parseInt(hueSliderAdjust?.value) || 0;

    // 更新數值顯示
    if (brightnessValue) brightnessValue.textContent = adjustmentState.brightness;
    if (contrastValue) contrastValue.textContent = adjustmentState.contrast;
    if (saturationValue) saturationValue.textContent = adjustmentState.saturation;
    if (hueValueDisplay) hueValueDisplay.textContent = adjustmentState.hue;

    applyAdjustmentPreview();
}

function applyAdjustmentPreview() {
    if (!image) return;

    // 使用 CSS filter 進行即時預覽
    const brightness = 100 + adjustmentState.brightness;
    const contrast = 100 + adjustmentState.contrast;
    const saturate = 100 + adjustmentState.saturation;
    const hueRotate = adjustmentState.hue;

    let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg)`;

    // 添加濾鏡效果
    switch (currentFilter) {
        case 'blackWhite':
            filterString += ' grayscale(100%)';
            break;
        case 'sepia':
            filterString += ' sepia(80%)';
            break;
        case 'vintage':
            filterString += ' sepia(30%) contrast(90%) brightness(110%)';
            break;
    }

    mainCanvas.style.filter = filterString;
}

function applyAutoAdjust() {
    // 自動對比度拉伸
    adjustmentState.brightness = 10;
    adjustmentState.contrast = 20;
    adjustmentState.saturation = 10;

    if (brightnessSlider) brightnessSlider.value = adjustmentState.brightness;
    if (contrastSlider) contrastSlider.value = adjustmentState.contrast;
    if (saturationSlider) saturationSlider.value = adjustmentState.saturation;

    handleAdjustmentChange();
}

function applyGrayscale() {
    currentFilter = 'blackWhite';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="blackWhite"]')?.classList.add('active');
    applyAdjustmentPreview();
}

function applyNegative() {
    if (!image) return;

    // 保存原始圖片
    if (!originalImage) originalImage = image;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    tempCtx.drawImage(image, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];       // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
    }

    tempCtx.putImageData(imageData, 0, 0);

    const negativeImage = new Image();
    negativeImage.onload = () => {
        image = negativeImage;
        setupCanvas();
    };
    negativeImage.src = tempCanvas.toDataURL('image/png');
}

function resetAdjustments() {
    adjustmentState = { brightness: 0, contrast: 0, saturation: 0, hue: 0 };
    currentFilter = 'none';

    if (brightnessSlider) brightnessSlider.value = 0;
    if (contrastSlider) contrastSlider.value = 0;
    if (saturationSlider) saturationSlider.value = 0;
    if (hueSliderAdjust) hueSliderAdjust.value = 0;

    if (brightnessValue) brightnessValue.textContent = '0';
    if (contrastValue) contrastValue.textContent = '0';
    if (saturationValue) saturationValue.textContent = '0';
    if (hueValueDisplay) hueValueDisplay.textContent = '0';

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="none"]')?.classList.add('active');

    mainCanvas.style.filter = '';

    // 如果有原始圖片，恢復
    if (originalImage) {
        image = originalImage;
        originalImage = null;
        setupCanvas();
    }
}

// ========================================
// 新增功能：濾鏡效果（應用到輸出）
// ========================================
function applyFilterToCanvas(ctx, filter, width, height) {
    if (filter === 'none') return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    switch (filter) {
        case 'blackWhite':
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            }
            break;

        case 'sepia':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2];
                data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
                data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
                data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
            }
            break;

        case 'sharpen':
            applyConvolution(ctx, width, height, [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ]);
            return;

        case 'emboss':
            applyConvolution(ctx, width, height, [
                -2, -1, 0,
                -1, 1, 1,
                0, 1, 2
            ]);
            return;

        case 'vignette':
            applyVignette(ctx, width, height);
            return;

        case 'vintage':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.1);
                data[i + 1] = Math.min(255, data[i + 1] * 0.9);
                data[i + 2] = Math.min(255, data[i + 2] * 0.8);
            }
            break;
    }

    ctx.putImageData(imageData, 0, 0);
}

function applyConvolution(ctx, width, height, kernel) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);
    const side = Math.round(Math.sqrt(kernel.length));
    const halfSide = Math.floor(side / 2);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = 0; ky < side; ky++) {
                for (let kx = 0; kx < side; kx++) {
                    const px = Math.min(width - 1, Math.max(0, x + kx - halfSide));
                    const py = Math.min(height - 1, Math.max(0, y + ky - halfSide));
                    const idx = (py * width + px) * 4;
                    const weight = kernel[ky * side + kx];
                    r += data[idx] * weight;
                    g += data[idx + 1] * weight;
                    b += data[idx + 2] * weight;
                }
            }
            const i = (y * width + x) * 4;
            output[i] = Math.min(255, Math.max(0, r));
            output[i + 1] = Math.min(255, Math.max(0, g));
            output[i + 2] = Math.min(255, Math.max(0, b));
        }
    }

    ctx.putImageData(new ImageData(output, width, height), 0, 0);
}

function applyVignette(ctx, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const factor = 1 - Math.pow(dist / maxDist, 2) * 0.7;
            const i = (y * width + x) * 4;
            data[i] *= factor;
            data[i + 1] *= factor;
            data[i + 2] *= factor;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function applyBrightnessContrast(ctx, width, height, brightness, contrast) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128 + brightness));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128 + brightness));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128 + brightness));
    }

    ctx.putImageData(imageData, 0, 0);
}

// ========================================
// 新增功能：檔案操作
// ========================================
function showUrlModal() {
    const imageUrlInput = document.getElementById('imageUrlInput');
    if (imageUrlInput) imageUrlInput.value = '';
    showModal(urlModal);
}

function loadImageFromUrl() {
    const url = document.getElementById('imageUrlInput')?.value?.trim();
    if (!url) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        ensureMinimumSize(img, 1280, 800, (finalImage) => {
            image = finalImage;
            originalImage = null;
            showEditor();
            setupCanvas();
            hideModal(urlModal);
        });
    };
    img.onerror = () => {
        alert('無法載入圖片，請確認網址是否正確，或圖片是否允許跨域存取。');
    };
    img.src = url;
}

function printImage() {
    if (!image) return;

    const canvas = generateResultCanvas();
    if (!canvas) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head><title>列印圖片</title></head>
        <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
            <img src="${canvas.toDataURL('image/png')}" style="max-width:100%;max-height:100vh;">
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
        printWindow.print();
    };
}

// ========================================
// 新增功能：浮水印
// ========================================
function showWatermarkModal() {
    if (!image) return;
    showModal(watermarkModal);
}

function applyWatermark() {
    if (!image) return;

    // 保存原始圖片
    if (!originalImage) originalImage = image;

    const text = document.getElementById('watermarkText')?.value;
    const fontFamily = document.getElementById('watermarkFontFamily')?.value || 'Arial, sans-serif';
    const fontSize = parseInt(document.getElementById('watermarkFontSize')?.value) || 24;
    const color = document.getElementById('watermarkColor')?.value || '#ffffff';
    const opacity = (parseInt(document.getElementById('watermarkOpacity')?.value) || 50) / 100;
    const position = watermarkSettings.position;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    tempCtx.drawImage(image, 0, 0);

    tempCtx.globalAlpha = opacity;

    if (watermarkSettings.type === 'text' && text) {
        tempCtx.font = `${fontSize}px ${fontFamily}`;
        tempCtx.fillStyle = color;

        const metrics = tempCtx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = fontSize;
        const padding = 20;

        let x, y;
        switch (position) {
            case 'top-left': x = padding; y = padding + textHeight; break;
            case 'top-center': x = (image.width - textWidth) / 2; y = padding + textHeight; break;
            case 'top-right': x = image.width - textWidth - padding; y = padding + textHeight; break;
            case 'center-left': x = padding; y = image.height / 2; break;
            case 'center': x = (image.width - textWidth) / 2; y = image.height / 2; break;
            case 'center-right': x = image.width - textWidth - padding; y = image.height / 2; break;
            case 'bottom-left': x = padding; y = image.height - padding; break;
            case 'bottom-center': x = (image.width - textWidth) / 2; y = image.height - padding; break;
            case 'bottom-right': default: x = image.width - textWidth - padding; y = image.height - padding; break;
        }

        tempCtx.fillText(text, x, y);
    } else if (watermarkSettings.type === 'image' && watermarkSettings.image) {
        const imgOpacity = (parseInt(document.getElementById('watermarkImageOpacity')?.value) || 80) / 100;
        const imgSize = (parseInt(document.getElementById('watermarkImageSize')?.value) || 30) / 100;

        tempCtx.globalAlpha = imgOpacity;

        const wmWidth = image.width * imgSize;
        const wmHeight = (watermarkSettings.image.height / watermarkSettings.image.width) * wmWidth;
        const padding = 20;

        let x, y;
        switch (position) {
            case 'top-left': x = padding; y = padding; break;
            case 'top-center': x = (image.width - wmWidth) / 2; y = padding; break;
            case 'top-right': x = image.width - wmWidth - padding; y = padding; break;
            case 'center-left': x = padding; y = (image.height - wmHeight) / 2; break;
            case 'center': x = (image.width - wmWidth) / 2; y = (image.height - wmHeight) / 2; break;
            case 'center-right': x = image.width - wmWidth - padding; y = (image.height - wmHeight) / 2; break;
            case 'bottom-left': x = padding; y = image.height - wmHeight - padding; break;
            case 'bottom-center': x = (image.width - wmWidth) / 2; y = image.height - wmHeight - padding; break;
            case 'bottom-right': default: x = image.width - wmWidth - padding; y = image.height - wmHeight - padding; break;
        }

        tempCtx.drawImage(watermarkSettings.image, x, y, wmWidth, wmHeight);
    }

    const watermarkedImage = new Image();
    watermarkedImage.onload = () => {
        image = watermarkedImage;
        setupCanvas();
        hideModal(watermarkModal);
    };
    watermarkedImage.src = tempCanvas.toDataURL('image/png');
}

// ========================================
// 新增功能：直方圖
// ========================================
function toggleHistogramPanel() {
    if (!histogramPanel) return;
    histogramPanel.classList.toggle('visible');
    if (histogramPanel.classList.contains('visible')) {
        generateHistogram('rgb');
    }
}

function generateHistogram(channel = 'rgb') {
    if (!image || !histogramCanvas) return;

    const hCtx = histogramCanvas.getContext('2d');
    const width = histogramCanvas.width;
    const height = histogramCanvas.height;

    // 取得圖片數據
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = mainCanvas.width;
    tempCanvas.height = mainCanvas.height;
    tempCtx.drawImage(mainCanvas, 0, 0);
    tempCtx.drawImage(drawCanvas, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;

    // 計算直方圖
    const histR = new Array(256).fill(0);
    const histG = new Array(256).fill(0);
    const histB = new Array(256).fill(0);

    for (let i = 0; i < data.length; i += 4) {
        histR[data[i]]++;
        histG[data[i + 1]]++;
        histB[data[i + 2]]++;
    }

    // 找到最大值
    let maxVal = 0;
    for (let i = 0; i < 256; i++) {
        if (channel === 'rgb' || channel === 'r') maxVal = Math.max(maxVal, histR[i]);
        if (channel === 'rgb' || channel === 'g') maxVal = Math.max(maxVal, histG[i]);
        if (channel === 'rgb' || channel === 'b') maxVal = Math.max(maxVal, histB[i]);
    }

    // 清除畫布
    hCtx.fillStyle = '#1a1a2e';
    hCtx.fillRect(0, 0, width, height);

    // 繪製直方圖
    const barWidth = width / 256;

    if (channel === 'rgb' || channel === 'r') {
        hCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        for (let i = 0; i < 256; i++) {
            const barHeight = (histR[i] / maxVal) * height;
            hCtx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
        }
    }

    if (channel === 'rgb' || channel === 'g') {
        hCtx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        for (let i = 0; i < 256; i++) {
            const barHeight = (histG[i] / maxVal) * height;
            hCtx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
        }
    }

    if (channel === 'rgb' || channel === 'b') {
        hCtx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        for (let i = 0; i < 256; i++) {
            const barHeight = (histB[i] / maxVal) * height;
            hCtx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
        }
    }
}

// ========================================
// 新增功能：取色器
// ========================================
let isEyedropperActive = false;

function toggleEyedropperMode() {
    isEyedropperActive = !isEyedropperActive;
    const eyedropperBtn = document.getElementById('eyedropperBtn');

    if (isEyedropperActive) {
        eyedropperBtn?.classList.add('active');
        // 改變游標為吸管
        mainCanvas.style.cursor = 'crosshair';
        drawCanvas.style.cursor = 'crosshair';

        // 添加點擊事件來取色
        mainCanvas.addEventListener('click', eyedropperClickHandler);
        drawCanvas.addEventListener('click', eyedropperClickHandler);
    } else {
        eyedropperBtn?.classList.remove('active');
        mainCanvas.style.cursor = 'default';
        updateDrawCursor();

        // 移除取色事件
        mainCanvas.removeEventListener('click', eyedropperClickHandler);
        drawCanvas.removeEventListener('click', eyedropperClickHandler);
    }
}

function eyedropperClickHandler(e) {
    if (!isEyedropperActive) return;

    const rect = mainCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleEyedropper(x, y);
}

function handleEyedropper(x, y) {
    if (!mainCtx) return;

    // 計算實際圖片座標（考慮縮放）
    const scaleX = mainCanvas.width / mainCanvas.offsetWidth;
    const scaleY = mainCanvas.height / mainCanvas.offsetHeight;
    const actualX = Math.floor(x * scaleX);
    const actualY = Math.floor(y * scaleY);

    // 從主畫布取色
    const pixel = mainCtx.getImageData(actualX, actualY, 1, 1).data;
    const color = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;

    // 更新顏色選擇器
    colorPicker.value = color;
    colorHexInput.value = color.toUpperCase();
    updateColorPreview(color);
    updateSwatchSelection(color);

    // 自動退出取色模式
    toggleEyedropperMode();
}

// ========================================
// 修改匯出功能以應用調整
// ========================================
function generateResultCanvasWithAdjustments() {
    const canvas = generateResultCanvas();
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // 應用亮度對比度
    if (adjustmentState.brightness !== 0 || adjustmentState.contrast !== 0) {
        const brightnessValue = adjustmentState.brightness * 2.55;
        const contrastValue = adjustmentState.contrast * 2.55;
        applyBrightnessContrast(ctx, width, height, brightnessValue, contrastValue);
    }

    // 應用飽和度和色調
    if (adjustmentState.saturation !== 0 || adjustmentState.hue !== 0) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i + 1], b = data[i + 2];

            // 轉換到 HSL
            const max = Math.max(r, g, b) / 255;
            const min = Math.min(r, g, b) / 255;
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r / 255: h = ((g - b) / 255 / d + (g < b ? 6 : 0)) / 6; break;
                    case g / 255: h = ((b - r) / 255 / d + 2) / 6; break;
                    case b / 255: h = ((r - g) / 255 / d + 4) / 6; break;
                }
            }

            // 調整色調和飽和度
            h = (h + adjustmentState.hue / 360) % 1;
            if (h < 0) h += 1;
            s = Math.min(1, Math.max(0, s * (1 + adjustmentState.saturation / 100)));

            // 轉回 RGB
            let r2, g2, b2;
            if (s === 0) {
                r2 = g2 = b2 = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r2 = hue2rgb(p, q, h + 1/3);
                g2 = hue2rgb(p, q, h);
                b2 = hue2rgb(p, q, h - 1/3);
            }

            data[i] = Math.round(r2 * 255);
            data[i + 1] = Math.round(g2 * 255);
            data[i + 2] = Math.round(b2 * 255);
        }

        ctx.putImageData(imageData, 0, 0);
    }

    // 應用濾鏡
    if (currentFilter !== 'none') {
        applyFilterToCanvas(ctx, currentFilter, width, height);
    }

    return canvas;
}

// Initialize
init();
