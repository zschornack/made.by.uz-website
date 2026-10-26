# made.by.uz website

Site-portfólio da agência made.by.uz. HTML, CSS e JS puros, sem build.

## Estrutura

```
index.html            página única (hero, projetos, sobre, stack, contato, rodapé)
assets/css/style.css  estilos (tokens de cor e fonte no :root)
assets/js/main.js     efeito dos cards no scroll, menu que encolhe, palavra rotativa
assets/img/           logos (preta e branca)
```

## Rodar localmente

Abra o `index.html` no navegador, ou sirva a pasta:

```
npx serve .
```

## O que falta preencher

- Número do WhatsApp: troque `5500000000000` nos links `wa.me` (DDI + DDD + número, só dígitos).
- E-mail: troque `contato@madebyuz.com`.
- Projetos: cada `<a class="card">` no `index.html` é um site. Troque nome, categoria, link e substitua o `<div class="shot ...">` por um `<img>` com o print.
- Textos do "Sobre", foto da equipe e links das redes sociais.
