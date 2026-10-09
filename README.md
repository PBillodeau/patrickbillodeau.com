# Patrick Billodeau | Portfolio

A small static portfolio, ready to deploy with GitHub Pages. There is no build step or package installation.

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

1. Push this repository to GitHub, using the `main` branch.
2. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
3. Push to `main` or run the **Deploy portfolio to GitHub Pages** workflow from the Actions tab.

The workflow publishes the files at the repository root. To use `patrickbillodeau.com`, add it as a custom domain under **Settings → Pages** and update the domain's DNS records to the values GitHub provides. Switching the domain replaces the current site, so first move `docker-intro` and `resume.pdf` into this repository and update their links if you want those URLs to keep working.