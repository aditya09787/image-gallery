const galleryData = [
  {
    title: 'Forest Path',
    category: 'Nature',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Mountain Lake',
    category: 'Nature',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'City Lights',
    category: 'Travel',
    src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Old Street',
    category: 'Architecture',
    src: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Coastal View',
    category: 'Travel',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Portrait',
    category: 'People',
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Modern Building',
    category: 'Architecture',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Sunset Valley',
    category: 'Nature',
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80'
  }
];

const gallery = document.getElementById('gallery');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTag = document.getElementById('lightboxTag');
const lightboxTitle = document.getElementById('lightboxTitle');
const closeButton = document.querySelector('.lightbox-close');
const prevButton = document.querySelector('.prev-btn');
const nextButton = document.querySelector('.next-btn');

let currentFilter = 'all';
let currentIndex = 0;
let filteredImages = [...galleryData];

function getFilteredImages() {
  let items = currentFilter === 'all'
    ? [...galleryData]
    : galleryData.filter((item) => item.category === currentFilter);

  const searchText = searchInput.value.trim().toLowerCase();

  if (searchText) {
    items = items.filter((item) => {
      const title = item.title.toLowerCase();
      const category = item.category.toLowerCase();
      return title.includes(searchText) || category.includes(searchText);
    });
  }

  return items;
}

function showGallery() {
  filteredImages = getFilteredImages();
  gallery.innerHTML = '';

  if (filteredImages.length === 0) {
    gallery.innerHTML = '<div class="empty-state">No photos match your search. Try another keyword.</div>';
    return;
  }

  filteredImages.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'gallery-item';
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <img src="${item.src}" alt="${item.title}" />
      <div class="gallery-info">
        <h3>${item.title}</h3>
        <span>${item.category}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      currentIndex = index;
      openLightbox();
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        currentIndex = index;
        openLightbox();
      }
    });

    gallery.appendChild(card);
  });
}

function applyFilter(filterName) {
  currentFilter = filterName;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filterName;
    button.classList.toggle('active', isActive);
  });

  currentIndex = 0;
  showGallery();
}

function openLightbox() {
  const item = filteredImages[currentIndex];

  if (!item) {
    return;
  }

  lightboxImage.src = item.src;
  lightboxImage.alt = item.title;
  lightboxTag.textContent = item.category;
  lightboxTitle.textContent = item.title;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

function goToPrevious() {
  if (currentIndex <= 0) {
    currentIndex = filteredImages.length - 1;
  } else {
    currentIndex -= 1;
  }

  openLightbox();
}

function goToNext() {
  if (currentIndex >= filteredImages.length - 1) {
    currentIndex = 0;
  } else {
    currentIndex += 1;
  }

  openLightbox();
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyFilter(button.dataset.filter);
  });
});

searchInput.addEventListener('input', () => {
  currentIndex = 0;
  showGallery();
});

function setTheme(themeName) {
  const isLightTheme = themeName === 'light';
  document.body.classList.toggle('light-theme', isLightTheme);
  themeToggle.textContent = isLightTheme ? '🌙' : '☀️';
  localStorage.setItem('galleryTheme', themeName);
}

const savedTheme = localStorage.getItem('galleryTheme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light-theme');
  setTheme(isLight ? 'dark' : 'light');
});

closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', goToPrevious);
nextButton.addEventListener('click', goToNext);

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (lightbox.classList.contains('open')) {
    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowLeft') {
      goToPrevious();
    }

    if (event.key === 'ArrowRight') {
      goToNext();
    }
  }
});

showGallery();
