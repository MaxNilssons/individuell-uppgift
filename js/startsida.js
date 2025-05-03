addMdToPage(`
# Psykisk ohälsa bland studenter i Indien

Det här projektet handlar om att undersöka hur olika faktorer hänger ihop med psykisk ohälsa bland studenter i Indien, baserat på enkätsvar från tusentals deltagare.

Jag har analyserat samband mellan **depression** och faktorer som:

- Akademiska prestationer (CGPA)
- Sömnvanor
- Upplevd akademisk press
- Kost och livsstil
- Mental ohälsa i familjen
- Kön
- Studietid per dag

Genom att kombinera databasfrågor, statistiska analyser och interaktiva visualiseringar har jag försökt identifiera mönster och förstå vilka faktorer som påverkar psykiskt mående mest.

---

## Metod

Datan kommer från en strukturerad enkätundersökning bland studenter i Indien. Jag har importerat datan till en SQLite-databas och använt SQL-frågor för att hämta relevanta värden.

Med hjälp av mallen har jag: 
- Grupperat data och beräknat medelvärden
- Genomfört statistiska tester (t.ex. t-test och korrelation)
- Visualiserat resultaten i interaktiva diagram via Google Charts
- Tillämpat filter (ex. kön) med dropdown för att kunna jämföra grupper.


---


`);

addMdToPage(`
## Indisk kontext: Studier, ekonomi och press

För att förstå resultaten är det viktigt att sätta dem i en social och kulturell kontext. I Indien är universitetsstudier starkt kopplade till framtida försörjning, status och familjens förväntningar.  

Det indiska utbildningssystemet är mycket konkurrensutsatt. Antagningsprocesser till eftergymnasiala utbildningar är ofta baserade på hårda inträdesprov, vilket skapar stress redan innan studierna börjar.  

Universitetsutbildning är i många fall inte gratis, och många studenter tar lån eller måste arbeta vid sidan av. Särskilt studenter från landsbygden eller fattigare delstater bär ofta ett större ansvar att lyckas – inte bara för sig själva, utan för hela familjen.

Sammantaget skapar detta en miljö där akademisk press och mental ohälsa lätt kan kopplas samman – något som också syns i dataanalysen.
`);
