const particleAnimation = (() => {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, size, speed, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = speed;
            this.color = color;
            this.direction = Math.random() * Math.PI * 2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            this.x += Math.cos(this.direction) * this.speed;
            this.y += Math.sin(this.direction) * this.speed;

            if (this.x < 0 || this.x > canvas.width) {
                this.direction = Math.PI - this.direction;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.direction = -this.direction;
            }

            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        const numberOfParticles = 100;
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 3 + 1;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const speed = Math.random() * 0.5 + 0.1;
            const color = `rgba(100, 255, 218, ${Math.random() * 0.5 + 0.5})`;
            particlesArray.push(new Particle(x, y, size, speed, color));
        }
    }

    function connect() {
        const maxDistance = 100;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = 1 - distance / maxDistance;
                    ctx.strokeStyle = `rgba(100, 255, 218, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    return {
        init,
        animate
    };
})();


const scrollAnimations = (() => {
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.1
    };

    function animateElement(element) {
        element.classList.add('visible');
    }

    function resetElement(element) {
        element.classList.remove('visible');
    }

    function animateSkillBoxes(section) {
        const skillBoxes = section.querySelectorAll('.fade-in-skill');
        skillBoxes.forEach((box) => {
            const order = parseInt(box.getAttribute('data-skill-order'));
            setTimeout(() => {
                box.classList.add('visible');
            }, 200 * order);
        });
    }

    function animateChildren(section) {
        const fadeIns = section.querySelectorAll('.fade-in');
        const staggers = section.querySelectorAll('.stagger-item');
        const fadeInStaggers = section.querySelectorAll('.fade-in-stagger');

        fadeIns.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 300 + (index * 200));
        });

        staggers.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 600 + (index * 200));
        });

        fadeInStaggers.forEach((el) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 900);
        });

        if (section.id === 'skills') {
            animateSkillBoxes(section);
        }
    }

    function resetChildren(section) {
        const animatedElements = section.querySelectorAll('.fade-in, .stagger-item, .fade-in-line, .fade-in-skill ,.fade-in-stagger');
        animatedElements.forEach(el => {
            el.classList.remove('visible');
        });
    }

    function init() {
        const sections = document.querySelectorAll('.section');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animateChildren(entry.target);
                } else {
                    entry.target.classList.remove('visible');
                    resetChildren(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    const skillBoxes = document.querySelectorAll('.skill-box');
    const skillBoxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
            } else {
                resetElement(entry.target);
            }
        });
    }, observerOptions);

    skillBoxes.forEach(box => {
        skillBoxObserver.observe(box);
    });


    const individualElements = document.querySelectorAll('.fade-in:not(.section), .stagger-item:not(.section)');
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
            } else {
                resetElement(entry.target);
            }
        });
    }, observerOptions);

    individualElements.forEach(element => {
        elementObserver.observe(element);
    });

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    scrollAnimations.init();
});


const projectSection = (() => {
    function init() {
        const buttons = document.querySelectorAll('.project-button');
        const projectDetails = document.querySelectorAll('.project-details');

        buttons.forEach(button => {
            button.addEventListener('click', function() {
              
                buttons.forEach(btn => btn.classList.remove('active'));
                projectDetails.forEach(detail => detail.classList.remove('active'));

                this.classList.add('active');
                const projectId = this.getAttribute('data-project');
                document.getElementById(projectId + 'Project').classList.add('active');
            });
        });

        if (buttons.length > 0 && projectDetails.length > 0) {
            buttons[0].classList.add('active');
            projectDetails[0].classList.add('active');
        }
    }

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    particleAnimation.init();
    particleAnimation.animate();
    scrollAnimations.init();
    projectSection.init();
});


const projectAnimations = (() => {
    function animateProjectPoints(projectId) {
        const projectPoints = document.querySelectorAll(`#${projectId} .project-point`);
        const githubButton = document.querySelector(`#${projectId} .github-button`);
        
        projectPoints.forEach((point, index) => {
            setTimeout(() => {
                point.classList.add('visible');
                if (index === projectPoints.length - 1) {
                    setTimeout(() => {
                        if (githubButton) {
                            githubButton.classList.add('visible');
                        }
                    }, 300); 
                }
            }, 300 * (index + 1));
        });
    }

    function resetProjectAnimations() {
        const allProjectPoints = document.querySelectorAll('.project-point');
        const allGithubButtons = document.querySelectorAll('.github-button');
        allProjectPoints.forEach(point => {
            point.classList.remove('visible');
        });
        allGithubButtons.forEach(button => {
            button.classList.remove('visible');
        });
    }

    function init() {
        const buttons = document.querySelectorAll('.project-button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                resetProjectAnimations();
                const projectId = this.getAttribute('data-project') + 'Project';
                setTimeout(() => {
                    animateProjectPoints(projectId);
                }, 100);
            });
        });

        const firstProjectId = document.querySelector('.project-details.active').id;
        animateProjectPoints(firstProjectId);
    }

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    particleAnimation.init();
    particleAnimation.animate();
    scrollAnimations.init();
    projectSection.init();
    projectAnimations.init(); 
    initializeContactForm();
});


function initializeContactForm() {
    emailjs.init("jqttxE0KAr7CrV_ra");

    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message
        };

        emailjs.send('service_slpjn3k', 'template_6hctd9n', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }, function(error) {
                console.log('FAILED...', error);
                alert('Oops! There was an error sending your message. Please try again later.');
            });
    });
}