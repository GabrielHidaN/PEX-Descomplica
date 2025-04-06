// Script principal do site de reciclagem

document.addEventListener("DOMContentLoaded", function () {
  // Animações de scroll suave para links de navegação
  const links = document.querySelectorAll('a[href^="#"]')

  for (const link of links) {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })
      }
    })
  }

  // Contador de fatos sobre reciclagem na seção "Você sabia?"
  const facts = [
    "Uma única garrafa plástica pode levar até 450 anos para se decompor na natureza!",
    "Ao reciclar 1 tonelada de papel, salvamos 20 árvores adultas.",
    "Uma latinha de alumínio pode ser reciclada infinitas vezes sem perder qualidade.",
    "O Brasil recicla apenas 3% dos resíduos que produz.",
    "Uma televisão pode ficar ligada por 3 horas com a energia economizada ao reciclar uma lata de alumínio.",
    "O vidro leva mais de 4 mil anos para se decompor na natureza.",
    "O plástico é feito de petróleo, um recurso não-renovável.",
  ]

  const factElement = document.querySelector(".voce-sabia p:first-of-type")
  let currentFactIndex = 0

  if (factElement) {
    // Trocar o fato a cada 10 segundos
    setInterval(() => {
      currentFactIndex = (currentFactIndex + 1) % facts.length
      factElement.style.opacity = 0

      setTimeout(() => {
        factElement.textContent = facts[currentFactIndex]
        factElement.style.opacity = 1
      }, 500)
    }, 10000)
  }

  // Destacar o menu ativo com base na página atual
  const currentPage = window.location.pathname.split("/").pop()
  const navLinks = document.querySelectorAll("nav a")

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href")
    if (
      linkHref === currentPage ||
      (currentPage === "" && linkHref === "index.html")
    ) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })

  // Formulário de contato - prevenção de envio e feedback
  const contactForm = document.querySelector(".contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Simulação de envio
      const submitButton = this.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent

      submitButton.disabled = true
      submitButton.textContent = "Enviando..."

      setTimeout(() => {
        const formFields = this.querySelectorAll("input, textarea")
        formFields.forEach((field) => (field.value = ""))

        submitButton.textContent = "Mensagem Enviada!"

        setTimeout(() => {
          submitButton.disabled = false
          submitButton.textContent = originalText
        }, 3000)
      }, 1500)
    })
  }
})

//script para explicar como reciclar o papel
// Gerenciar as etapas interativas
function toggleStep(step) {
  // Remova a classe ativa de todas as etapas
  const allSteps = document.querySelectorAll(".step")
  allSteps.forEach((s) => {
    if (s !== step) {
      s.classList.remove("active")
    }
  })

  // Alternar a classe ativa na etapa clicada
  step.classList.toggle("active")
}

// Ativar a primeira etapa por padrão
document.addEventListener("DOMContentLoaded", function () {
  const firstStep = document.querySelector(".step")
  if (firstStep) {
    firstStep.classList.add("active")
  }

  // Inicializar o jogo de reciclagem
  initRecyclingGame()
})

