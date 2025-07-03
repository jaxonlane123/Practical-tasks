const bigImage = document.querySelector("#big-image")
const image1 = document.querySelector("#image-1")
const image2 = document.querySelector("#image-2")
const image3 = document.querySelector("#image-3")
const image4 = document.querySelector("#image-4")
const image5 = document.querySelector("#image-5")

image1.addEventListener("click", () => {
    bigImage.src = image1.src
})
image2.addEventListener("click", () => {
    bigImage.src = image2.src
})
image3.addEventListener("click", () => {
    bigImage.src = image3.src
})
image4.addEventListener("click", () => {
    bigImage.src = image4.src
})
image5.addEventListener("click", () => {
    bigImage.src = image5.src
})