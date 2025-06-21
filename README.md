# 🎙️ FTCEPodcast

**Código da Disciplina**: FGA0208  
**Grupo**: 07  
**Entrega**: 03

---

## 👥 Alunos

| Foto | Matrícula | Nome |
|------|-----------|------|
| <img src="https://avatars.githubusercontent.com/u/101185927?v=4" height="70"> | 211061814 | Gustavo Costa |
| <img src="https://avatars.githubusercontent.com/u/101184511?v=4" height="70"> | 211061832 | Harleny Angéllica |
| <img src="https://avatars.githubusercontent.com/u/101422838?v=4" height="70"> | 211062947 | Iderlan Junio Cardoso da Silva |
| <img src="https://avatars.githubusercontent.com/u/144747380?v=4" height="70"> | 221035040 | Marcella Sousa Anderle |
| <img src="https://avatars.githubusercontent.com/u/137426012?v=4" height="70"> | 221037975 | Natália Rodrigues de Morais |
| <img src="https://avatars.githubusercontent.com/u/43494763?v=4" height="70"> | 200024787 | Mateus de Siqueira Silva |
| <img src="https://avatars.githubusercontent.com/u/79025349?v=4" height="70"> | 190044128 | Rafael Kenji Taira |
| <img src="https://avatars.githubusercontent.com/u/70647018?v=4" height="70"> | 202023805 | João Paulo Barros de Cristo |
| <img src="https://avatars.githubusercontent.com/u/155927112?v=4" height="70"> | 211063176 | Joyce Dionizio |

---

## 📌 Sobre o Projeto

**FTCEPodcast** é uma plataforma digital desenvolvida para a comunidade da FCTE, com foco na disseminação de conhecimento através de podcasts educacionais. O sistema permite que professores, monitores e convidados publiquem episódios relacionados às disciplinas do curso, incentivando:

- 📚 Aprendizagem colaborativa  
- 🗣️ Participação ativa de alunos  
- 🌐 Compartilhamento de saberes dentro e fora do ambiente acadêmico

Disponível em versão web, a aplicação conta com frontend e backend integrados e utiliza containers para facilitar o desenvolvimento e a execução.

---

## ⚙️ Requisitos de Execução

- 🐳 **Docker** e **Docker Compose** instalados

---

## 🔐 Configuração de Ambiente

Crie dois arquivos na raiz do projeto com os seguintes nomes:

- `.env`  
- `.env.dev`

Insira neles as seguintes variáveis de ambiente:

```env
# Configuração da API
API_PORT=3008
API_HOST=http://localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost

# Tokens JWT
JWT_SECRET_KEY=supersecretkey
JWT_REFRESH_SECRET_KEY=supersecretrefreshkey

# Configuração do banco de dados
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=admin
MONGO_URL=mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@fctepocast-db:27017/

# Configuração do frontend
VITE_BASE_API_URL=http://localhost:3008/api
```

> ⚠️ **Importante**: não versionar esses arquivos. Certifique-se de que eles estejam listados no `.gitignore`.

---

## 🚀 Executando o Projeto

Com as variáveis configuradas, inicie o ambiente de desenvolvimento com:

```bash
docker compose -f docker-compose.dev.yaml up -d --build
```

Ou, dependendo da sua versão:

```bash
docker-compose -f docker-compose.dev.yaml up -d --build
```

---

## 🌐 Acessos

- Frontend: [http://localhost:5173](http://localhost:5173)  
- API: [http://localhost:3008](http://localhost:3008)

---

## 📋 Informações Complementares

Outras instruções, configurações ou observações importantes podem ser adicionadas aqui conforme necessário.

---

## 🕓 Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Observações |
|--------|------|-----------|-----------|-------------|-------------|
| 1.0 | 31/05/2025 | Criação do documento | Natália Rodrigues | Harleny A. | Texto revisado |
| 1.1 | 02/06/2025 | Atualização do tutorial de execução | Gustavo C. | — | — |
