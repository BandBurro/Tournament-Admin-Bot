#  Tournament Administrator Discord Bot 🤖

## 🎯 Purpose

This bot is a specialized **Tournament Administrator** built for the "Rainbow Six Collegiate Fall ‘25 Competition"! 🏆 Its main job is to help participants by answering their questions about the tournament's schedule, format, rules, and other specific details.

It lives on Discord and springs into action when mentioned in a thread, providing quick and accurate info straight from the official rulebook.

---

## ✨ Features & Scope

The bot is packed with features to make tournament support a breeze.

* **🧠 Q&A from Knowledge Base**: The bot's brain is an official Google Docs rulebook. It reads this document to answer player questions accurately.
* **💬 Thread-Specific Interaction**: It keeps conversations focused by only activating when mentioned in a Discord thread and only responding to the person who started it.
* **🤔 Conversational Memory**: The bot remembers the chat history within each thread, so it can easily understand follow-up questions and context.
* **💾 Data Storage**: It's smart enough to identify important questions or feedback and save them to an **Airtable** database for human admins to review later.
* **🌐 Agentic Web Checking**: Need to confirm something on a website? The bot can be prompted to check external sites to find info that isn't in the rulebook.
* **🚫 Scope Limitation**: The bot knows its limits! It's programmed to recognize off-topic questions and will politely let users know when something is outside its scope.

---

## 🛠️ Technology Stack

This project is powered by a modern stack of automation and AI services.

* **Automation Hub**: **n8n.io** (self-hosted) - The heart of the operation! n8n runs the entire workflow and connects all the different services.
* **Chat Platform**: **Discord** - The friendly user-facing interface where the bot hangs out.
* **Core AI Model**: **OpenAI GPT-4.1-mini** - The powerful language model that lets the bot understand and generate responses.
* **Knowledge Base**: **Google Docs** - The single source of truth for all tournament info.
* **Database**: **Airtable** - Used for cool, structured data storage.
* **Deployment**: **Docker** on a cloud service (like Render, AWS, or Azure). ☁️
* **Version Control**: **Git & GitHub** - For managing the project's infrastructure and keeping track of changes.

---

## 🚀 Setup & Deployment

This bot is designed to be deployed as a containerized application.

1.  **Configuration**: The entire setup is managed through a `docker-compose.yml` file.
2.  **Deployment**: The project is pushed to a Git repository and deployed to a cloud service that supports Docker, such as Render.
3.  **Operation**: Once live, the bot connects to Discord via a webhook and is ready to assist participants!
