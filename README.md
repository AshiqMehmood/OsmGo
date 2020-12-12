# POI Map! 

### Mapping less frustrating! 

_POI Map!_ is a Android application and a **P**rogressive **W**eb **A**pplications for contributing to OpenStreetMap.

Map your environment simply and fast, directly from the app. Keep your eyes wide open and contribute to OSM while on the run.


You can install the PWA or use on a web brower


A short user documentation can be found [here](docs/index.md).

 <p align="center">
  <img src="./docs/assets/map-vt.png?raw=true"/>
  <img src="./docs/assets/map-ortho.png?raw=true"/>
  <img src="./docs/assets/fiche.png?raw=true"/>
  <img src="./docs/assets/map-modif.png?raw=true"/>
  <img src="./docs/assets/select-primary-tag-velo.png?raw=true"/>
  <img src="https://raw.githubusercontent.com/wiki/DoFabien/OsmGo/assets/send-data.png"/>
</p>


### Dev
POI Map! is a _PWA_ application using Ionic 4 and Angular 8. It uses the map rendering engine Mapbox GL JS to display and run the in-app map.

#### Installation 
1) Install npm dependencies globally
```sh
npm install -g @angular/cli
npm install -g ionic
```
2) Clone this repo and install
```sh
https://gitlab.com/CFCIndia/OsmGo.git
cd OsmGo
npm install
```
3) Test it in a browser
```sh
ng serve 
```
4) Build (=> ./www)
```sh
ng build --prod 
```

## Contributing
If you want to contribute to POI Map! and make it better, your help is welcome !

 1. Create a personal fork of the project on Gitlab.
 2. Clone your fork on your local machine
 3. Create a new branch to work on! Branch from develop (feature) or master (hotfix)
 4. Implement your feature and tests
 5. Push your branch to your fork on Gitlab, the remote `origin`.
 6. From your fork open a pull request in the correct branch. 