// Função para inicializar o jogo de reciclagem
function initRecyclingGame() {
  const paperContainer = document.getElementById("paperContainer")
  const recyclingBin = document.getElementById("recyclingBin")
  const binLid = document.getElementById("binLid")
  const progressBar = document.getElementById("progressBar")
  const successMessage = document.getElementById("successMessage")
  const resetButton = document.getElementById("resetButton")

  let paperCount = 10
  let recycledCount = 0
  let papers = []

  // Criar papéis aleatórios
  function createPapers() {
    // Limpar papéis existentes
    papers.forEach((paper) => {
      if (paper.element && paper.element.parentNode) {
        paper.element.parentNode.removeChild(paper.element)
      }
    })

    papers = []
    recycledCount = 0

    // Atualizar barra de progresso
    updateProgress()

    // Esconder mensagem de sucesso
    successMessage.style.display = "none"

    // Tipos de papel para criar
    const paperTypes = [
      "Jornal",
      "Revista",
      "Caderno",
      "Papelão",
      "Envelope",
      "Folheto",
    ]

    for (let i = 0; i < paperCount; i++) {
      // Criar elemento de papel
      const paperElement = document.createElement("div")
      paperElement.className = "paper"

      // Definir tipo e cor do papel aleatoriamente
      const paperType =
        paperTypes[Math.floor(Math.random() * paperTypes.length)]
      const hue = Math.floor(Math.random() * 60) + 30 // Variações de branco a creme
      paperElement.style.backgroundColor = `hsl(${hue}, 70%, 97%)`
      paperElement.textContent = paperType

      // Posição aleatória (evitando sobreposição com a lixeira)
      let validPosition = false
      let left, top

      while (!validPosition) {
        left = Math.random() * (paperContainer.offsetWidth - 100)
        top = Math.random() * (paperContainer.offsetHeight - 130)

        // Verificar se não está sobrepondo a lixeira
        if (
          !(
            left > recyclingBin.offsetLeft - 100 &&
            top > recyclingBin.offsetTop - 100
          )
        ) {
          validPosition = true
        }
      }

      paperElement.style.left = `${left}px`
      paperElement.style.top = `${top}px`

      // Rotação aleatória
      const rotation = Math.random() * 40 - 20
      paperElement.style.transform = `rotate(${rotation}deg)`

      // Adicionar ao container
      paperContainer.appendChild(paperElement)

      // Adicionar à lista de papéis
      papers.push({
        element: paperElement,
        recycled: false,
      })

      // Configurar funcionalidade de arrastar
      setupDraggable(paperElement)
    }
  }

  // Configurar elementos arrastáveis
  function setupDraggable(element) {
    let isDragging = false
    let offsetX, offsetY

    element.addEventListener("mousedown", startDrag)
    element.addEventListener("touchstart", startDragTouch)

    function startDrag(e) {
      isDragging = true
      offsetX = e.clientX - element.getBoundingClientRect().left
      offsetY = e.clientY - element.getBoundingClientRect().top

      document.addEventListener("mousemove", drag)
      document.addEventListener("mouseup", stopDrag)

      // Trazer para frente
      element.style.zIndex = "100"
    }

    function startDragTouch(e) {
      isDragging = true
      const touch = e.touches[0]
      offsetX = touch.clientX - element.getBoundingClientRect().left
      offsetY = touch.clientY - element.getBoundingClientRect().top

      document.addEventListener("touchmove", dragTouch)
      document.addEventListener("touchend", stopDragTouch)

      // Trazer para frente
      element.style.zIndex = "100"
    }

    function drag(e) {
      if (!isDragging) return

      const containerRect = paperContainer.getBoundingClientRect()
      const x = e.clientX - containerRect.left - offsetX
      const y = e.clientY - containerRect.top - offsetY

      // Manter dentro dos limites
      const maxX = containerRect.width - element.offsetWidth
      const maxY = containerRect.height - element.offsetHeight

      element.style.left = `${Math.max(0, Math.min(maxX, x))}px`
      element.style.top = `${Math.max(0, Math.min(maxY, y))}px`

      // Verificar se está sobre a lixeira
      checkRecyclingBin(element)
    }

    function dragTouch(e) {
      if (!isDragging) return
      e.preventDefault()

      const touch = e.touches[0]
      const containerRect = paperContainer.getBoundingClientRect()
      const x = touch.clientX - containerRect.left - offsetX
      const y = touch.clientY - containerRect.top - offsetY

      // Manter dentro dos limites
      const maxX = containerRect.width - element.offsetWidth
      const maxY = containerRect.height - element.offsetHeight

      element.style.left = `${Math.max(0, Math.min(maxX, x))}px`
      element.style.top = `${Math.max(0, Math.min(maxY, y))}px`

      // Verificar se está sobre a lixeira
      checkRecyclingBin(element)
    }

    function stopDrag() {
      isDragging = false
      document.removeEventListener("mousemove", drag)
      document.removeEventListener("mouseup", stopDrag)

      // Restaurar z-index
      element.style.zIndex = "1"

      // Verificar reciclagem final
      finalizeRecycling(element)
    }

    function stopDragTouch() {
      isDragging = false
      document.removeEventListener("touchmove", dragTouch)
      document.removeEventListener("touchend", stopDragTouch)

      // Restaurar z-index
      element.style.zIndex = "1"

      // Verificar reciclagem final
      finalizeRecycling(element)
    }

    function checkRecyclingBin(elem) {
      const elemRect = elem.getBoundingClientRect()
      const binRect = recyclingBin.getBoundingClientRect()

      // Verificar sobreposição
      if (
        elemRect.right > binRect.left &&
        elemRect.left < binRect.right &&
        elemRect.bottom > binRect.top &&
        elemRect.top < binRect.bottom
      ) {
        // Abrir a tampa da lixeira
        binLid.style.transform = "rotate(-30deg) translateY(-10px)"
      } else {
        // Fechar a tampa
        binLid.style.transform = "rotate(0deg) translateY(0)"
      }
    }

    function finalizeRecycling(elem) {
      const elemRect = elem.getBoundingClientRect()
      const binRect = recyclingBin.getBoundingClientRect()

      // Verificar sobreposição para reciclagem
      if (
        elemRect.right > binRect.left &&
        elemRect.left < binRect.right &&
        elemRect.bottom > binRect.top &&
        elemRect.top < binRect.bottom
      ) {
        // Animar desaparecimento
        elem.style.transition = "all 0.5s"
        elem.style.transform = "scale(0.1) rotate(360deg)"
        elem.style.opacity = "0"

        // Encontrar o papel na lista e marcá-lo como reciclado
        const paperIndex = papers.findIndex((p) => p.element === elem)
        if (paperIndex >= 0) {
          papers[paperIndex].recycled = true
          recycledCount++

          // Atualizar progresso
          updateProgress()

          // Verificar se todos foram reciclados
          if (recycledCount === paperCount) {
            setTimeout(() => {
              successMessage.style.display = "block"
            }, 500)
          }
        }

        // Remover depois da animação
        setTimeout(() => {
          if (elem.parentNode) {
            elem.parentNode.removeChild(elem)
          }
        }, 500)
      }

      // Fechar a tampa
      binLid.style.transform = "rotate(0deg) translateY(0)"
    }
  }

  // Atualizar a barra de progresso
  function updateProgress() {
    const percentage = Math.round((recycledCount / paperCount) * 100)
    progressBar.style.width = `${percentage}%`
    progressBar.textContent = `${percentage}%`
  }

  // Configurar botão de reinício
  resetButton.addEventListener("click", createPapers)

  // Inicializar o jogo
  createPapers()
}

