# 🤝 Guia de Contribuição

Olá! 👋 Obrigado por se interessar em contribuir com o projeto **FTCEPodcast**.

Este guia tem como objetivo orientar contribuições de forma organizada, clara e produtiva.

---

## 📦 Como configurar o ambiente local

1. Faça um fork do repositório.
2. Clone o seu fork:
```bash
git clone https://github.com/seu-usuario/FTCEPodcast.git
cd FTCEPodcast
```
3. Configure as variáveis de ambiente conforme instruções no `README.md`.
4. Execute o projeto com Docker:
```bash
docker compose -f docker-compose.dev.yaml up -d --build
```

---

## 🛠️ Tipos de contribuição

Você pode contribuir de diversas formas, como:

- Corrigir erros ou bugs
- Melhorar a documentação
- Implementar novas funcionalidades
- Refatorar código
- Criar testes automatizados
- Sugerir melhorias através de *issues*

---

## 🧾 Convenções de commits

Utilizamos a convenção [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/) para nomear os commits. Exemplos:

- `feat: adicionar player de áudio`
- `fix: corrigir erro no carregamento de episódios`
- `docs: atualizar instruções de execução`
- `refactor: melhorar organização dos componentes`

---

## 🧪 Testes

Sempre que possível, adicione testes para as funcionalidades novas ou corrigidas.

---

## 🚀 Pull Requests

1. Crie uma branch descritiva a partir da `develop`:
```bash
git checkout -b feat/nova-funcionalidade
```
2. Faça commit das alterações e *push* para o seu fork.
3. Abra um **Pull Request** explicando:

- O que foi feito
- Por que foi feito
- Como testar

4. Aguarde revisão. Fique à vontade para interagir com os comentários dos revisores.

---

## 💬 Código de Conduta

Por favor, leia e siga o [Código de Conduta](./CODE_OF_CONDUCT.md).

---

## ❤️ Obrigado por contribuir!

Toda contribuição é muito bem-vinda e valorizada! 🚀
