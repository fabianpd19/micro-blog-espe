let posts = [];

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", function () {
  loadPosts();
  setupCharCounter();
});

// Configurar contador de caracteres
function setupCharCounter() {
  const textarea = document.getElementById("postContent");
  const charCount = document.getElementById("charCount");

  textarea.addEventListener("input", function () {
    const count = this.value.length;
    charCount.textContent = count;

    if (count > 280) {
      charCount.style.color = "#e74c3c";
    } else if (count > 250) {
      charCount.style.color = "#f39c12";
    } else {
      charCount.style.color = "#27ae60";
    }
  });
}

// Cargar posts del servidor
async function loadPosts() {
  try {
    const response = await fetch("/api/posts");
    if (response.ok) {
      posts = await response.json();
      renderPosts();
    }
  } catch (error) {
    console.error("Error cargando posts:", error);
    showError("Error al cargar los mensajes");
  }
}

// Crear nuevo post
async function createPost() {
  const textarea = document.getElementById("postContent");
  const content = textarea.value.trim();
  const button = document.getElementById("postButton");

  if (!content) {
    showError("El mensaje no puede estar vacío");
    return;
  }

  if (content.length > 280) {
    showError("El mensaje no puede exceder 280 caracteres");
    return;
  }

  button.disabled = true;
  button.textContent = "Publicando...";

  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      const newPost = await response.json();
      posts.unshift(newPost);
      renderPosts();
      textarea.value = "";
      document.getElementById("charCount").textContent = "0";
      showSuccess("Mensaje publicado exitosamente");
    } else {
      const error = await response.json();
      showError(error.message || "Error al publicar el mensaje");
    }
  } catch (error) {
    console.error("Error:", error);
    showError("Error al publicar el mensaje");
  } finally {
    button.disabled = false;
    button.textContent = "Publicar Mensaje";
  }
}

// Renderizar posts
function renderPosts() {
  const container = document.getElementById("postsContainer");

  if (posts.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <p>🤔 No hay mensajes aún. ¡Sé el primero en compartir algo!</p>
            </div>
        `;
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
        <div class="post">
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-meta">
                <span>👤 ${post.author}</span>
                <span>📅 ${formatDate(post.timestamp)}</span>
            </div>
        </div>
    `
    )
    .join("");
}

// Utilidades
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function showError(message) {
  // Implementación simple de notificación de error
  alert("Error: " + message);
}

function showSuccess(message) {
  // Implementación simple de notificación de éxito
  console.log("Éxito: " + message);
}
