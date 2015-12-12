# 6bin

6element sensors user interface.

In [6element](https://github.com/anthill/6element), we inform citizens of whether bins are available for each recycling centers. A first approach based on cameras, image detection and machine learning was considered, but it was found to be too hard to install on various recycling centers. The alternative solution is to have a screen near the sensor that people working at recycling centers can use to manually indicate when a bin is full.

This screen can be used to indicate other informations that is normally hard to get in real time like unexpected recycling center closing (due to too many bind being full, an accident, etc.).

## Instructions

### Install

```
npm install
npm i tsd -g
tsd init
tsd install
```

### Build

```
npm run build
```

You can also do, locally during development:

```
npm run watch
```

### Run the project

```
npm start
```

### Tests
```
npm test
```

## Communication

![6bin communication protocol](https://docs.google.com/drawings/d/1aTYHgLMnzJ5Vr5dZoLn4aSifguRt-rzbuOTvyQf1vO8/pub?w=960&h=540)

6bin client and 6bin server are linked via socketIO.
- Client => 'request' events => Server
- Server => 'response' events => Client

Two actions can trigger 'request' events from client:
- UPDATE_BIN in the case of bin availability change
- SET_BINS in the case of Bin list save after modifications

6bin server and 6brain are linked via EventEmitter.
- Server => 'measurementRequest' and 'binsRequest' events => 6brain
- 6brain => 'data' event => Server
