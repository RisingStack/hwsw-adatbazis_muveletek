# HWSW training gyakorlatok

<!-- Do not edit the Table of Contents, instead regenerate with `npm run build-toc` -->

<!-- toc -->

- [Opcionalis hazi feladatok a kovetkezo alkalomra](#opcionalis-hazi-feladatok-a-kovetkezo-alkalomra)
- [Aszinkronitás JavaScript-ben](#aszinkronitas-javascript-ben)
  * [Callback-ek](#callback-ek)
    + [Hibakezelés](#hibakezeles)
  * [Promise-ok](#promise-ok)
    + [Promise állapotok](#promise-allapotok)
    + [Hibakezelés](#hibakezeles-1)
  * [Async - Await](#async---await)
    + [Hibakezelés](#hibakezeles-2)

<!-- tocstop -->

## Opcionalis hazi feladatok a kovetkezo alkalomra

A feladatok neha egymasra epulnek, fontos a sorrend.

1. A kovetkezo alkalmakon a json web token autentikaciot fogjuk hasznalni. Nezzetek be a [json auth fajlba](/src/web/auth/jwt.js) es keressetek meg a HAZI 1 kommentet.

2. Kelleni fog egy /me endpoint a frontend alkalmazasunkhoz kesobb. Nezzetek be a [router fajlba](/src/web/router.js) es keressetek meg a HAZI 2 kommentet.

3. A frontend-unk egy tokenre szamit a user mellet a /register endpoint-tol is. Nezzetek be a [userHandler fajlba](/src/web/userHandler.js) es keressetek meg a HAZI 3 kommentet.

4. A /login endpoint-nak validalnia kell a usert mielott token-t keszit rola es vissza kell adnia a user-t is a token mellett. Nezzetek be a [userHandler fajlba](/src/web/userHandler.js) es keressetek meg a HAZI 4 kommentet.

5. Implementaljatok ujra a jwt middleware-t a [passport](https://github.com/jaredhanson/passport) es [passport-jwt](https://github.com/themikenicholson/passport-jwt) library-vel.

## Aszinkronitás JavaScript-ben

A promise-ok és általában az aszinkron műveletek arra szolgálnak, hogy az olyan feladatok amelyek hosszab várakozási időket is tartalmazhatnak, ne blokkolják az egész javascript folyamatot az egyszálúság miatt. Ilyenek például a hálózati lekérések, adatbázisok, fájlok felé, amelyekre nem tudhatjuk mikor érkezik meg a válasz, ha egyáltalán kapunk választ. Ezeket a feladatokat 'félretesszük' addig, amíg el nem dől a végső értékük, így közben más feladatokat tudunk végezni.

A példákban a jelen mappa tartalmát fogjuk beolvasni, majd kiíratjuk azon fájlok tartalmát, amelyek mérete 3kB alatti.

### Callback-ek

Az első módszer ami elérhető volt aszinkron feladatok kezelésére a callback-ek használata volt, ahol a meghívott függvénynek megadtuk a következő függvényt is amit futtatni szeretnénk. Függvényeink ilyen módon történő egymásbaágyazása vezet a callback hell jelenségéhez, ami a kód jellegzetes kinézetére (piramis / karácsonyfa), és főként az átláthatatlanságára utal.

```javascript
// Az fs csomaggal férhetünk hozzá a fájlrendszer műveletekhez node.js-ben
const fs = require('fs');

function readSmallFiles(source) {
  // Először a mappa tartalmát olvassuk be, ezek file-ok és más mappák lesznek
  return fs.readdir(source, function(err, files) {
    if (err) {
      console.log('Error reading directory: ' + err);
    } else {
      files.forEach(function(filename, fileIndex) {
        console.log(filename);
        // A stat számos információt tartalmaz egy adott fájlról vagy mappáról, például azok méretét
        fs.stat(source + filename, function(err, stats) {
          if (err) {
            console.log('Error getting file statistics: ' + err);
          } else if (stats.size <= 3072 && stats.isFile()) {
            // Beolvassuk a file tartalmát
            fs.readFile(source + filename, (err, data) => {
              if (err) console.log('Error reading file: ' + err);
              if (data) console.log(data.toString());
            });
          }
        });
      });
    }
  });
}

const source = './';
readSmallFiles(source);
```

Ez alapján nem nehéz már elképzelni mi történne, ha további kóddal bővítenénk szkriptünket, csinálhatnánk még pár dolgot a fájlok tartalmával, egyre mélyebbre ásva ezzel magunkat a callback-ekbe.

#### Hibakezelés

Hibakezelés külön függvénnyel lehetséges, amit minden `if (error)` blokkban meghívunk a hibával, vagy lokálisan, a blokkban is írhatunk egyedi kezelési módot, ha erre lenne szükségünk.

### Promise-ok

A callback-el ellentétben a promise-ok használata önmagában nem eredményez nehezen átlátható kódot, 'flat' strunktúrát kapunk, amennyiben nem használunk callback-et váró függvényeket, csak egy szint málységig kell menjünk (a Promise is egy callback-et vár). A példánkban használt függvények sajnos nem támogatják még a promise-okat. A util csomag promisify függvényével átalakíthatjuk ezeket a függvényeket olyanokká, amik promise-t adnak vissza, de akár magunk is írhatunk egy ilyen függvényt.
//NOTE (ezzel lehetne a megértést tesztelni)

```javascript
// Az fs csomaggal férhetünk hozzá a fájlrendszer műveletekhez node.js-ben
const fs = require('fs');
const promisify = require('util').promisify;

const statistics = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);

function readSmallFiles(source) {
  return readdir(source)
    .then(files => {
      const promises = files.map(filename => {
        console.log(filename);
        // A stat számos információt tartalmaz egy adott fájlról vagy mappáról, például azok méretét
        return statistics(source + filename).then(stat => {
          stat.filename = filename;
          return stat;
        });
      });
      return Promise.all(promises);
    })
    .then(stats => {
      const promises = stats.reduce((accumulator, stat) => {
        if (stat.size <= 3072 && stat.isFile()) {
          accumulator.push(readfile(source + stat.filename));
        }
        return accumulator;
      }, []);
      return Promise.all(promises);
    })
    .then(fileContents => {
      return fileContents.map(data => console.log(data.toString()));
    })
    .catch(console.log);
}

const source = './';
readSmallFiles(source);
// Ez a sor előbb fog lefutni, mint az előtte található aszinkron hívás!
console.log('Starting async tasks');
```

Valamivel hosszabb kódot kaptunk ebben az esetben, azonban újabb műveletek hozzáadása könnyen kivitelezhető további .then() hívásokkal. A kódunk egyszerűbben is szedhető szét több modulra is így, hogy az inherens függvénybeágyazásokat lineárisra cseréltük.

Promise létrehozásakor meg kell adnunk neki egy függvényt ('executor'), ami végrehajtja a kívánt aszinkron feladatot. Ennek a függvénynek két függvény lesz az argumentuma, a resolve, amit helyes futás esetén hívunk meg az adattal, amit vissza szeretnénk adni a promise-ból. A másik a reject, amit hiba esetén hívunk meg, és magát a hiba objektumot adjuk be neki legtöbbször.

#### Promise állapotok

Létrejötte után a promise azonnal _**'pending'**_ állapotba kerül, ezzel jelezve hogy még nem áll készen a végső érték visszaadására (ez jó esetben az az adat lesz amit helyes fután esetén várunk), ha kiíratjuk ilyenkor a konzolra ezt fogjuk látni: `Promise { <pending> }`. Ezek után két irányba mehetünk, amennyiben nem történik hiba, a promise _**'resolved'**_ állapotba kerül, mi pedig ha hivatkozunk rá, már a várt értékünket kapjuk. Hiba esetén a promise _**'rejected'**_ állapotba kerül, és egy hibát fog dobni.

![Promise ábra][promise]

#### Hibakezelés

A hibát amit egy promise-ban kapunk minden esetben kezelnünk kell, különben az egész alkalmazásunk ki fog lépni a közeljövőben! (Jelenleg egy nem túl részletes 'Unhandled Promise Rejection'-t kapunk.) Erre használhatjuk a catch függvényt ami a promise-on érhető el akárcsak a then, egyetlen argumentuma a hiba lesz. Minden hiba az utána legközelebb eső catch-be fog lépni, és a program futása innen fog folytatódni, átlépve minden esetleges köztes kódot. Innen azonban akár újabb then-eket aggathatunk a promise-ra, ezek a catch után meg fognak hívódni - természetesen az itt bekövetkező hibákat újabb catch-ben kell kezelnünk.

### Async - Await

Az async és await kulcsszavak még egyszerűbbé teszi az aszinkron műveletek kezelését, nem szükséges hozzá then és catch lánc, az await megvárja amíg a függvény visszatér, és csak ezután halad tovább. Az await kulcsszó csak async-el jelölt függvényekben érhető el, függvényeken kívül a 'global' névtérben nem.

```javascript
// Az fs csomaggal férhetünk hozzá a fájlrendszer műveletekhez node.js-ben
const fs = require('fs');
const promisify = require('util').promisify;

const statistics = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);

async function readSmallFiles(source) {
  const files = await readdir(source);
  const stats = await Promise.all(
    files.map(async filename => {
      console.log(filename);
      // A stat számos információt tartalmaz egy adott fájlról vagy mappáról, például azok méretét
      const stat = await statistics(source + filename);
      stat.filename = filename;
      return stat;
    }),
  );
  const fileContents = await Promise.all(
    stats.reduce((accumulator, stat) => {
      if (stat.size <= 3072 && stat.isFile()) {
        accumulator.push(readfile(source + stat.filename));
      }
      return accumulator;
    }, []),
  );
  return fileContents.map(data => console.log(data.toString()));
}

const source = './';
readSmallFiles(source).catch(console.log);
// Ez a sor előbb fog lefutni, mint az előtte található aszinkron hívás!
console.log('Starting async tasks');
```

Az await promise-ba csomagolja a függvényt / egyéb értéket amit adunk neki, teljesen kompatibilis tehát a Promise.all függvénnyel is, és használhatjuk a catch függvényt ha helyben szeretnénk hibát kezelni. Az async függvény visszatérési értéke is mindig egy promise lesz, ha mi magunk nem is promise-t adunk vissza belőle.

#### Hibakezelés

Mivel minden érték amelyet await-el várunk, valamint maga az async függvény is promise-al tér vissza, használhatjuk a promise-ok catch függvényét a hibák elkapására. Egy másik, közkedveltebb mószer, hogy becsomagoljuk a kódunkat egy try-catch blokkba, amiben a catch blokkban lesz elérhető az hiba, amennyiben ráfutottunk egyre.

```javascript
const fs = require('fs');
const promisify = require('util').promisify;

const statistics = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);

async function readSmallFiles(source) {
  try {
    const files = await readdir(source);
    const stats = await Promise.all(
      files.map(async filename => {
        console.log(filename);
        const stat = await statistics(source + filename);
        stat.filename = filename;
        return stat;
      }),
    );
    const fileContents = await Promise.all(
      stats.reduce((accumulator, stat) => {
        if (stat.size <= 3072 && stat.isFile()) {
          accumulator.push(readfile(source + stat.filename));
        }
        return accumulator;
      }, []),
    );
    return fileContents.map(data => console.log(data.toString()));
  } catch (error) {
    console.log(error);
  }
}

const source = './';
readSmallFiles(source);
console.log('Starting async tasks');
```

A try-catch blokk egyébként száleskörűen alkalmazható, ha a try blokkban lévő kód hibát dob, a catch blokkban ugyanúgy elérjük, akár aszinkron a kódunk, akár nem. Az async-await elterjedésével vált az utóbbi időben népszerűvé javascript fejlesztők körében.

[promise]: ./promise.png 'Promise állapotok'
