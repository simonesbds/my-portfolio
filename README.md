# Simone — Junior Web Developer Portfolio

My personal portfolio repository.
A single-page, scroll-based portfolio with entrance animations, built to showcase my front-end projects and my focus on smooth, engaging user experiences.

## Live website
https://simonesbds.github.io/my-portfolio/

---

## Tech Stack

- **HTML5**
- **CSS3**
- **Bootstrap 5**
- **JavaScript (ES6+)**
- JSON (dynamic data)
- Git & GitHub Pages

---

## Project Structure
```
/
├── index.html          # the whole site (one page)
├── projects.html       # redirect to #work (keeps old links working)
├── contact.html        # redirect to #contact
├── css/
│ └── global.css        # design tokens, components, animations
├── js/
│ ├── main.js           # scroll animations, navbar, footer year
│ └── projects.js       # loads, filters and renders projects
├── assets/
│ ├── favicon/          # favicon + Apple touch icon
│ └── img/projects/     # project screenshots (WebP)
├── data/
│ └── projects.json
├── LICENSE
└── README.md
```

---

## Main Features

- Single-page layout with smooth scrolling between sections
- Entrance animations on scroll (IntersectionObserver + CSS transitions)
- Navbar that changes on scroll and highlights the current section
- Projects loaded dynamically from a JSON file
- Project filtering by category and debounced text search
- UI state handling (loading / empty / error)
- CV preview in a modal (Google Drive embed)
- Responsive, mobile-first layout
- Respects the user's "reduce motion" accessibility setting

---

## Purpose

This portfolio is meant as a professional showcase for Junior Web Developer applications.

---

## Résumé
The résumé can be viewed directly on the website, either as a preview in a modal or as a PDF download.

---

## Author
**Simone Sabatino Di Sciullo**

Portfolio: https://simonesbds.github.io/my-portfolio/

---

*Work in progress — this project keeps evolving.*

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
