## Commands used to craft the folder

### Directory initialisation

```
npm init -y
```

Which will create a basic package.json file

### Install typescript dependencies

```
npm install typescript --savedev
```

```
npm install  --savedev
```

### Create the tsconfig.json 

```
npx tsc --init --rootDir src --outDir build \
--esModuleInterop --resolveJsonModule --lib es6 \
--module commonjs --allowJs true --noImplicitAny true
```

### Create the src directory
```
mkdir src
```

And add the ```index.js``` file containing :

```typescript
console.log('Hello')
```


### Enable cold reloading 

```bash
npm install --save-dev ts-node nodemon
```

Add a ```nodemon.json``` with de following content : 

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "npx ts-node ./src/index.ts"
}
```


### Production mode and script summary

In order to be able to clean the build directory easily we need : 
```bash
npm install --save-dev rimraf
```

**script summary**

Part of ```package.json```

```json
"scripts": {
    "start": "npx tsc && node build/index.js",
    "build": "npx tsc",
    "dev": "npx nodemon",
    "clean": "npx rimraf ./build",
  }
```

