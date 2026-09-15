# lpcasanova

Landing page do chá de casa nova do **João Pedro e Amanda**, com lista de presentes
que os convidados reservam pelo próprio site.

Cada presente só pode ser reservado uma vez: assim que alguém confirma, o item sai
da lista para todo mundo, com o nome de quem vai levar. Cada convidado reserva até
**3 presentes**.

Next.js 15 (App Router) + Upstash Redis. Feito para a Vercel.

---

## 1. Antes de publicar — edite estes dois arquivos

### `lib/event.ts` — os dados da festa

Data, horário, endereço e WhatsApp. As linhas marcadas com `>>> TROQUE <<<` são as
que importam. O link "Abrir no mapa" é montado a partir do endereço que você
escrever, então basta acertar `line1` e `line2`.

### `lib/gifts.ts` — a lista de presentes

Para mudar só o texto de um item, altere o `name`.

> **Não mude os `id`** depois que os convidados começarem a escolher — o `id` é a
> chave da reserva no banco. Mexeu no `id`, a reserva daquele item se perde.

---

## 2. Ligue o banco de dados (obrigatório)

Sem isso o site entra em **modo de demonstração**: aparece um aviso vermelho no
topo da lista e nada é salvo de verdade. Faça este passo antes de mandar o link
para qualquer pessoa.

1. Na Vercel, abra o projeto → aba **Storage** → **Create Database**
2. Escolha **Upstash for Redis** (o plano gratuito dá e sobra para uma festa)
3. Conecte ao projeto e mande **Redeploy**

A Vercel injeta `KV_REST_API_URL` e `KV_REST_API_TOKEN` sozinha — você não precisa
copiar nada. Assim que o deploy terminar, o aviso vermelho some.

---

## 3. Publicar na Vercel

```bash
git add -A
git commit -m "site do chá de casa nova"
git push
```

Depois, em [vercel.com/new](https://vercel.com/new), importe o repositório
`jotapemm/lpcasanova`. A Vercel reconhece o Next.js sozinha — é só clicar em
Deploy. Todo `git push` seguinte republica o site.

---

## 4. Ver quem vai levar o quê

Abra o próprio site: cada item reservado mostra o nome completo de quem escolheu.

Para conferir tudo de uma vez, o console da Upstash tem um terminal:

```
HGETALL cha:jpa:reservas
```

---

## 5. Zerar as reservas

Antes de divulgar o link, você vai querer apagar os testes. Duas formas:

- **No console da Upstash:** `DEL cha:jpa:reservas`
- **Pela Vercel:** crie a variável de ambiente `RESERVAS_KEY` com outro valor
  (ex.: `cha:jpa:oficial`) e faça redeploy. Começa do zero.

---

## 6. Rodar na sua máquina

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`. Sem as variáveis do Redis, as reservas ficam só na
memória e somem quando o servidor reinicia — o suficiente para testar o visual. Para
testar de verdade, copie `.env.example` para `.env.local` e preencha as chaves da
Upstash.

---

## Como a reserva funciona por dentro

Cada presente é um campo de um hash no Redis. A gravação usa `HSETNX`, que só
escreve se o campo ainda não existir e devolve 1 ou 0. Se dois convidados clicarem
no mesmo presente no mesmo instante, um recebe 1 e leva o item; o outro recebe 0 e
vê na hora a mensagem de que aquele presente acabou de sair — sem presente
duplicado e sem precisar de trava nenhuma.

O navegador guarda um id anônimo em `localStorage` só para o convidado conseguir
devolver o presente que ele mesmo reservou. Esse id nunca aparece para os outros.