//script para explicar como reciclar do plastico
// Tab Functionality
const tabBtns = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab")

    // Remove active class from all buttons and contents
    tabBtns.forEach((btn) => btn.classList.remove("active"))
    tabContents.forEach((content) => content.classList.remove("active"))

    // Add active class to clicked button and corresponding content
    btn.classList.add("active")
    document.getElementById(tabId).classList.add("active")
  })
})

// Quiz Functionality
const quizOptions = document.querySelectorAll(".quiz-option")
const quizResult = document.querySelector(".quiz-result")
let correctAnswers = 0
let questionsAnswered = 0

quizOptions.forEach((option) => {
  option.addEventListener("click", function () {
    // Get the parent question element
    const question = this.closest(".quiz-question")

    // If this question has already been answered, do nothing
    if (question.classList.contains("answered")) {
      return
    }

    // Mark question as answered
    question.classList.add("answered")
    questionsAnswered++

    // Remove any existing selection in this question
    question.querySelectorAll(".quiz-option").forEach((opt) => {
      opt.classList.remove("selected")
    })

    // Mark this option as selected
    this.classList.add("selected")

    // Check if correct
    if (this.getAttribute("data-correct") === "true") {
      this.classList.add("correct")
      correctAnswers++
    } else {
      this.classList.add("wrong")

      // Show the correct answer
      question.querySelector('[data-correct="true"]').classList.add("correct")
    }

    // If all questions answered, show result
    if (
      questionsAnswered === document.querySelectorAll(".quiz-question").length
    ) {
      quizResult.style.display = "block"

      if (correctAnswers === questionsAnswered) {
        quizResult.textContent = `Parabéns! Você acertou todas as ${questionsAnswered} questões!`
        quizResult.style.backgroundColor = "#2ecc71"
      } else if (correctAnswers >= questionsAnswered / 2) {
        quizResult.textContent = `Bom trabalho! Você acertou ${correctAnswers} de ${questionsAnswered} questões.`
        quizResult.style.backgroundColor = "#3498db"
      } else {
        quizResult.textContent = `Você acertou ${correctAnswers} de ${questionsAnswered} questões. Tente novamente!`
        quizResult.style.backgroundColor = "#e74c3c"
      }
    }
  })
})

// Drag and Drop Game
const draggables = document.querySelectorAll(".draggable")
const dropTargets = document.querySelectorAll(".drop-target")

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", function () {
    this.classList.add("dragging")
  })

  draggable.addEventListener("dragend", function () {
    this.classList.remove("dragging")
  })

  // Make the elements draggable
  draggable.setAttribute("draggable", "true")
})

dropTargets.forEach((target) => {
  target.addEventListener("dragover", function (e) {
    e.preventDefault()
    this.classList.add("over")
  })

  target.addEventListener("dragleave", function () {
    this.classList.remove("over")
  })

  target.addEventListener("drop", function (e) {
    e.preventDefault()
    this.classList.remove("over")

    const draggable = document.querySelector(".dragging")
    const itemType = draggable.getAttribute("data-type")
    const acceptedTypes = this.getAttribute("data-accepts").split(",")

    if (acceptedTypes.includes(itemType)) {
      // Correct drop target
      draggable.style.backgroundColor = "#2ecc71"
      draggable.style.color = "white"
    } else {
      // Wrong drop target
      draggable.style.backgroundColor = "#e74c3c"
      draggable.style.color = "white"
    }

    // Add the item to the drop target
    const droppedItems = this.querySelector(".dropped-items")
    droppedItems.appendChild(draggable)

    // Remove draggable attribute to keep it in place
    draggable.setAttribute("draggable", "false")
  })
})

//menu
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector("nav ul")

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
  })
})