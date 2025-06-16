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

## 📄 PDF Chunking Strategy

To process PDF files efficiently and enable relevant contextual retrieval, we use LangChain’s `RecursiveCharacterTextSplitter` to chunk the text before generating embeddings. This chunking strategy is specifically designed for use with LLM applications like RAG (Retrieval-Augmented Generation).

Why this approach?

- 🔁 Recursive splitting: The splitter tries to chunk the text by prioritizing natural separators (e.g., paragraphs, sentences, newlines) and only resorts to character-level splitting if necessary.
- 📏 Token-friendly chunks: Each chunk is configured with a `chunkSize` of 500 characters and a `chunkOverlap` of 100 characters to balance semantic completeness and embedding model limits.
- 🎯 Minimizes context loss: By overlapping chunks, the strategy reduces the chance of cutting important concepts across chunks, improving the quality of retrieval and LLM responses.
- 🚀 Optimized for OpenAI Embeddings: This method ensures that chunks remain within the optimal token limit for `text-embedding-ada-002`, maximizing embedding accuracy and minimizing API errors.

This method offers a strong balance between performance, semantic fidelity, and ease of implementation — making it ideal for RAG use cases in production or prototyping.

---

## 📬 Contact

To get the `.env` file and the Google Cloud key, please contact **Anthony** directly.
