# Tech feed reader

A small web app that pulls together articles from a few tech RSS feeds so you can skim them in one place. You can add your own feeds, remove ones you do not want, and everything you pick is saved in the browser (localStorage).

Built with [Next.js](https://nextjs.org). Feed data is fetched on the server and cached briefly so refreshes stay quick.

## Run it locally

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build   # production build
pnpm start   # run the production build
```
