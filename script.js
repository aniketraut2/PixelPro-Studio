// Get references to various HTML elements
const fileInput = document.querySelector(".file-input");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate button");
const previewImg = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");

// Initialize filter and rotation variables
let brightness = 100;
let saturation = 100;
let inversion = 0;
let grayscale = 0;
let rotateDeg = 0;
let flipHorizontal = 1;
let flipVertical = 1;

// Function to load the selected image
const loadImage = () => {
    const file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilter();
        document.querySelector(".container").classList.remove("disable");
    });
};

// Function to apply the selected filter and rotation to the image
const applyFilterAndRotation = () => {
    previewImg.style.transform = `rotate(${rotateDeg}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

// Function to update the selected filter value
const updateFilter = () => {
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }

    filterValue.innerText = `${filterSlider.value}%`;
    applyFilterAndRotation();
};

// Function to handle the rotation and flip options
const handleRotationAndFlip = (optionId) => {
    if (optionId === "left") {
        rotateDeg -= 90;
    } else if (optionId === "right") {
        rotateDeg += 90;
    } else if (optionId === "horizontal") {
        flipHorizontal *= -1;
    } else if (optionId === "vertical") {
        flipVertical *= -1;
    }
    applyFilterAndRotation();
};

// Function to reset all filters and rotation
const resetFilter = () => {
    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;
    rotateDeg = 0;
    flipHorizontal = 1;
    flipVertical = 1;

    // Set the default active filter to "Brightness"
    document.querySelector(".active").classList.remove("active");
    filterOptions[0].classList.add("active");
    filterName.innerText = "Brightness";

    filterSlider.max = "200";
    filterSlider.value = brightness;
    filterValue.innerText = `${brightness}%`;

    applyFilterAndRotation();
};

// Function to save the edited image
const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotateDeg !== 0) {
        ctx.rotate((rotateDeg * Math.PI) / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(
        previewImg,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
    );

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
};

// Event listeners
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        handleRotationAndFlip(option.id);
    });
});
