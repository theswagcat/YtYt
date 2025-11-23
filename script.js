document.addEventListener("DOMContentLoaded", () => {
    initBurgerMenu()
    initSmoothScroll()
    initParallax()
    initTestModalSlider()
})

function initBurgerMenu() {
    const burger = document.querySelector(".burger")
    const mobileMenu = document.querySelector(".mobile-menu")
    if (!burger || !mobileMenu) return

    const backdrop = mobileMenu.querySelector(".mobile-menu-backdrop")
    const closeButtons = mobileMenu.querySelectorAll("[data-menu-close]")
    const links = mobileMenu.querySelectorAll("a")

    let isOpen = false

    const openMenu = () => {
        if (isOpen) return
        isOpen = true
        mobileMenu.classList.add("mobile-menu-open")
        document.body.classList.add("is-menu-open")
    }

    const closeMenu = () => {
        if (!isOpen) return
        isOpen = false
        mobileMenu.classList.remove("mobile-menu-open")
        document.body.classList.remove("is-menu-open")
    }

    burger.onclick = () => {
        isOpen ? closeMenu() : openMenu()
    }

    closeButtons.forEach((btn) =>
        btn.onclick = closeMenu
    )

    if (backdrop) {
        backdrop.onclick = closeMenu
    }

    links.forEach((link) =>
        link.onclick = () => {
            if (isOpen) closeMenu()
        }
    )

    window.closeMobileMenu = closeMenu
}

function initSmoothScroll() {
    const header = document.querySelector(".header")

    document.addEventListener("click", (event) => {
        const link = event.target.closest('a[href^="#"]')
        if (!link) return

        const href = link.getAttribute("href")
        if (!href || href === "#") return

        const id = href.slice(1)
        const target = document.getElementById(id)
        if (!target) return

        event.preventDefault()

        const headerHeight = header ? header.offsetHeight : 0
        const top =
            target.getBoundingClientRect().top + window.scrollY - headerHeight - 12

        window.scrollTo({
            top,
            behavior: "smooth",
        })

        if (typeof window.closeMobileMenu === "function") {
            window.closeMobileMenu()
        }
    })
}

function initParallax() {
    const items = document.querySelectorAll("[data-parallax]")
    if (!items.length) return

    const handleScroll = () => {
        const scrollY = window.scrollY

        items.forEach((item) => {
            const speed = parseFloat(item.dataset.parallax) || 0.2
            const translateY = scrollY * speed * -1
            item.style.transform = `translate3d(0, ${translateY}px, 0)`
        })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
}

function initTestModalSlider() {
    const modal = document.querySelector('.modal[data-modal="test"]')
    if (!modal) return

    const backdrop = modal.querySelector(".modal-backdrop")
    const closeButtons = modal.querySelectorAll("[data-modal-close]")
    const steps = Array.from(modal.querySelectorAll(".modal-step"))
    const openTriggers = document.querySelectorAll('[data-modal-open="test"]')

    if (!steps.length) return

    let currentIndex = 0

    const showStep = (index) => {
        currentIndex = index
        steps.forEach((step, i) => {
            step.classList.toggle("is-active", i === index)
        })
    }

    const openModal = () => {
        modal.classList.add("modal-open")
        document.body.classList.add("is-modal-open")
        showStep(0)
    }

    const closeModal = () => {
        modal.classList.remove("modal-open")
        document.body.classList.remove("is-modal-open")
    }

    const goNext = () => {
        if (currentIndex < steps.length - 1) {
            showStep(currentIndex + 1)
        } else {
            closeModal()
        }
    }

    openTriggers.forEach((btn) =>
        btn.onclick = (e) => {
            e.preventDefault()
            openModal()
        }
    )

    closeButtons.forEach((btn) =>
        btn.onclick = (e) => {
            e.preventDefault()
            closeModal()
        }
    )

    if (backdrop) {
        backdrop.onclick = closeModal
    }

    modal.onclick = (e) => {
        const nextBtn = e.target.closest("[data-modal-next]")
        if (nextBtn) {
            e.preventDefault()
            goNext()
        }
    }

    modal.addEventListener("submit", (e) => {
        const form = e.target.closest(".modal-step-question")
        if (!form) return
        e.preventDefault()
        goNext()
    })
}