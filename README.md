# 📄 PDF AI Chatbot

Chatbot with PDF upload support, semantic search via embeddings, and database storage. Built using AI SDK, Next.js 14 (App Router), Drizzle ORM, and Google Cloud for embeddings.

---

## 🚀 Requirements

- **Node.js**: v22.16.0
- **pnpm**: recommended package manager
- **Google Cloud Service Key**: provided by Anthony
- **.env file**: provided by Anthony

---

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thonygrz/pdf-ai-chatbot.git
   cd pdf-ai-chatbot
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Add the `.env` file to the project root. This file will be provided by Anthony.

4. Create a `gcloud` folder in the project root and place the Google Cloud service key (`.json`) inside. Anthony will provide this key.

5. Run database migrations:
   ```bash
   pnpm db:migrate
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

---

## 🧠 What does this project do?

- Allows PDF uploads
- Splits the content into chunks, generates embeddings with OpenAI (via Google Cloud), and stores them
- Answers questions using semantic context from the PDF and the user's interaction history

---

## 📬 Contact

To get the `.env` file and the Google Cloud key, please contact **Anthony** directly.
