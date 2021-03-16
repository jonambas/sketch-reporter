# sketch-reporter

Calculates design system coverage from Sketch files.

Demo: [sketch-reporter.vercel.app](https://sketch-reporter.vercel.app)

---

### Usage

In a folder with your Sketch files, run the following command with a glob to target your files:

```bash
npx sketch-reporter start --files "files/**/*.sketch"
```

This command creates a build which is outputted to a `dist` folder.

```bash
npx sketch-reporter build --files "files/**/*.sketch"
```
