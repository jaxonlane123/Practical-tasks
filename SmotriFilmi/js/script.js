const moviesContainer = document.querySelector('#movies-container')
const searchResultsContainer = document.createElement('div') // отображение результатов поиска
const movieDetailModal = document.getElementById('movie-detail-modal')
const screenshotModal = document.getElementById('screenshot-modal')
const fullScreenshot = document.getElementById('full-screenshot')
const sortSelect = document.getElementById('sort')
const searchButton = document.getElementById('search')
const searchInput = document.querySelector('.sort-search input[type="text"]')
const movieCountElement = document.getElementById('movie-count')

let result
let originalOrder = [] //сохраняем исходный порядок фильмов

searchResultsContainer.id = 'search-results'
searchResultsContainer.style.marginTop = '15px'
searchResultsContainer.style.fontSize = '1.1em'
document.querySelector('.sort-search').after(searchResultsContainer)

moviesContainer.addEventListener('click', function(event) {
    const card = event.target.closest('.movie-card')
    if (card){
        const movieId = parseInt(card.dataset.id)
        const movie = result.find(m => m.id === movieId)
        if (movie){
            openMovieDetail(movie)
        }
    }
})

// генерация карточек фильмов
function generateMoviesContainer(movie){
    return `
        <div class="movie-card" data-id="${movie.id}">
            <img src="${movie.cover}">
            <h3>${movie.title}</h3>
            <p>${movie.genre}</p>
            <p>${movie.year}</p>
            <p>${movie.description}</p>
        </div>
    `
}

// отрисовка фильмов
function renderMovies(movies){
    moviesContainer.innerHTML = ''
    movieCountElement.textContent = result.length // количество фильмов
    for (let movie of movies){
        moviesContainer.innerHTML += generateMoviesContainer(movie)
    }
}

// сортировка
function sortMovies(key){
    const sorted = [...result] //создаем копию массива

    switch(key){
        case 'id': // исходный порядок
            return [...originalOrder]
        case 'name': // по названию
            return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ru'))
        case 'year': //по году
            return sorted.sort((a, b) => a.year - b.year)
        default:
            return sorted
    }
}

// поиск по названию
function searchMovies(){
    const searchTerm = searchInput.value.trim().toLowerCase() // переводим в нижний регистр
    
    searchResultsContainer.innerHTML = '' // очищаем предыдущие результаты поиска
    searchInput.value = '' // очищаем поле ввода

    if (!searchTerm){
        // если строка поиска пустая, показывает все фильмы
        renderMovies(sortMovies(sortSelect.value))
        return
    }
    // ищем фильмы, которые начинаются с введенной строки
    const filtered = result.filter(movie => movie.title.toLowerCase().startsWith(searchTerm)) // названия фильмов переводятся в нижний регистр

    // отображаем количество найденных фильмов
    searchResultsContainer.innerHTML = `
        По запросу "<strong>${searchTerm}</strong>" было найдено фильмов: ${filtered.length}
    `
    renderMovies(filtered)
}

// открытие детального просмотра фильма
function openMovieDetail(movie){
    const movieDetail = document.getElementById('movie-detail')

    // формируем HTML для детального просмотра
    movieDetail.innerHTML = `
        <div class="movie-header">
            <img src="${movie.cover}" class="movie-cover" alt="${movie.title}">
            <div class="movie-info">
                <h2>${movie.title} (${movie.year})</h2>
                <p>Жанр: ${movie.genre}</p>
            </div>
        </div>
        <div class="movie-description">
            <h3>Описание</h3>
            <p>${movie.description}</p>
        </div>
        <div class="screenshots">
            <h3>Кадры из фильма</h3>
            <div class="screenshots-container">
                <button class="scroll-btn left">&lt;</button>
                <div class="screenshots-scroll">
                    ${generateScreenshots(movie)}
                </div>
                <button class="scroll-btn right">&gt;</button>
            </div>
        </div>
    `

    // показываем модальное окно
    movieDetailModal.style.display = "block"

    // обработчики для кадров
    document.querySelectorAll('.screenshot-thumb').forEach(thumb => {
        thumb.addEventListener('click', function() {
            fullScreenshot.src = this.dataset.full
            screenshotModal.style.display = "block"
        })
    })

    // обработчики для кнопок прокрутки
    const scrollContainer = document.querySelector('.screenshots-scroll')
    const scrollLeft = document.querySelector('.scroll-btn.left')
    const scrollRight = document.querySelector('.scroll-btn.right')

    if (scrollLeft && scrollRight && scrollContainer){
        scrollLeft.addEventListener('click', () => {
            scrollContainer.scrollBy({left: -300, behavior: 'smooth'})
        })
        scrollRight.addEventListener('click', () => {
            scrollContainer.scrollBy({left: 300, behavior: 'smooth'})
        })
    }
}

// генерируем кадры для фильма
function generateScreenshots(movie){
    let screenshotsHTML = ''

    if (movie.screenshots && movie.screenshots.length > 0){
        movie.screenshots.forEach((screenshot, index) => {
            screenshotsHTML += `
                <div class="screenshot-item">
                    <img src="${screenshot}" class="screenshot-thumb data-full="${screenshot}" alt="Кадр ${index+1} из фильма ${movie.title}">
                </div>
            `
        })
    }
    else {
        screenshotsHTML = '<p>Кадры отсутствуют</p>'
    }
    return screenshotsHTML
}

// закрытие модальных окон
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        movieDetailModal.style.display = "none"
        screenshotModal.style.display = "none"
    })
})

// закрытие при клике вне контента
window.addEventListener('click', (event) => {
    if (event.target === movieDetailModal){
        movieDetailModal.style.display = "none"
    }
    if (event.target === screenshotModal){
        screenshotModal.style.display = "none"
    }
})

window.addEventListener('load', async () => {
    result = await fetch('movies.json').then(res => res.json())
    originalOrder = [...result] // сохраняем исходный порядок
    renderMovies(result)

    // обработчик сортировки
    sortSelect.addEventListener('change', () => {
        renderMovies(sortMovies(sortSelect.value))
        searchResultsContainer.innerHTML = '' // сбрасываем результаты поиска при изменении сортировки
    })

    // обработчик кнопки поиска
    searchButton.addEventListener('click', searchMovies)
    searchInput.addEventListener('keyup', (e) => e.key === 'Enter' && searchMovies())
})