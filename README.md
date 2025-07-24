# AWS Pinecone RAG Chat

A full-stack Retrieval-Augmented Generation (RAG) chat application leveraging AWS services, OpenAI, and Pinecone to allow users to chat with AI based on their uploaded documents.

---

## ✨ Features

- 📂 Upload and store files using S3
- 🤖 Generate embeddings with OpenAI
- ⚙️ Store and search vectors with Pinecone
- ✅ Track file status with DynamoDB
- ➡️ Interact via chat with AI responses grounded in user files
- 🌟 Beautiful frontend with TailwindCSS and shadcn/ui

---

## 📊 Tech Stack

- **Frontend**: React, TailwindCSS, shadcn/ui, Zustand
- **Backend**: NestJS (TypeScript), AWS Lambda, Step Functions
- **Storage & Retrieval**: S3, DynamoDB, Pinecone
- **AI**: OpenAI for embeddings and chat completion

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nadiia-dev/aws_pinecone_rag_chat.git
cd aws_pinecone_rag_chat
```

### 2. Configure environment variables

Create `.env` files in both `client/` and `server/` directories:

#### `.env` (backend example)

```
AWS_REGION=your_aws_region
ACCESS_KEY_ID=your_aws_key
SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET=your_aws_bucket_name
DYNAMODB_TABLE_NAME=your_aws_dynamodb_table
CLIENT_URL=your_client_url
PORT=your_local_development_port
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=ypur_pinecone_index_name
OPENAI_API_KEY=your_openai_api_key
```

#### `.env` (frontend example)

```
VITE_API_URL=your_api_url
VITE_BUCKET=your_aws_bucket_name
VITE_REGION=your_aws_region
```

### 3. Install dependencies

```bash
pnpm install
cd client && pnpm install
cd ../server && pnpm install
```

### 4. Run locally

#### Backend

```bash
cd server
pnpm run start:dev
```

#### Frontend

```bash
cd client
pnpm run dev
```

---

## 🚧 AWS Setup via CLI

### 2. Create Lambda Functions

```bash
aws lambda create-function \
  --function-name your-function-name \
  --runtime nodejs22.x \
  --role your-execution-role-arn \
  --handler index.handler \
  --zip-file fileb://path/to/your/zipped-code.zip
```

### 3. Create Step Function

```bash
aws stepfunctions create-state-machine \
  --name your-step-machine-name \
  --definition file://state-machine-definition.json \
  --role-arn your-role-arn
```

---

## 🛠️ Commands

### Build & Deploy

```bash
# Build frontend
cd client
pnpm run build

# Deploy backend (via CLI or manually)
aws lambda update-function-code --function-name your-lambda-name --zip-file fileb://dist.zip
```
