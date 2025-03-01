document.addEventListener("DOMContentLoaded", function () {
  // Obtém a altura da topbar para ajustar o scroll das seções
  const topbar = document.querySelector('.topbar');
  const topbarHeight = topbar ? topbar.getBoundingClientRect().height : 0;

  // Slideshow: configura a troca automática de slides
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  if (totalSlides > 0) {
    function nextSlide() {
      slides[currentSlide].classList.remove('active'); // remove o slide atual da exibição
      currentSlide = (currentSlide + 1) % totalSlides; // atualiza o índice para o próximo slide
      slides[currentSlide].classList.add('active'); // torna o próximo slide visível
    }
    setInterval(nextSlide, 5000); // troca os slides a cada 5 segundos
  }

  // Efeito de Máquina de Escrever: anima as frases de forma interativa
  function initTypewriter() {
    const phrases = [
      "Desenvolvedor Front-End",
      "Estudante de Ciência da Computação",
      "Apaixonado por Tecnologia"
    ];
    // Seleciona os elementos que exibem o texto e o cursor
    const typewriterElement = document.querySelector('.typewriter');
    const cursorElement = document.querySelector('.cursor');
    if (!typewriterElement || !cursorElement) return; // encerra se não encontrar os elementos

    let currentPhrase = 0;
    let isDeleting = false;
    let text = '';
    const typingSpeed = 150; // velocidade da digitação
    const pauseBetweenPhrases = 2000; // pausa após a frase completa

    function type() {
      const currentText = phrases[currentPhrase];
      cursorElement.style.display = 'block'; // exibe o cursor

      if (!isDeleting) {
        // Adiciona um caractere por vez até formar a frase completa
        text = currentText.substring(0, text.length + 1);
      } else {
        // Remove um caractere por vez para simular deleção
        text = currentText.substring(0, text.length - 1);
      }

      typewriterElement.textContent = text; // atualiza o texto exibido
      let delta = typingSpeed;

      if (!isDeleting && text === currentText) {
        // Quando a frase está completa, pausa e inicia a deleção
        delta = pauseBetweenPhrases;
        isDeleting = true;
      } else if (isDeleting && text === '') {
        // Quando a frase foi totalmente apagada, passa para a próxima frase
        isDeleting = false;
        currentPhrase = (currentPhrase + 1) % phrases.length;
        delta = 500; // breve pausa antes de iniciar a nova digitação
      } else if (isDeleting) {
        // Se estiver deletando, acelera a velocidade
        delta = typingSpeed / 2;
      }

      setTimeout(type, delta); // chama recursivamente para continuar o efeito
    }
    type(); // inicia o efeito de máquina de escrever
  }
  initTypewriter();

  // Animação das Barras de Progresso: preenche as barras quando entram na área visível da tela
  const progressBars = document.querySelectorAll('.progress-bar');
  function animateProgressBars() {
    progressBars.forEach(bar => {
      const barPosition = bar.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.1;
      if (barPosition < screenPosition) {
        const percent = bar.getAttribute('data-percent');
        const color = bar.getAttribute('data-color') || '#76c7c0';
        // Define propriedades customizadas para a animação da barra
        bar.style.setProperty('--width', percent + '%');
        bar.style.setProperty('--progress-color', color);
        bar.classList.add('animated'); // inicia a animação
      }
    });
  }
  window.addEventListener('scroll', animateProgressBars); // atualiza as barras ao rolar a página
  animateProgressBars(); // verifica as barras visíveis ao carregar

  // Botão "Voltar ao Topo": implementa scroll suave para retornar ao topo da página
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault(); // impede a ação padrão do botão/link
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // scroll suave
      });
    });
  }

  // Navegação entre Seções: define o scroll suave para cada seção ao clicar nos botões
  const navButtons = document.querySelectorAll('.buttons button');
  navButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.preventDefault(); // previne o comportamento padrão do botão
      // Array com os IDs das seções na ordem dos botões
      const sections = ['home', 'skills', 'projects', 'contact'];
      const sectionId = sections[index];
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - topbarHeight, // ajusta o scroll considerando a altura da topbar fixa
          behavior: 'smooth'
        });
      }
    });
  });

  // Atualiza a navegação ativa conforme a rolagem: destaca o botão correspondente à seção atual
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id'); // identifica a seção atual baseada na posição da rolagem
      }
    });
    navButtons.forEach(button => {
      button.classList.remove('active'); // remove a classe ativa de todos os botões
      if (button.textContent.toLowerCase() === current) {
        button.classList.add('active'); // adiciona a classe ativa ao botão da seção atual
      }
    });
  });

  // Inicializa o EmailJS para o envio de formulários
  emailjs.init("sfh26hyV5dHqlhh55");

  // Envio do Formulário via EmailJS: captura o envio, impede o comportamento padrão e envia os dados
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.querySelector(".submit-btn span");

  if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
      event.preventDefault(); // impede que o formulário seja enviado da forma tradicional

      submitBtn.textContent = "Enviando..."; // atualiza o texto do botão para feedback visual

      const serviceID = "service_u42cjjs";
      const templateID = "template_93wovgo";

      // Envia o formulário usando EmailJS e trata a resposta
      emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          submitBtn.textContent = "Enviar Mensagem"; // restaura o texto do botão
          alert("Mensagem enviada com sucesso!"); // alerta de sucesso
          contactForm.reset(); // limpa os campos do formulário
        })
        .catch((err) => {
          submitBtn.textContent = "Enviar Mensagem"; // restaura o texto do botão em caso de erro
          alert("Erro ao enviar: " + JSON.stringify(err)); // alerta com a mensagem de erro
        });
    });
  }
});
