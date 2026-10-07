# OW VOD Timeline

Produto Overwatch do **Ideias IA Lab** para revisão pós-partida por momentos.

## Estado atual

MVP funcional iniciado em 07/10/2026.

## O que já funciona

- abrir vídeo local no navegador;
- reproduzir/pausar sem upload para servidor;
- usar o tempo atual do player;
- criar notas com timestamp;
- categorias de revisão: posicionamento, ultimate, prioridade de alvo, cooldown, teamfight, boa decisão e outro;
- registrar observação e próxima ação;
- pular do item da timeline para o timestamp do vídeo;
- excluir momentos;
- filtrar categorias;
- persistência local da timeline;
- exportar JSON;
- importar JSON;
- PT-BR principal + inglês;
- mobile;
- páginas Sobre, Privacidade e Termos;
- SEO básico;
- espaço preparado para anúncios fora do player;
- Static QA.

## Privacidade do MVP

O vídeo é reproduzido por uma URL local criada com `URL.createObjectURL`.

**O arquivo de vídeo não é enviado a servidor neste MVP.**

Nome da revisão e notas ficam em `localStorage`.

## QA

Execute:

`npm run check`

## Deploy

O workflow **Deploy GitHub Pages** está preparado.

Caso o Pages ainda não esteja habilitado:

1. Settings → Pages
2. Build and deployment
3. Source → GitHub Actions

## Gate antes de expandir

- [x] proposta de valor clara;
- [x] reprodução local;
- [x] timestamps;
- [x] notas + próxima ação;
- [x] filtros;
- [x] import/export JSON;
- [x] PT-BR/EN;
- [x] mobile;
- [x] páginas institucionais;
- [x] QA estático;
- [ ] GitHub Pages confirmado;
- [x] Browser E2E;
- [ ] testar MP4/WebM em Chrome/Edge;
- [ ] testar VOD longo;
- [ ] testar import/export real;
- [ ] revisar desktop/mobile publicado;
- [ ] feedback de usuários que revisam VOD.


> Browser E2E automatizado no GitHub Actions foi adicionado em 07/10/2026. O que resta neste gate é validação publicada/real e revisão dos casos específicos listados abaixo.

## V2 — somente após validação

- tags customizadas;
- atalhos de teclado;
- agrupamento por mapa/herói;
- comparação entre revisões;
- screenshot opcional do frame;
- sincronização em conta;
- compartilhamento de timeline sem o vídeo;
- templates por função.

## Compliance

Projeto independente e não afiliado à Blizzard Entertainment.

Overwatch e marcas relacionadas pertencem aos seus respectivos titulares.

Planejamento geral:

https://github.com/HelioConde/ideias-ia-lab
