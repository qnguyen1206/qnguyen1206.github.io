export function initContacts() {
  const contacts = document.getElementById('contacts');
  
  contacts.innerHTML = `
    <div class="container">
      <h2 class="section-title">Get In Touch</h2>
      <div class="contacts-content">
        <div class="contacts-text">
          <p>I'm open to new opportunities and collaborations. Whether you have a question, project idea, or just want to say hi, feel free to reach out!</p>
        </div>
        
        <div class="contacts-methods">
          <a href="mailto:qnguyenpersonal@gmail.com" class="contact-item">
            <div class="contact-info">
              <h3>Email</h3>
              <p>qnguyenpersonal@gmail.com</p>
            </div>
          </a>

          <a href="https://www.linkedin.com/in/quang-nguyen-584005251" target="_blank" class="contact-item">
            <div class="contact-info">
              <h3>LinkedIn</h3>
              <p>Connect with me 🤝</p>
            </div>
          </a>
          
          <a href="https://github.com/qnguyen1206" target="_blank" class="contact-item">
            <div class="contact-info">
              <h3>GitHub</h3>
              <p>Check out my projects →</p>
            </div>
          </a>
          
          <a href="https://gitlab.com/qnguyen1206" target="_blank" class="contact-item">
            <div class="contact-info">
              <h3>GitLab</h3>
              <p>Check out my projects →</p>
            </div>
          </a>

          <a href="https://tryhackme.com/p/Kairu1206" target="_blank" class="contact-item tryhackme-item">
            <div class="contact-info">
              <h3>TryHackMe</h3>
              <p>Check out my profile →</p>
            </div>
          </a>
        </div>
      </div>
    </div>

    <style>
      .contacts-content {
        max-width: 800px;
        margin: 0 auto;
        padding: var(--space-8) 0;
      }

      .contacts-text {
        text-align: center;
        margin-bottom: var(--space-8);
      }

      .contacts-text p {
        font-size: var(--font-size-lg);
      }

      .contacts-methods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--space-6);
        margin-top: var(--space-8);
        max-width: 1000px;
        margin-left: auto;
        margin-right: auto;
      }

      .contact-item {
        display: flex;
        align-items: center;
        padding: var(--space-4);
        border-radius: var(--radius-lg);
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        border: 1px solid rgba(139, 92, 246, 0.2);
        text-decoration: none;
        color: inherit;
      }

      .contact-item:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--color-primary-500);
      }

      .contact-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-md);
        background: var(--color-primary-50);
        color: var(--color-primary-500);
        margin-right: var(--space-4);
      }

      .contact-info h3 {
        margin: 0;
        font-size: var(--font-size-lg);
      }

      .contact-info p {
        margin: var(--space-1) 0 0;
        color: #a591ffff;
        font-size: var(--font-size-base);
      }

      @media (max-width: 768px) {
        .contacts-methods {
          grid-template-columns: 1fr;
        }
        
        .contact-item {
          padding: var(--space-3);
        }
        
        .contact-icon {
          width: 40px;
          height: 40px;
        }
      }
    </style>
  `;
}