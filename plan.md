Of course. Here is the complete source code for the foundational microservices setup of the VerseFlow platform, based on the provided architecture. You can create the files with the specified names and directory structure, and then run `docker-compose up --build` to launch the application.

---

### **`docker-compose.yml`**
*(Place this file in the root directory of your project)*

This file orchestrates the entire application. It defines the two services (`api_gateway` and `user_service`), specifies how to build their respective Docker images, and sets up networking and port mappings.

```yaml
# docker-compose.yml
version: '3.8'

services:
  # The API Gateway, which is the public-facing entry point.
  api_gateway:
    build:
      context: ./api_gateway
    ports:
      # Maps port 8080 on the host to port 80 in the container.
      - "8080:80"
    # This service depends on the user_service to be running.
    depends_on:
      - user_service

  # The backend microservice for handling user-related logic.
  user_service:
    build:
      context: ./user_service
    # This service is not exposed to the host machine directly.
    # It is only accessible from other containers on the same network (like the gateway).

# Docker will create a default network for these services to communicate.
```

---

### **`index.html`**
*(Place this file in the root directory of your project)*

This is the simple frontend application that will be served by the Nginx gateway. It contains basic HTML and JavaScript to interact with the backend API.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VerseFlow - Core Architecture</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 0 20px; background-color: #f9f9f9; }
        h1, h2 { color: #1a1a1a; }
        .container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"] { width: calc(100% - 20px); padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
        button { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #0056b3; }
        pre { background-color: #eee; padding: 15px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
        .divider { margin: 30px 0; border-top: 1px solid #eee; }
    </style>
</head>
<body>

    <div class="container">
        <h1>VerseFlow - API Test Interface</h1>
        <p>This interface communicates with the Go `user_service` via the Nginx `api_gateway`.</p>

        <div class="divider"></div>

        <h2>1. Create a New User</h2>
        <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" placeholder="e.g., lyricist_jane">
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="text" id="email" placeholder="e.g., jane.doe@verseflow.com">
        </div>
        <button onclick="createUser()">Create User</button>
        <h3>API Response:</h3>
        <pre id="create-response">Response will appear here...</pre>

        <div class="divider"></div>

        <h2>2. Fetch a User by ID</h2>
        <div class="form-group">
            <label for="userId">User ID:</label>
            <input type="text" id="userId" placeholder="Paste ID from creation response">
        </div>
        <button onclick="getUser()">Fetch User</button>
        <h3>API Response:</h3>
        <pre id="fetch-response">Response will appear here...</pre>
    </div>

    <script>
        const API_BASE_URL = '/api/users';

        async function createUser() {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const responseElement = document.getElementById('create-response');

            try {
                const res = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email })
                });

                const data = await res.json();
                responseElement.textContent = JSON.stringify(data, null, 2);

                if (res.ok) {
                    // Pre-fill the fetch input with the new user's ID
                    document.getElementById('userId').value = data.id;
                }
            } catch (error) {
                responseElement.textContent = `Error: ${error.message}`;
            }
        }

        async function getUser() {
            const userId = document.getElementById('userId').value;
            const responseElement = document.getElementById('fetch-response');

            if (!userId) {
                responseElement.textContent = 'Please enter a User ID.';
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/${userId}`);
                const data = await res.json();
                responseElement.textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                responseElement.textContent = `Error: ${error.message}`;
            }
        }
    </script>

</body>
</html>
```

---

### **`api_gateway/Dockerfile`**
*(Place this file in the `api_gateway` directory)*

```dockerfile
# api_gateway/Dockerfile
# This file defines how to build the Nginx gateway image.

# Use the official Nginx image from Docker Hub.
FROM nginx:stable-alpine

# Remove the default Nginx configuration file.
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx configuration.
COPY nginx.conf /etc/nginx/conf.d/

# Copy the static web page to be served by Nginx.
# This file will be created in the root directory.
COPY ../index.html /usr/share/nginx/html/index.html

# The container will listen on port 80 by default.
```

---

### **`api_gateway/nginx.conf`**
*(Place this file in the `api_gateway` directory)*

```nginx
# api_gateway/nginx.conf
# This is the configuration for our API Gateway.

# Defines the upstream service. 'user_service' is the hostname
# defined in docker-compose.yml, and 8000 is the port it listens on.
upstream user_service_upstream {
    server user_service:8000;
}

server {
    # Nginx listens on port 80 inside the container.
    listen 80;

    # Route 1: API requests
    # Any request starting with /api/ will be forwarded.
    location /api/ {
        # Rewrite the URL to remove the /api prefix before forwarding.
        # For example, a request to /api/users/123 becomes /users/123.
        rewrite /api/(.*) /$1 break;
        
        # Proxy the request to the user_service.
        proxy_pass http://user_service_upstream;
        
        # Standard proxy headers to pass along client information.
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Route 2: Frontend Application
    # For any other request, serve the static HTML file.
    # In a real setup, this might point to a Next.js server.
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html; # Important for single-page apps
    }
}
```

---

### **`user_service/Dockerfile`**
*(Place this file in the `user_service` directory)*

```dockerfile
# user_service/Dockerfile
# This file defines how to build the Go service into a Docker image.

# --- Stage 1: Build ---
# Use an official Go image to build the application.
FROM golang:1.19-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy Go module files and download dependencies.
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# Copy the source code.
COPY . .

# Build the Go application.
# -o /app/main specifies the output file.
# CGO_ENABLED=0 and GOOS=linux are for creating a static binary.
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main .

# --- Stage 2: Run ---
# Use a minimal base image for the final container.
# This reduces the image size and potential security vulnerabilities.
FROM alpine:latest

WORKDIR /root/

# Copy the built binary from the 'builder' stage.
COPY --from=builder /app/main .

# Expose the port the service runs on.
EXPOSE 8000

# The command to run when the container starts.
CMD ["./main"]
```

---

### **`user_service/go.mod`**
*(Place this file in the `user_service` directory)*

```go
// user_service/go.mod
module verseflow/user_service

go 1.19

require github.com/google/uuid v1.3.0
```

---

### **`user_service/go.sum`**
*(Place this file in the `user_service` directory)*

*Note: This file is generated automatically when you run `go mod download` or `go build`. You can create it with the following content, or let Docker generate it during the build process.*

```
// user_service/go.sum
github.com/google/uuid v1.3.0 h1:t6JiXgmwXMjEs8VvByjM8Ab9RMH2UE1H5u5F45BGa+g=
github.com/google/uuid v1.3.0/go.mod h1:TIyPZe4MgqvfeYDBFedMoGGpEw/LqOeaOT+nhxU+yHo=
```

---

### **`user_service/main.go`**
*(Place this file in the `user_service` directory)*

```go
// user_service/main.go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
)

// User struct represents the user model.
type User struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
}

// CreateUserRequest defines the structure for the user creation payload.
type CreateUserRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
}

// ErrorResponse defines the structure for a generic error message.
type ErrorResponse struct {
	Error string `json:"error"`
}

// UserStore is an in-memory database for users.
// A mutex is used to handle concurrent read/write operations safely.
// In a real application, this would be a persistent database like PostgreSQL.
type UserStore struct {
	mu    sync.RWMutex
	users map[string]User
}

// NewUserStore creates and returns a new UserStore.
func NewUserStore() *UserStore {
	return &UserStore{
		users: make(map[string]User),
	}
}

// CreateUser adds a new user to the store.
func (s *UserStore) CreateUser(username, email string) User {
	s.mu.Lock()
	defer s.mu.Unlock()

	newUser := User{
		ID:        uuid.New().String(),
		Username:  username,
		Email:     email,
		CreatedAt: time.Now().UTC(),
	}
	s.users[newUser.ID] = newUser
	log.Printf("Created user: %s (%s)", newUser.Username, newUser.ID)
	return newUser
}

// GetUser retrieves a user from the store by ID.
func (s *UserStore) GetUser(id string) (User, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	user, found := s.users[id]
	return user, found
}

// --- HTTP Handlers ---

// respondWithError sends a JSON error response.
func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, ErrorResponse{Error: message})
}

// respondWithJSON sends a JSON response.
func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling JSON: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Internal Server Error"}`))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

// usersHandler routes requests based on the HTTP method.
func (s *UserStore) usersHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		s.handleCreateUser(w, r)
	case http.MethodGet:
		s.handleGetUser(w, r)
	default:
		respondWithError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// handleCreateUser handles the creation of a new user.
func (s *UserStore) handleCreateUser(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if req.Username == "" || req.Email == "" {
		respondWithError(w, http.StatusBadRequest, "Username and email are required")
		return
	}

	user := s.CreateUser(req.Username, req.Email)
	respondWithJSON(w, http.StatusCreated, user)
}

// handleGetUser handles retrieving a user by their ID.
// It expects an ID in the URL path, e.g., /users/{id}
func (s *UserStore) handleGetUser(w http.ResponseWriter, r *http.Request) {
	// Simple path parsing to extract user ID.
	// A proper router like Gorilla/Mux would be used in a real app.
	id := r.URL.Path[len("/users/"):]
	if id == "" {
		respondWithError(w, http.StatusBadRequest, "User ID is required in the path")
		return
	}

	user, found := s.GetUser(id)
	if !found {
		respondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	respondWithJSON(w, http.StatusOK, user)
}

func main() {
	store := NewUserStore()
	
	// The router is simplified for this example.
	// All requests to /users/... are handled by usersHandler.
	http.HandleFunc("/users/", store.usersHandler)

	log.Println("User Service starting on port 8000...")
	// This service listens on port 8000 *inside the Docker network*.
	// It is not exposed directly to the host machine.
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatalf("Could not start server: %s\n", err)
	}
}
```
